// ═══════════════════════════════════════════════════════════════
// 执行白虎 UTILS - Helpers e Funções Utilitárias
// ═══════════════════════════════════════════════════════════════

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function formatBNB(amount) {
    return parseFloat(amount).toFixed(4);
}

export function formatMarketCap(value) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    return `${value.toFixed(2)}`;
}

export function truncateAddress(addr, chars = 4) {
    if (!addr) return '';
    return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function isValidBSCAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Retry logic com backoff exponencial
export async function withRetry(fn, options = {}) {
    const { retries = 3, delay = 1000, backoff = 2, onRetry = null } = options;
    let lastError;

    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i < retries - 1) {
                const waitTime = delay * Math.pow(backoff, i);
                if (onRetry) onRetry(i + 1, retries, waitTime, error);
                await sleep(waitTime);
            }
        }
    }
    throw lastError;
}

// Rate limiter simples
export function createRateLimiter(maxRequests, windowMs) {
    const requests = [];

    return async function limit() {
        const now = Date.now();
        // Remove requests antigos
        while (requests.length > 0 && requests[0] < now - windowMs) {
            requests.shift();
        }

        if (requests.length >= maxRequests) {
            const waitTime = requests[0] + windowMs - now;
            await sleep(waitTime);
            return limit();
        }

        requests.push(now);
        return true;
    };
}

// Gerar ID único para simulação
export function generateSimulatedTxHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Calcular PnL
export function calculatePnL(entryPrice, currentPrice, amount) {
    const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
    const pnlValue = amount * (pnlPercent / 100);
    return { pnlPercent, pnlValue };
}

// Validar token para trading
export function validateTokenForTrading(tokenInfo, config) {
    const errors = [];

    if (!tokenInfo) {
        errors.push('无代币信息 (No token info)');
        return { valid: false, errors };
    }

    if (tokenInfo.mc < config.MIN_MC) {
        errors.push(`市值太低: ${formatMarketCap(tokenInfo.mc)} < ${formatMarketCap(config.MIN_MC)}`);
    }

    if (tokenInfo.mc > config.MAX_MC) {
        errors.push(`市值太高: ${formatMarketCap(tokenInfo.mc)} > ${formatMarketCap(config.MAX_MC)}`);
    }

    if (tokenInfo.liquidity < config.MIN_LIQUIDITY) {
        errors.push(`流动性太低: $${tokenInfo.liquidity} < $${config.MIN_LIQUIDITY}`);
    }

    return { valid: errors.length === 0, errors };
}

// Formatar número com vírgulas
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calcular sanity change baseado em resultado
export function calculateSanityChange(result, currentSanity) {
    let change = 0;

    switch (result) {
        case 'win':
            change = 10;
            break;
        case 'loss':
            change = -15;
            break;
        case 'rug_avoided':
            change = 5;
            break;
        case 'big_win':
            change = 20;
            break;
        case 'big_loss':
            change = -25;
            break;
        default:
            change = 0;
    }

    const newSanity = Math.max(0, Math.min(100, currentSanity + change));
    return { change, newSanity };
}
