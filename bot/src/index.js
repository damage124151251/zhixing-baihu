import express from 'express';
import cors from 'cors';
import { config, TRADING_CONFIG, getTigerState, getRandomThought } from './config.js';
import {
    supabase,
    updateSystemStatus,
    initializeDatabase,
    upsertToken,
    recordTrade,
    createPosition,
    getOpenPositions,
    closePosition,
    updatePosition,
    getTradeStats,
    updateTigerState
} from './lib/supabase.js';
import { getTokenInfo, getLatestPairs, getBnbPrice } from './lib/dexscreener.js';
import { loadWallet, getWalletAddress, getSimulatedBalance, updateSimulatedBalance, setSimulatedBalance } from './lib/wallet.js';
import { simulateBuy, simulateSell } from './lib/pancakeswap.js';
import { analyzeWithClaude, quickAnalysis } from './lib/claude.js';
import { sleep, generateSimulatedTxHash, calculatePnL, validateTokenForTrading, calculateSanityChange } from './lib/utils.js';
import {
    logTigerBanner,
    logTigerState,
    logTigerReaction,
    logToken,
    logBuy,
    logSell,
    logSkip,
    logAnalysis,
    logTrade,
    logPosition,
    logStatus,
    logError,
    logSuccess,
    logInfo,
    logHeader,
    logSeparator
} from './lib/logger.js';

// ═══════════════════════════════════════════════════════════════
// 执行白虎 (ZHÍXÍNG BÁIHǓ) - O TIGRE QUE EXECUTA
// BSC Trading Bot - Modo Simulação
// ═══════════════════════════════════════════════════════════════

// Estado do Tigre
let sanity = 50;
let currentState = getTigerState(sanity);
let isRunning = false;
const processedTokens = new Set();

// Express API
const app = express();
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        name: '执行白虎',
        chain: 'BSC',
        mode: 'SIMULATION',
        sanity,
        state: currentState.nameEn,
        uptime: process.uptime()
    });
});

app.get('/status', async (req, res) => {
    const balance = getSimulatedBalance();
    const stats = await getTradeStats();
    res.json({
        status: isRunning ? 'ONLINE' : 'OFFLINE',
        balance,
        totalPnl: stats.totalPnl,
        winRate: stats.winRate,
        totalTrades: stats.wins + stats.losses,
        sanity,
        state: currentState.name,
        stateEn: currentState.nameEn,
        thought: getRandomThought(currentState)
    });
});

app.get('/positions', async (req, res) => {
    const positions = await getOpenPositions();
    res.json(positions);
});

app.get('/token/:ca', async (req, res) => {
    const info = await getTokenInfo(req.params.ca);
    res.json(info);
});

app.get('/analyze/:ca', async (req, res) => {
    const info = await getTokenInfo(req.params.ca);
    if (!info) return res.json({ error: '代币未找到' });

    const analysis = await analyzeWithClaude(info, sanity);
    res.json({ tokenInfo: info, analysis });
});

app.listen(config.PORT, () => {
    logInfo(`API 运行在 http://localhost:${config.PORT}`);
});

// ═══════════════════════════════════════════════════════════════
// PROCESS NEW TOKEN
// ═══════════════════════════════════════════════════════════════
async function processToken(tokenAddress, tokenInfo) {
    if (!tokenInfo) return null;

    logTigerReaction('newToken', currentState);

    // Quick filter primeiro
    const quickCheck = quickAnalysis(tokenInfo);
    if (!quickCheck.pass) {
        logSkip(tokenInfo.symbol, tokenInfo.mc, quickCheck.issues.join(', '));
        await upsertToken({
            ca: tokenAddress,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            market_cap: tokenInfo.mc,
            price: tokenInfo.price,
            liquidity: tokenInfo.liquidity,
            status: 'filtered',
            filter_reason: quickCheck.issues.join(', ')
        });
        return null;
    }

    // Validar para trading
    const validation = validateTokenForTrading(tokenInfo, TRADING_CONFIG);
    if (!validation.valid) {
        logSkip(tokenInfo.symbol, tokenInfo.mc, validation.errors.join(', '));
        await upsertToken({
            ca: tokenAddress,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            market_cap: tokenInfo.mc,
            price: tokenInfo.price,
            liquidity: tokenInfo.liquidity,
            status: 'rejected',
            filter_reason: validation.errors.join(', ')
        });
        return null;
    }

    // Salvar token inicial
    await upsertToken({
        ca: tokenAddress,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        market_cap: tokenInfo.mc,
        price: tokenInfo.price,
        liquidity: tokenInfo.liquidity,
        volume_24h: tokenInfo.volume24h,
        status: 'analyzing'
    });

    // Analisar com Claude/Basic
    const analysis = await analyzeWithClaude(tokenInfo, sanity);

    // Ajustar score baseado no estado do tigre
    const adjustedScore = Math.max(0, Math.min(100, analysis.score + currentState.scoreAdjust));

    logAnalysis(tokenInfo.symbol, adjustedScore, analysis.decision, analysis.hunt_analysis);

    // Atualizar token com análise
    await upsertToken({
        ca: tokenAddress,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        market_cap: tokenInfo.mc,
        price: tokenInfo.price,
        liquidity: tokenInfo.liquidity,
        tiger_score: adjustedScore,
        tiger_analysis: analysis.hunt_analysis,
        prey_quality: analysis.prey_quality,
        trap_detected: analysis.trap_detected,
        decision: analysis.decision,
        status: analysis.decision === 'BUY' && adjustedScore >= TRADING_CONFIG.MIN_SCORE_TO_BUY ? 'approved' : 'rejected'
    });

    // Log formatado
    logToken({
        action: analysis.decision === 'BUY' && adjustedScore >= TRADING_CONFIG.MIN_SCORE_TO_BUY ? 'BUY' : 'SKIP',
        symbol: tokenInfo.symbol,
        mc: tokenInfo.mc,
        mcChange: tokenInfo.priceChange24h || 0,
        bnb: 0,
        extra: `分数: ${adjustedScore} | ${analysis.hunt_analysis}`
    });

    // Auto-buy se aprovado
    if (adjustedScore >= TRADING_CONFIG.MIN_SCORE_TO_BUY && analysis.decision === 'BUY') {
        await executeBuy(tokenAddress, tokenInfo, adjustedScore);
    }

    return analysis;
}

// ═══════════════════════════════════════════════════════════════
// EXECUTE BUY (Simulado)
// ═══════════════════════════════════════════════════════════════
async function executeBuy(tokenAddress, tokenInfo, score) {
    const balance = getSimulatedBalance();

    // Calcular amount baseado no risco do estado
    let baseAmount = Math.min(TRADING_CONFIG.MAX_TRADE_BNB, balance * 0.1);
    baseAmount *= currentState.risk;

    if (baseAmount < 0.01 || balance < baseAmount) {
        logInfo(`余额不足: ${balance.toFixed(4)} BNB`);
        return null;
    }

    logTigerReaction('buy', currentState);

    // Simular compra
    const buyResult = await simulateBuy(tokenAddress, baseAmount, tokenInfo.priceNative || tokenInfo.price);

    if (buyResult.success) {
        // Atualizar balance simulado
        updateSimulatedBalance(-baseAmount);

        logBuy(tokenInfo.symbol, tokenInfo.mc, baseAmount, `TX: ${buyResult.txHash.slice(0, 16)}...`);

        // Registrar trade
        await recordTrade({
            token_ca: tokenAddress,
            type: 'buy',
            simulated_amount_bnb: baseAmount,
            simulated_price: tokenInfo.priceNative || tokenInfo.price,
            simulated_tokens: buyResult.tokensReceived,
            mental_state: currentState.nameEn,
            tiger_thought: getRandomThought(currentState),
            tx_hash: buyResult.txHash
        });

        // Criar posição
        await createPosition({
            token_ca: tokenAddress,
            simulated_entry_price: tokenInfo.priceNative || tokenInfo.price,
            simulated_amount_bnb: baseAmount,
            simulated_tokens: buyResult.tokensReceived,
            current_price: tokenInfo.priceNative || tokenInfo.price,
            mental_state_at_entry: currentState.nameEn,
            tiger_score: score
        });

        // Atualizar token status
        await upsertToken({
            ca: tokenAddress,
            status: 'holding'
        });

        return buyResult;
    }

    return null;
}

// ═══════════════════════════════════════════════════════════════
// MONITOR POSITIONS
// ═══════════════════════════════════════════════════════════════
async function monitorPositions() {
    const positions = await getOpenPositions();
    if (positions.length === 0) return;

    logInfo(`监控 ${positions.length} 个持仓...`);

    for (const position of positions) {
        try {
            const info = await getTokenInfo(position.token_ca);
            if (!info) continue;

            const currentPrice = info.priceNative || info.price;
            const { pnlPercent, pnlValue } = calculatePnL(
                position.simulated_entry_price,
                currentPrice,
                position.simulated_amount_bnb
            );

            // Atualizar posição
            await updatePosition(position.id, {
                current_price: currentPrice,
                simulated_pnl_percent: pnlPercent,
                simulated_pnl: pnlValue
            });

            const symbol = position.tokens?.symbol || '???';

            logPosition(
                symbol,
                position.simulated_entry_price,
                currentPrice,
                pnlPercent,
                position.simulated_amount_bnb
            );

            // Aplicar multiplicadores do estado
            const effectiveTP = TRADING_CONFIG.TAKE_PROFIT_PERCENT * currentState.tpMultiplier;
            const effectiveSL = TRADING_CONFIG.STOP_LOSS_PERCENT * currentState.slMultiplier;

            // Take Profit
            if (pnlPercent >= effectiveTP) {
                await executeSell(position, info, 'TP', pnlPercent, pnlValue);
            }
            // Stop Loss
            else if (pnlPercent <= effectiveSL) {
                await executeSell(position, info, 'SL', pnlPercent, pnlValue);
            }

            await sleep(500); // Rate limit
        } catch (e) {
            logError(`持仓监控错误: ${e.message}`);
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// EXECUTE SELL (Simulado)
// ═══════════════════════════════════════════════════════════════
async function executeSell(position, tokenInfo, reason, pnlPercent, pnlValue) {
    const symbol = position.tokens?.symbol || tokenInfo?.symbol || '???';

    logTigerReaction(pnlValue >= 0 ? 'profit' : 'loss', currentState);

    // Simular venda
    const sellResult = await simulateSell(
        position.token_ca,
        position.simulated_tokens,
        tokenInfo.priceNative || tokenInfo.price,
        position.simulated_entry_price
    );

    if (sellResult.success) {
        // Atualizar balance simulado (recebe de volta + PnL)
        updateSimulatedBalance(position.simulated_amount_bnb + pnlValue);

        const reasonCn = reason === 'TP' ? '止盈' : '止损';
        logSell(symbol, tokenInfo.mc, position.simulated_amount_bnb + pnlValue, pnlPercent, `${reasonCn} (${reason})`);

        // Registrar trade
        await recordTrade({
            token_ca: position.token_ca,
            type: 'sell',
            simulated_amount_bnb: position.simulated_amount_bnb + pnlValue,
            simulated_price: tokenInfo.priceNative || tokenInfo.price,
            simulated_pnl: pnlValue,
            simulated_pnl_percent: pnlPercent,
            mental_state: currentState.nameEn,
            tiger_thought: getRandomThought(currentState),
            tx_hash: sellResult.txHash,
            exit_reason: reason
        });

        // Fechar posição
        await closePosition(position.id, pnlValue, pnlPercent);

        // Atualizar token status
        await upsertToken({
            ca: position.token_ca,
            status: reason === 'TP' ? 'sold_tp' : 'sold_sl'
        });

        // Atualizar sanity
        const result = pnlValue >= 0 ?
            (pnlPercent >= 30 ? 'big_win' : 'win') :
            (pnlPercent <= -15 ? 'big_loss' : 'loss');

        const { change, newSanity } = calculateSanityChange(result, sanity);
        sanity = newSanity;
        currentState = getTigerState(sanity);

        await updateTigerState(sanity, currentState.nameEn, getRandomThought(currentState));

        logTigerState(currentState, sanity, getRandomThought(currentState));

        return sellResult;
    }

    return null;
}

// ═══════════════════════════════════════════════════════════════
// SCAN NEW TOKENS
// ═══════════════════════════════════════════════════════════════
async function scanNewTokens() {
    try {
        logInfo('扫描新代币... (Scanning novos tokens)');
        const pairs = await getLatestPairs('bsc');

        let processed = 0;
        for (const pair of pairs.slice(0, 30)) { // Top 30 mais recentes
            if (processedTokens.has(pair.address)) continue;
            processedTokens.add(pair.address);

            // Filtros básicos rápidos
            if (pair.liquidity < TRADING_CONFIG.MIN_LIQUIDITY) continue;
            if (pair.mc < TRADING_CONFIG.MIN_MC || pair.mc > TRADING_CONFIG.MAX_MC) continue;

            // Buscar info completa
            const info = await getTokenInfo(pair.address);
            if (info) {
                await processToken(pair.address, info);
                processed++;
            }

            await sleep(2000); // Rate limit
        }

        if (processed > 0) {
            logInfo(`处理了 ${processed} 个新代币`);
        }
    } catch (e) {
        logError(`扫描错误: ${e.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════
// UPDATE STATS
// ═══════════════════════════════════════════════════════════════
async function updateStats() {
    const balance = getSimulatedBalance();
    const stats = await getTradeStats();

    await updateSystemStatus({
        status: 'ONLINE',
        simulated_balance: balance,
        total_pnl: stats.totalPnl,
        total_pnl_percent: TRADING_CONFIG.STARTING_BALANCE > 0
            ? ((balance - TRADING_CONFIG.STARTING_BALANCE) / TRADING_CONFIG.STARTING_BALANCE) * 100
            : 0,
        total_trades: stats.wins + stats.losses,
        wins: stats.wins,
        losses: stats.losses,
        win_rate: stats.winRate,
        sanity,
        mental_state: currentState.nameEn,
        current_thought: getRandomThought(currentState),
        is_simulation: true
    });

    logStatus('在线', balance, stats.totalPnl, stats.winRate, `${stats.wins + stats.losses} 交易`);
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
async function main() {
    logTigerBanner();
    logHeader('执行白虎 启动中... (ZHÍXÍNG BÁIHǓ INICIANDO)');

    // Inicializar database
    await initializeDatabase();
    logSuccess('数据库已初始化');

    // Carregar wallet (opcional)
    const wallet = loadWallet();
    if (wallet) {
        logInfo(`真实钱包: ${getWalletAddress().slice(0, 10)}...`);
    }

    // Definir balance simulado inicial
    setSimulatedBalance(TRADING_CONFIG.STARTING_BALANCE);

    // Status inicial
    await updateSystemStatus({
        status: 'STARTING',
        simulated_balance: TRADING_CONFIG.STARTING_BALANCE,
        sanity,
        mental_state: currentState.nameEn,
        current_thought: getRandomThought(currentState),
        is_simulation: true
    });

    // Log estado inicial do tigre
    logTigerState(currentState, sanity, getRandomThought(currentState));

    // Marcar como running
    isRunning = true;
    await updateSystemStatus({ status: 'ONLINE' });
    logSuccess('连接成功 (Conectado à BSC)');

    // Scan inicial
    await scanNewTokens();

    // Loop de scan de novos tokens
    setInterval(scanNewTokens, TRADING_CONFIG.TOKEN_SCAN_INTERVAL);

    // Loop de monitoramento de posições
    setInterval(monitorPositions, TRADING_CONFIG.POSITION_CHECK_INTERVAL);

    // Loop de atualização de stats
    setInterval(updateStats, TRADING_CONFIG.STATS_UPDATE_INTERVAL);

    // Log periódico do estado do tigre
    setInterval(() => {
        logTigerState(currentState, sanity, getRandomThought(currentState));
    }, 120000); // A cada 2 minutos

    logSuccess('执行白虎启动成功! (Bot iniciado com sucesso!)');
    logSeparator();
    logInfo('模式: 模拟交易 (Paper Trading)');
    logInfo(`初始余额: ${TRADING_CONFIG.STARTING_BALANCE} BNB`);
    logInfo(`最低分数: ${TRADING_CONFIG.MIN_SCORE_TO_BUY}`);
    logInfo(`止盈: +${TRADING_CONFIG.TAKE_PROFIT_PERCENT}% | 止损: ${TRADING_CONFIG.STOP_LOSS_PERCENT}%`);
    logSeparator();
}

// ═══════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════
async function shutdown(signal) {
    logInfo(`收到 ${signal}, 正在关闭... (Encerrando)`);

    isRunning = false;

    try {
        await updateSystemStatus({
            status: 'OFFLINE',
            current_thought: '白虎休息中... (Tigre descansando)'
        });
        logSuccess('状态已更新为离线');

        await sleep(1000);

        logHeader('执行白虎已关闭 (BOT ENCERRADO)');
        logInfo('"观察。等待。执行。"');

        process.exit(0);
    } catch (error) {
        logError(`关闭错误: ${error.message}`);
        process.exit(1);
    }
}

// Capturar sinais de término
process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // kill

process.on('uncaughtException', async (error) => {
    logError(`Uncaught Exception: ${error.message}`);
    console.error(error);
    await updateSystemStatus({ status: 'ERROR' });
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('[FATAL] Unhandled Rejection:', reason);
    await updateSystemStatus({ status: 'ERROR' });
    process.exit(1);
});

// Start
main().catch(console.error);
