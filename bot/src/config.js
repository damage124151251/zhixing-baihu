import 'dotenv/config';

export const config = {
    // BSC RPC
    BSC_RPC: process.env.BSC_RPC || 'https://bsc-dataseed1.binance.org',
    BSC_RPC_BACKUP: 'https://bsc-dataseed2.binance.org',
    BSC_RPC_ANKR: 'https://rpc.ankr.com/bsc',
    CHAIN_ID: 56, // BSC Mainnet

    // PancakeSwap Router V2
    PANCAKE_ROUTER: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    PANCAKE_FACTORY: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',

    // DexScreener (grátis, não precisa API key)
    DEXSCREENER_API: 'https://api.dexscreener.com/latest/dex',

    // BSCScan (opcional)
    BSCSCAN_API_KEY: process.env.BSCSCAN_API_KEY || '',
    BSCSCAN_API: 'https://api.bscscan.com/api',

    // Claude AI (opcional)
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,

    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

    // Wallet
    WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,

    // Server
    PORT: parseInt(process.env.PORT) || 3001,

    // Gas settings
    GAS_LIMIT: 300000,
    GAS_PRICE_GWEI: 5,
};

// Trading Config (Simulação)
export const TRADING_CONFIG = {
    // Modo Simulação
    IS_SIMULATION: true,
    STARTING_BALANCE: 10.0,        // BNB inicial simulado

    // Trade Settings
    MAX_TRADE_BNB: 0.5,            // Máximo por trade
    SLIPPAGE: 12,                  // Slippage %

    // Risk Management
    STOP_LOSS_PERCENT: -20,        // 止损 (Zhǐsǔn) - Stop Loss
    TAKE_PROFIT_PERCENT: 40,       // 止盈 (Zhǐyíng) - Take Profit

    // Filters
    MIN_SCORE_TO_BUY: 75,          // Score mínimo do Tigre
    MIN_LIQUIDITY: 10000,          // Liquidez mínima USD
    MIN_MC: 20000,                 // Market Cap mínimo
    MAX_MC: 1000000,               // Market Cap máximo

    // Intervals
    TOKEN_SCAN_INTERVAL: 30000,    // 30s entre scans de novos tokens
    POSITION_CHECK_INTERVAL: 30000, // 30s check posições
    STATS_UPDATE_INTERVAL: 60000,  // 60s update stats
};

// Estados Mentais do Tigre (虎态 - Hǔ Tài)
export const TIGER_STATES = {
    LIESHA: {        // 猎杀 Modo Caça (80-100%)
        name: '猎杀',
        nameEn: 'LIESHA',
        emoji: '🔥',
        minSanity: 80,
        risk: 1.3,
        scoreAdjust: -10,
        slMultiplier: 1.5,
        tpMultiplier: 1.5,
        thoughts: [
            "血液沸腾。猎杀开始。(O sangue ferve. A caça começa.)",
            "今天没有猎物能逃脱。(Nenhuma presa escapa hoje.)",
            "白虎饥渴胜利。(O Tigre está faminto de vitórias.)",
            "执行! 执行! 执行!",
        ]
    },
    QIANFU: {        // 潜伏 Emboscado (60-79%)
        name: '潜伏',
        nameEn: 'QIANFU',
        emoji: '😎',
        minSanity: 60,
        risk: 1.0,
        scoreAdjust: 0,
        slMultiplier: 1.0,
        tpMultiplier: 1.0,
        thoughts: [
            "耐心。猎物会来。(Paciência. A presa virá.)",
            "完美位置。等待中。(Posição perfeita. Aguardando.)",
            "白虎在阴影中等待。(O Tigre espera nas sombras.)",
            "平静就是力量。(Calma é poder.)",
        ]
    },
    GUANCHA: {       // 观察 Observando (40-59%)
        name: '观察',
        nameEn: 'GUANCHA',
        emoji: '🤔',
        minSanity: 40,
        risk: 0.7,
        scoreAdjust: 5,
        slMultiplier: 0.8,
        tpMultiplier: 0.9,
        thoughts: [
            "白虎正在观察地形...(O Tigre observa o terreno...)",
            "有些不对劲。分析中。(Algo não está certo. Analisando.)",
            "需要更多数据。(Preciso de mais dados.)",
            "市场不确定。谨慎。(Mercado incerto. Cautela.)",
        ]
    },
    JINGJUE: {       // 警觉 Alerta (20-39%)
        name: '警觉',
        nameEn: 'JINGJUE',
        emoji: '😤',
        minSanity: 20,
        risk: 0.4,
        scoreAdjust: 15,
        slMultiplier: 0.6,
        tpMultiplier: 0.7,
        thoughts: [
            "空气中有危险。爪子准备好了。(Perigo no ar. Garras prontas.)",
            "市场充满敌意。(O mercado está hostil.)",
            "只追确定的猎物。(Apenas presas garantidas.)",
            "防御是优先。(Defesa é prioridade.)",
        ]
    },
    SHOUSHANG: {     // 受伤 Ferido (0-19%)
        name: '受伤',
        nameEn: 'SHOUSHANG',
        emoji: '💀',
        minSanity: 0,
        risk: 0.2,
        scoreAdjust: 25,
        slMultiplier: 0.5,
        tpMultiplier: 0.6,
        thoughts: [
            "白虎需要疗伤...(O Tigre precisa se curar...)",
            "亏损太多。反思时间。(Perdas demais. Tempo de reflexão.)",
            "即使是捕食者也需要休息。(Até predadores descansam.)",
            "舔伤口。变得更强。(Lamber as feridas. Voltar mais forte.)",
        ]
    },
};

// Função para obter estado atual baseado na sanidade
export function getTigerState(sanity) {
    if (sanity >= 80) return TIGER_STATES.LIESHA;
    if (sanity >= 60) return TIGER_STATES.QIANFU;
    if (sanity >= 40) return TIGER_STATES.GUANCHA;
    if (sanity >= 20) return TIGER_STATES.JINGJUE;
    return TIGER_STATES.SHOUSHANG;
}

// Função para obter pensamento aleatório do estado atual
export function getRandomThought(state) {
    const thoughts = state.thoughts;
    return thoughts[Math.floor(Math.random() * thoughts.length)];
}
