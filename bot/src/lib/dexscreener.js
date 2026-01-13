import { config } from '../config.js';
import { withRetry } from './utils.js';

// ═══════════════════════════════════════════════════════════════
// 执行白虎 DEXSCREENER - Token Data (API Grátis)
// ═══════════════════════════════════════════════════════════════

let bnbPriceUsd = 0;
let bnbPriceLastUpdate = 0;

// Fetch com retry automático
async function fetchWithRetry(url, options = {}) {
    return withRetry(async () => {
        const r = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                ...options.headers
            }
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    }, { retries: 3, delay: 1000 });
}

// ═══════════════════════════════════════════════════════════════
// BNB PRICE (com cache de 60s)
// ═══════════════════════════════════════════════════════════════
export async function getBnbPrice() {
    const now = Date.now();
    if (bnbPriceUsd > 0 && now - bnbPriceLastUpdate < 60000) return bnbPriceUsd;

    try {
        const json = await fetchWithRetry(`${config.DEXSCREENER_API}/tokens/${config.WBNB}`);
        if (json.pairs && json.pairs.length > 0) {
            bnbPriceUsd = parseFloat(json.pairs[0].priceUsd) || 600;
            bnbPriceLastUpdate = now;
        }
    } catch (e) {
        console.error('[DEXSCREENER] BNB price error:', e.message);
    }

    return bnbPriceUsd > 0 ? bnbPriceUsd : 600;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN INFO
// ═══════════════════════════════════════════════════════════════
export async function getTokenInfo(ca) {
    try {
        const json = await fetchWithRetry(`${config.DEXSCREENER_API}/tokens/${ca}`);

        if (json.pairs && json.pairs.length > 0) {
            // Pega o par com mais liquidez
            const pair = json.pairs.sort((a, b) =>
                (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
            )[0];

            return {
                name: pair.baseToken?.name || 'Unknown',
                symbol: pair.baseToken?.symbol || '???',
                address: pair.baseToken?.address,
                price: parseFloat(pair.priceUsd) || 0,
                priceNative: parseFloat(pair.priceNative) || 0,
                mc: pair.marketCap || pair.fdv || 0,
                liquidity: pair.liquidity?.usd || 0,
                volume24h: pair.volume?.h24 || 0,
                volume1h: pair.volume?.h1 || 0,
                volume5m: pair.volume?.m5 || 0,
                priceChange24h: pair.priceChange?.h24 || 0,
                priceChange1h: pair.priceChange?.h1 || 0,
                priceChange5m: pair.priceChange?.m5 || 0,
                txns24h: (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0),
                buys24h: pair.txns?.h24?.buys || 0,
                sells24h: pair.txns?.h24?.sells || 0,
                pairAddress: pair.pairAddress,
                dexId: pair.dexId,
                url: pair.url,
                chainId: pair.chainId
            };
        }
    } catch (e) {
        console.error('[DEXSCREENER] Token info error:', e.message);
    }

    return null;
}

// ═══════════════════════════════════════════════════════════════
// LATEST PAIRS (para descobrir novos tokens)
// ═══════════════════════════════════════════════════════════════
export async function getLatestPairs(chain = 'bsc') {
    try {
        const json = await fetchWithRetry(`https://api.dexscreener.com/latest/dex/pairs/${chain}`);

        if (json.pairs) {
            return json.pairs.map(pair => ({
                name: pair.baseToken?.name || 'Unknown',
                symbol: pair.baseToken?.symbol || '???',
                address: pair.baseToken?.address,
                price: parseFloat(pair.priceUsd) || 0,
                mc: pair.marketCap || pair.fdv || 0,
                liquidity: pair.liquidity?.usd || 0,
                volume24h: pair.volume?.h24 || 0,
                pairAddress: pair.pairAddress,
                pairCreatedAt: pair.pairCreatedAt,
                dexId: pair.dexId,
                url: pair.url
            }));
        }
    } catch (e) {
        console.error('[DEXSCREENER] Latest pairs error:', e.message);
    }

    return [];
}

// ═══════════════════════════════════════════════════════════════
// SEARCH TOKENS
// ═══════════════════════════════════════════════════════════════
export async function searchTokens(query) {
    try {
        const json = await fetchWithRetry(
            `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`
        );

        if (json.pairs) {
            return json.pairs
                .filter(p => p.chainId === 'bsc')
                .map(pair => ({
                    name: pair.baseToken?.name,
                    symbol: pair.baseToken?.symbol,
                    address: pair.baseToken?.address,
                    mc: pair.marketCap || pair.fdv || 0,
                    liquidity: pair.liquidity?.usd || 0,
                    dexId: pair.dexId
                }));
        }
    } catch (e) {
        console.error('[DEXSCREENER] Search error:', e.message);
    }

    return [];
}

// ═══════════════════════════════════════════════════════════════
// GET MULTIPLE TOKENS
// ═══════════════════════════════════════════════════════════════
export async function getMultipleTokens(addresses) {
    const results = [];

    for (const address of addresses) {
        try {
            const info = await getTokenInfo(address);
            if (info) results.push(info);
            // Rate limit
            await new Promise(r => setTimeout(r, 200));
        } catch (e) {
            console.error(`[DEXSCREENER] Error fetching ${address}:`, e.message);
        }
    }

    return results;
}

// ═══════════════════════════════════════════════════════════════
// CHECK TOKEN VALIDITY
// ═══════════════════════════════════════════════════════════════
export async function isTokenValid(ca) {
    try {
        const info = await getTokenInfo(ca);
        if (!info) return { valid: false, reason: '代币未找到 (Token not found)' };

        if (info.liquidity < 1000) {
            return { valid: false, reason: `流动性太低: $${info.liquidity}` };
        }

        if (info.mc < 10000) {
            return { valid: false, reason: `市值太低: $${info.mc}` };
        }

        // Check buy/sell ratio
        if (info.buys24h > 0 && info.sells24h > 0) {
            const ratio = info.buys24h / info.sells24h;
            if (ratio < 0.1) {
                return { valid: false, reason: '卖出压力太大 (Too much sell pressure)' };
            }
        }

        return { valid: true, info };
    } catch (e) {
        return { valid: false, reason: e.message };
    }
}
