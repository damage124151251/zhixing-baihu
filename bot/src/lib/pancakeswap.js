import { ethers } from 'ethers';
import { config, TRADING_CONFIG } from '../config.js';
import { getWallet, getProvider, getGasPrice } from './wallet.js';
import { logInfo, logError, logSuccess } from './logger.js';
import { generateSimulatedTxHash } from './utils.js';

// ═══════════════════════════════════════════════════════════════
// 执行白虎 PANCAKESWAP - Trading via Router V2
// ═══════════════════════════════════════════════════════════════

// ABIs mínimas
const ROUTER_ABI = [
    'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
    'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)'
];

const ERC20_ABI = [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function balanceOf(address account) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function getRouter() {
    const wallet = getWallet();
    if (!wallet) return null;
    return new ethers.Contract(config.PANCAKE_ROUTER, ROUTER_ABI, wallet);
}

function getTokenContract(tokenAddress) {
    const wallet = getWallet();
    if (!wallet) return null;
    return new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
}

// ═══════════════════════════════════════════════════════════════
// SIMULATED BUY (Modo Simulação)
// ═══════════════════════════════════════════════════════════════
export async function simulateBuy(tokenAddress, amountBnb, currentPrice) {
    const txHash = generateSimulatedTxHash();

    // Calcula quantidade de tokens que receberia
    const tokensReceived = amountBnb / currentPrice;

    logSuccess(`[模拟] 买入 ${amountBnb} BNB → ~${tokensReceived.toFixed(2)} tokens`);

    return {
        success: true,
        txHash,
        type: 'buy',
        amountBnb,
        tokensReceived,
        price: currentPrice,
        timestamp: new Date().toISOString()
    };
}

// ═══════════════════════════════════════════════════════════════
// SIMULATED SELL (Modo Simulação)
// ═══════════════════════════════════════════════════════════════
export async function simulateSell(tokenAddress, tokensAmount, currentPrice, entryPrice) {
    const txHash = generateSimulatedTxHash();

    // Calcula BNB que receberia
    const bnbReceived = tokensAmount * currentPrice;
    const entryValue = tokensAmount * entryPrice;
    const pnl = bnbReceived - entryValue;
    const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;

    logSuccess(`[模拟] 卖出 ${tokensAmount.toFixed(2)} tokens → ${bnbReceived.toFixed(4)} BNB (PnL: ${pnl >= 0 ? '+' : ''}${pnl.toFixed(4)} BNB)`);

    return {
        success: true,
        txHash,
        type: 'sell',
        tokensAmount,
        bnbReceived,
        pnl,
        pnlPercent,
        price: currentPrice,
        timestamp: new Date().toISOString()
    };
}

// ═══════════════════════════════════════════════════════════════
// REAL BUY (Token ← BNB) - Para uso futuro
// ═══════════════════════════════════════════════════════════════
export async function buyToken(tokenAddress, amountBnb, slippage = 15) {
    // Se modo simulação, usar simulação
    if (TRADING_CONFIG.IS_SIMULATION) {
        logInfo('使用模拟模式 (Usando modo simulação)');
        return null; // Caller should use simulateBuy instead
    }

    const wallet = getWallet();
    if (!wallet) {
        logError('钱包未配置');
        return null;
    }

    try {
        const router = getRouter();
        const amountIn = ethers.parseEther(String(amountBnb));
        const path = [config.WBNB, tokenAddress];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 min

        // Calcula output esperado
        let amountOutMin = 0n;
        try {
            const amounts = await router.getAmountsOut(amountIn, path);
            const expectedOut = amounts[1];
            amountOutMin = expectedOut * BigInt(100 - slippage) / 100n;
        } catch (e) {
            logInfo('无法计算amountOut，使用0');
        }

        const gasPrice = await getGasPrice();

        logInfo(`买入 ${amountBnb} BNB 的 ${tokenAddress.slice(0, 10)}...`);

        const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            path,
            wallet.address,
            deadline,
            {
                value: amountIn,
                gasLimit: config.GAS_LIMIT,
                gasPrice
            }
        );

        const receipt = await tx.wait();
        logSuccess(`TX: ${receipt.hash}`);
        return receipt.hash;

    } catch (e) {
        logError(`买入错误: ${e.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════
// REAL SELL (Token → BNB) - Para uso futuro
// ═══════════════════════════════════════════════════════════════
export async function sellToken(tokenAddress, percentOrAmount = 100, slippage = 15) {
    // Se modo simulação, usar simulação
    if (TRADING_CONFIG.IS_SIMULATION) {
        logInfo('使用模拟模式 (Usando modo simulação)');
        return null; // Caller should use simulateSell instead
    }

    const wallet = getWallet();
    if (!wallet) {
        logError('钱包未配置');
        return null;
    }

    try {
        const router = getRouter();
        const token = getTokenContract(tokenAddress);
        const path = [tokenAddress, config.WBNB];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

        // Pega balance do token
        const balance = await token.balanceOf(wallet.address);
        if (balance === 0n) {
            logError('无代币可卖');
            return null;
        }

        // Calcula amount a vender
        let amountIn;
        if (percentOrAmount >= 100) {
            amountIn = balance;
        } else {
            amountIn = balance * BigInt(percentOrAmount) / 100n;
        }

        // Verifica/faz approve
        const allowance = await token.allowance(wallet.address, config.PANCAKE_ROUTER);
        if (allowance < amountIn) {
            logInfo('授权代币中...');
            const approveTx = await token.approve(
                config.PANCAKE_ROUTER,
                ethers.MaxUint256,
                { gasLimit: 100000 }
            );
            await approveTx.wait();
            logSuccess('代币已授权');
        }

        // Calcula output mínimo
        let amountOutMin = 0n;
        try {
            const amounts = await router.getAmountsOut(amountIn, path);
            const expectedOut = amounts[1];
            amountOutMin = expectedOut * BigInt(100 - slippage) / 100n;
        } catch (e) {
            logInfo('无法计算amountOut，使用0');
        }

        const gasPrice = await getGasPrice();

        logInfo(`卖出 ${percentOrAmount}% 的 ${tokenAddress.slice(0, 10)}...`);

        const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            path,
            wallet.address,
            deadline,
            {
                gasLimit: config.GAS_LIMIT,
                gasPrice
            }
        );

        const receipt = await tx.wait();
        logSuccess(`TX: ${receipt.hash}`);
        return receipt.hash;

    } catch (e) {
        logError(`卖出错误: ${e.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════
// CHECK LIQUIDITY
// ═══════════════════════════════════════════════════════════════
export async function checkLiquidity(tokenAddress) {
    try {
        const router = getRouter();
        if (!router) return false;

        const testAmount = ethers.parseEther('0.01');
        const path = [config.WBNB, tokenAddress];

        await router.getAmountsOut(testAmount, path);
        return true;
    } catch (e) {
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════
// GET EXPECTED OUTPUT
// ═══════════════════════════════════════════════════════════════
export async function getExpectedOutput(tokenAddress, amountBnb, isBuy = true) {
    try {
        const router = getRouter();
        if (!router) return null;

        const amount = ethers.parseEther(String(amountBnb));
        const path = isBuy
            ? [config.WBNB, tokenAddress]
            : [tokenAddress, config.WBNB];

        const amounts = await router.getAmountsOut(amount, path);
        return amounts[1];
    } catch (e) {
        return null;
    }
}
