import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════
// 执行白虎 LOGGER - Logs Estilo Pro com Tema Chinês
// ═══════════════════════════════════════════════════════════════

const LOG_DIR = './logs';
let logFile = null;

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    if (!logFile) {
        const date = new Date().toISOString().split('T')[0];
        logFile = path.join(LOG_DIR, `tiger-${date}.log`);
    }
}

function saveToFile(line) {
    try {
        ensureLogDir();
        const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, ''); // Remove ANSI colors
        fs.appendFileSync(logFile, cleanLine + '\n');
    } catch (e) { /* ignore */ }
}

// Helpers
function padRight(str, len) {
    str = String(str || '');
    return str.length >= len ? str.slice(0, len) : str + ' '.repeat(len - str.length);
}

function padLeft(str, len) {
    str = String(str || '');
    return str.length >= len ? str.slice(0, len) : ' '.repeat(len - str.length) + str;
}

function formatMC(value) {
    if (!value) return '0';
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    return value.toFixed(2);
}

function formatPercent(value) {
    if (value === undefined || value === null) return '+0%';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(0)}%`;
}

function formatBNB(value) {
    if (!value) return '0.00';
    return parseFloat(value).toFixed(4);
}

function formatVol(value) {
    if (!value) return '0';
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toFixed(0);
}

function timestamp() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}

// ═══════════════════════════════════════════════════════════════
// TIGER BANNER
// ═══════════════════════════════════════════════════════════════
export function logTigerBanner() {
    const banner = `
${chalk.white('    ╔══════════════════════════════════════════════════════════╗')}
${chalk.white('    ║')}  ${chalk.yellow('执行白虎')} ${chalk.gray('ZHÍXÍNG BÁIHǓ')} ${chalk.white('- O Tigre que Executa')}     ${chalk.white('║')}
${chalk.white('    ║')}  ${chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}  ${chalk.white('║')}
${chalk.white('    ║')}  ${chalk.cyan('观察。等待。执行。')}                                     ${chalk.white('║')}
${chalk.white('    ║')}  ${chalk.gray('Observar. Esperar. Executar.')}                          ${chalk.white('║')}
${chalk.white('    ║')}                                                            ${chalk.white('║')}
${chalk.white('    ║')}  ${chalk.yellow('🐯')} ${chalk.white('Rede:')} ${chalk.green('BNB Smart Chain')}  ${chalk.gray('|')}  ${chalk.white('Modo:')} ${chalk.magenta('SIMULAÇÃO')}     ${chalk.white('║')}
${chalk.white('    ╚══════════════════════════════════════════════════════════╝')}
`;
    console.log(banner);
    saveToFile(banner);
}

// ═══════════════════════════════════════════════════════════════
// TIGER STATE LOG
// ═══════════════════════════════════════════════════════════════
export function logTigerState(state, sanity, thought) {
    const stateColor = sanity >= 80 ? chalk.red :
                       sanity >= 60 ? chalk.green :
                       sanity >= 40 ? chalk.yellow :
                       sanity >= 20 ? chalk.magenta : chalk.gray;

    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[虎态]'),
        stateColor(`${state.emoji} ${state.name}`),
        chalk.gray('|'),
        chalk.cyan('精神:'),
        stateColor(`${sanity}%`),
        chalk.gray('|'),
        chalk.white(thought)
    ].join(' ');

    console.log(line);
    saveToFile(line);
}

// ═══════════════════════════════════════════════════════════════
// TOKEN LOGS
// ═══════════════════════════════════════════════════════════════
export function logToken({ action, symbol, name, mc, mcChange, bnb, vol5m, volTotal, volPercent, extra }) {
    let badge;
    switch(action) {
        case 'BUY':
        case 'PURCH':
            badge = chalk.bgGreen.black(` ${padRight(action, 5)} `);
            break;
        case 'SELL':
            badge = chalk.bgRed.white(` ${padRight(action, 5)} `);
            break;
        case 'SKIP':
            badge = chalk.bgYellow.black(` ${padRight(action, 5)} `);
            break;
        case 'NEW':
            badge = chalk.bgCyan.black(` ${padRight(action, 5)} `);
            break;
        default:
            badge = chalk.bgBlue.white(` ${padRight(action || 'INFO', 5)} `);
    }

    const symColor = action === 'BUY' || action === 'PURCH' ? chalk.green :
                     action === 'SELL' ? chalk.red :
                     action === 'SKIP' ? chalk.yellow :
                     action === 'NEW' ? chalk.cyan : chalk.white;

    const mcChgColor = (mcChange || 0) >= 0 ? chalk.green : chalk.red;

    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.gray('[') + badge + chalk.gray(']'),
        symColor(padRight(symbol || name || '???', 12)),
        chalk.magenta('MC:'),
        chalk.white(padLeft(formatMC(mc), 9)),
        mcChgColor(padLeft(formatPercent(mcChange), 6)),
        chalk.gray('|'),
        chalk.cyan('BNB:'),
        chalk.white(padLeft(formatBNB(bnb), 8)),
        extra ? chalk.gray('| ' + extra) : ''
    ].filter(Boolean).join(' ');

    console.log(line);
    saveToFile(line);
}

export function logBuy(symbol, mc, bnb, extra = '') {
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.bgGreen.black(' 买入  '),
        chalk.green(padRight(symbol, 12)),
        chalk.magenta('MC:'),
        chalk.white(formatMC(mc)),
        chalk.gray('|'),
        chalk.cyan('BNB:'),
        chalk.white(formatBNB(bnb)),
        extra ? chalk.gray('| ' + extra) : ''
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logSell(symbol, mc, bnb, pnl, extra = '') {
    const pnlColor = pnl >= 0 ? chalk.green : chalk.red;
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.bgRed.white(' 卖出  '),
        chalk.red(padRight(symbol, 12)),
        chalk.magenta('MC:'),
        chalk.white(formatMC(mc)),
        chalk.gray('|'),
        chalk.cyan('PnL:'),
        pnlColor(formatPercent(pnl)),
        chalk.gray('|'),
        chalk.cyan('BNB:'),
        chalk.white(formatBNB(bnb)),
        extra ? chalk.gray('| ' + extra) : ''
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logSkip(symbol, mc, reason) {
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.bgYellow.black(' 跳过  '),
        chalk.yellow(padRight(symbol, 12)),
        chalk.magenta('MC:'),
        chalk.white(formatMC(mc)),
        chalk.gray('|'),
        chalk.gray(reason)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logAnalysis(symbol, score, decision, thought = '') {
    const scoreColor = score >= 75 ? chalk.green : score >= 50 ? chalk.yellow : chalk.red;
    const decBadge = decision === 'BUY' ? chalk.bgGreen.black(' 买入 ') : chalk.bgRed.white(' 跳过 ');
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.bgMagenta.white('  AI   '),
        chalk.white(padRight(symbol, 12)),
        chalk.cyan('分数:'),
        scoreColor(padLeft(String(score), 3)),
        chalk.gray('|'),
        decBadge,
        thought ? chalk.gray('| ' + thought) : ''
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logTrade(type, symbol, bnb, tx) {
    const badge = type === 'buy' ? chalk.bgGreen.black(' 买入   ') : chalk.bgRed.white(' 卖出   ');
    const symColor = type === 'buy' ? chalk.green : chalk.red;
    const actionCn = type === 'buy' ? '模拟买入' : '模拟卖出';
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        badge,
        symColor(padRight(symbol, 12)),
        chalk.cyan('BNB:'),
        chalk.white(formatBNB(bnb)),
        chalk.gray('|'),
        chalk.gray(actionCn),
        tx ? chalk.blue(tx.slice(0, 16) + '...') : ''
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logPosition(symbol, entryPrice, currentPrice, pnlPercent, bnb) {
    const pnlColor = pnlPercent >= 0 ? chalk.green : chalk.red;
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.bgCyan.black(' 持仓  '),
        chalk.white(padRight(symbol, 12)),
        chalk.gray('入场:'),
        chalk.white(entryPrice.toFixed(10)),
        chalk.gray('|'),
        chalk.gray('现价:'),
        chalk.white(currentPrice.toFixed(10)),
        chalk.gray('|'),
        chalk.cyan('PnL:'),
        pnlColor(formatPercent(pnlPercent)),
        chalk.gray('|'),
        chalk.cyan('BNB:'),
        chalk.white(formatBNB(bnb))
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM LOGS
// ═══════════════════════════════════════════════════════════════
export function logStatus(status, balance, pnl, winRate, extra = '') {
    const pnlColor = pnl >= 0 ? chalk.green : chalk.red;
    const statusCn = status === 'ONLINE' ? '在线' : status === 'STARTING' ? '启动中' : status;
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.bgCyan.black(' 系统  '),
        chalk.white(padRight(statusCn, 10)),
        chalk.gray('|'),
        chalk.cyan('余额:'),
        chalk.white(formatBNB(balance) + ' BNB'),
        chalk.gray('|'),
        chalk.cyan('PnL:'),
        pnlColor((pnl >= 0 ? '+' : '') + formatBNB(pnl) + ' BNB'),
        chalk.gray('|'),
        chalk.cyan('胜率:'),
        chalk.white(winRate.toFixed(1) + '%'),
        extra ? chalk.gray('| ' + extra) : ''
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logError(message) {
    const line = [
        chalk.gray(timestamp()),
        chalk.red('[错误]'),
        chalk.bgRed.white(' ERR   '),
        chalk.red(message)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logSuccess(message) {
    const line = [
        chalk.gray(timestamp()),
        chalk.green('[INFO]'),
        chalk.bgGreen.black('  OK   '),
        chalk.green(message)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logInfo(message) {
    const line = [
        chalk.gray(timestamp()),
        chalk.gray('[INFO]'),
        chalk.bgGray.white(' INFO  '),
        chalk.white(message)
    ].join(' ');
    console.log(line);
    saveToFile(line);
}

export function logHeader(title) {
    const line = chalk.yellow(`\n${'═'.repeat(70)}\n  ${title}\n${'═'.repeat(70)}\n`);
    console.log(line);
    saveToFile(`\n${'═'.repeat(70)}\n  ${title}\n${'═'.repeat(70)}\n`);
}

export function logSeparator() {
    const line = chalk.gray('─'.repeat(70));
    console.log(line);
    saveToFile('─'.repeat(70));
}

// ═══════════════════════════════════════════════════════════════
// TIGER REACTIONS
// ═══════════════════════════════════════════════════════════════
export function logTigerReaction(event, state, extra = '') {
    const reactions = {
        newToken: {
            LIESHA: "新猎物检测到！分析中...(Nova presa detectada!)",
            QIANFU: "地形有动静。白虎观察。(Movimento no terreno.)",
            GUANCHA: "新代币。看看有什么。(Token novo. Vamos ver.)",
            JINGJUE: "新代币...但白虎谨慎。(Novo token... cautela.)",
            SHOUSHANG: "检测到，但不是狩猎时间。(Detectado, mas não é hora.)",
        },
        buy: {
            LIESHA: "执行！模拟入场！狩猎开始！🐯",
            QIANFU: "埋伏设好。模拟持仓开启。",
            GUANCHA: "测试入场。模拟激活。",
            JINGJUE: "冒险入场，但经过计算。模拟中。",
            SHOUSHANG: "即使受伤，白虎仍在狩猎...小心地。",
        },
        sell: {
            LIESHA: "猎物捕获！退出执行！🏆",
            QIANFU: "干净撤离。如计划。",
            GUANCHA: "仓位关闭。分析结果。",
            JINGJUE: "安全退出。保护收益。",
            SHOUSHANG: "撤退中。生存第一。",
        },
        profit: {
            LIESHA: "白虎今天吃得好！🔥💰",
            QIANFU: "悄悄捕获利润。",
            GUANCHA: "正面结果记录。",
            JINGJUE: "利润就是利润。白虎认可。",
            SHOUSHANG: "隧道尽头有光...",
        },
        loss: {
            LIESHA: "一个猎物逃跑了。还会有其他的。",
            QIANFU: "控制亏损。狩猎的一部分。",
            GUANCHA: "错误记录。学习中。",
            JINGJUE: "市场反击了。调整中。",
            SHOUSHANG: "又一个伤口...需要休息。",
        },
        rug: {
            LIESHA: "陷阱！但白虎更快！",
            QIANFU: "他们试图猎杀我。可悲的失败。",
            GUANCHA: "检测到Rug。模式记录。",
            JINGJUE: "那是个陷阱。我就知道。",
            SHOUSHANG: "即使受伤我也能避开陷阱。",
        }
    };

    const stateKey = state.nameEn;
    const reaction = reactions[event]?.[stateKey] || '...';

    const line = [
        chalk.gray(timestamp()),
        chalk.yellow('[虎语]'),
        chalk.yellow(`${state.emoji}`),
        chalk.white(reaction),
        extra ? chalk.gray('| ' + extra) : ''
    ].join(' ');

    console.log(line);
    saveToFile(line);
}
