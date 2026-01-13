import { ethers } from 'ethers';
import { config } from '../config.js';
import { logInfo, logError, logSuccess } from './logger.js';

// ═══════════════════════════════════════════════════════════════
// 执行白虎 WALLET - BNB Wallet Operations
// ═══════════════════════════════════════════════════════════════

let wallet = null;
let provider = null;

// ═══════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════
export function getProvider() {
    if (provider) return provider;

    try {
        provider = new ethers.JsonRpcProvider(config.BSC_RPC);
        return provider;
    } catch (e) {
        logError(`Provider erro: ${e.message}`);
        // Tentar backup
        try {
            provider = new ethers.JsonRpcProvider(config.BSC_RPC_BACKUP);
            return provider;
        } catch (e2) {
            logError(`Backup provider erro: ${e2.message}`);
            return null;
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// WALLET
// ═══════════════════════════════════════════════════════════════
export function loadWallet() {
    try {
        if (!config.WALLET_PRIVATE_KEY) {
            logInfo('无钱包配置 (Nenhuma wallet configurada) - Modo simulação');
            return null;
        }

        const pk = config.WALLET_PRIVATE_KEY.trim();
        // Adiciona 0x se não tiver
        const privateKey = pk.startsWith('0x') ? pk : `0x${pk}`;

        const prov = getProvider();
        if (!prov) {
            logError('无法连接到BSC RPC');
            return null;
        }

        wallet = new ethers.Wallet(privateKey, prov);
        logSuccess(`钱包已加载: ${wallet.address.slice(0, 10)}...`);
        return wallet;
    } catch (e) {
        logError(`钱包错误: ${e.message}`);
        return null;
    }
}

export function getWallet() {
    return wallet;
}

export function getWalletAddress() {
    return wallet ? wallet.address : null;
}

// ═══════════════════════════════════════════════════════════════
// BALANCE
// ═══════════════════════════════════════════════════════════════
export async function getBalance() {
    if (!wallet) return 0;

    try {
        const prov = getProvider();
        const balance = await prov.getBalance(wallet.address);
        return parseFloat(ethers.formatEther(balance));
    } catch (e) {
        logError(`余额错误: ${e.message}`);
        return 0;
    }
}

export async function getTokenBalance(tokenAddress) {
    if (!wallet) return 0;

    try {
        const prov = getProvider();
        const abi = [
            'function balanceOf(address) view returns (uint256)',
            'function decimals() view returns (uint8)'
        ];
        const contract = new ethers.Contract(tokenAddress, abi, prov);

        const [balance, decimals] = await Promise.all([
            contract.balanceOf(wallet.address),
            contract.decimals()
        ]);

        return parseFloat(ethers.formatUnits(balance, decimals));
    } catch (e) {
        logError(`代币余额错误: ${e.message}`);
        return 0;
    }
}

// ═══════════════════════════════════════════════════════════════
// GAS PRICE
// ═══════════════════════════════════════════════════════════════
export async function getGasPrice() {
    try {
        const prov = getProvider();
        const feeData = await prov.getFeeData();
        return feeData.gasPrice || ethers.parseUnits(String(config.GAS_PRICE_GWEI), 'gwei');
    } catch (e) {
        return ethers.parseUnits(String(config.GAS_PRICE_GWEI), 'gwei');
    }
}

// ═══════════════════════════════════════════════════════════════
// SIMULATED BALANCE (para modo simulação)
// ═══════════════════════════════════════════════════════════════
let simulatedBalance = 10.0; // 10 BNB inicial

export function getSimulatedBalance() {
    return simulatedBalance;
}

export function updateSimulatedBalance(amount) {
    simulatedBalance += amount;
    return simulatedBalance;
}

export function setSimulatedBalance(amount) {
    simulatedBalance = amount;
    return simulatedBalance;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN POSITIONS (simuladas)
// ═══════════════════════════════════════════════════════════════
const simulatedPositions = new Map();

export function getSimulatedPositions() {
    return Array.from(simulatedPositions.values());
}

export function addSimulatedPosition(tokenAddress, data) {
    simulatedPositions.set(tokenAddress, {
        ...data,
        tokenAddress,
        openedAt: new Date().toISOString()
    });
}

export function removeSimulatedPosition(tokenAddress) {
    simulatedPositions.delete(tokenAddress);
}

export function getSimulatedPosition(tokenAddress) {
    return simulatedPositions.get(tokenAddress);
}
