import { config, getTigerState, getRandomThought } from '../config.js';

// ═══════════════════════════════════════════════════════════════
// 执行白虎 CLAUDE - AI Analysis
// ═══════════════════════════════════════════════════════════════

export async function analyzeWithClaude(tokenInfo, sanity = 50) {
    // Se não tiver API key, usar análise básica
    if (!config.CLAUDE_API_KEY) {
        return basicAnalysis(tokenInfo);
    }

    try {
        const state = getTigerState(sanity);

        const prompt = `你是执行白虎 (Zhíxíng Báihǔ)，白虎执行者。

个性：
- 冷酷而精于计算
- 使用狩猎隐喻
- 耐心但致命
- 混合中文与分析
- 像捕食者分析猎物一样说话

当前精神状态: ${state.name} (${state.nameEn})
精神值: ${sanity}%

分析这个BSC代币:
名称: ${tokenInfo.name}
符号: ${tokenInfo.symbol}
市值: $${tokenInfo.mc?.toLocaleString() || 0}
流动性: $${tokenInfo.liquidity?.toLocaleString() || 0}
24h交易量: $${tokenInfo.volume24h?.toLocaleString() || 0}
价格变化24h: ${tokenInfo.priceChange24h || 0}%
买入/卖出24h: ${tokenInfo.buys24h || 0}/${tokenInfo.sells24h || 0}

以JSON格式回应:
{
    "score": 0-100的数字,
    "decision": "BUY" 或 "SKIP",
    "hunt_analysis": "像捕食者一样的中文分析(1句话)",
    "prey_quality": "weak" | "moderate" | "strong",
    "trap_detected": 布尔值,
    "confidence": "low" | "medium" | "high"
}

狩猎分析示例:
- "猎物虚弱。太容易了。"
- "陷阱！避开。"
- "值得猎杀。"
- "观察中..."`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': config.CLAUDE_API_KEY,
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        const data = await response.json();
        const text = data.content[0].text;

        // Extrair JSON da resposta
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return basicAnalysis(tokenInfo);

    } catch (e) {
        console.error('[CLAUDE] 错误:', e.message);
        return basicAnalysis(tokenInfo);
    }
}

// ═══════════════════════════════════════════════════════════════
// BASIC ANALYSIS (sem Claude)
// ═══════════════════════════════════════════════════════════════
function basicAnalysis(tokenInfo) {
    let score = 50;
    const reasons = [];
    const redFlags = [];

    // Market Cap
    if (tokenInfo.mc >= 50000 && tokenInfo.mc <= 500000) {
        score += 15;
        reasons.push('市值适中 (MC ideal)');
    } else if (tokenInfo.mc < 20000) {
        score -= 20;
        redFlags.push('市值太低 (MC muito baixo)');
    } else if (tokenInfo.mc > 1000000) {
        score -= 10;
        redFlags.push('市值太高 (MC muito alto)');
    }

    // Liquidity
    if (tokenInfo.liquidity >= 10000) {
        score += 15;
        reasons.push('流动性充足 (Boa liquidez)');
    } else if (tokenInfo.liquidity < 5000) {
        score -= 25;
        redFlags.push('流动性不足 (Baixa liquidez)');
    }

    // Volume
    if (tokenInfo.volume24h > 10000) {
        score += 10;
        reasons.push('交易活跃 (Volume ativo)');
    }

    // Price Change
    if (tokenInfo.priceChange24h > 0 && tokenInfo.priceChange24h < 100) {
        score += 10;
        reasons.push('价格上涨中 (Preço subindo)');
    } else if (tokenInfo.priceChange24h < -30) {
        score -= 15;
        redFlags.push('价格暴跌 (Preço despencando)');
    }

    // Buy/Sell ratio
    if (tokenInfo.buys24h && tokenInfo.sells24h) {
        const ratio = tokenInfo.buys24h / (tokenInfo.sells24h || 1);
        if (ratio > 1.5) {
            score += 10;
            reasons.push('买入压力大 (Mais compras)');
        } else if (ratio < 0.5) {
            score -= 20;
            redFlags.push('卖出压力大 (Muito mais vendas)');
        }
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Decision
    const decision = score >= 70 ? 'BUY' : 'SKIP';

    // Prey quality
    let preyQuality = 'weak';
    if (score >= 80) preyQuality = 'strong';
    else if (score >= 60) preyQuality = 'moderate';

    // Hunt analysis
    let huntAnalysis = '观察中...';
    if (score >= 80) huntAnalysis = '值得猎杀。(Digna de ser caçada)';
    else if (score >= 70) huntAnalysis = '猎物有潜力。(Presa tem potencial)';
    else if (score >= 50) huntAnalysis = '需要更多观察。(Precisa mais observação)';
    else if (redFlags.length > 0) huntAnalysis = '危险猎物！避开。(Perigoso! Evitar)';
    else huntAnalysis = '猎物虚弱。不值得。(Presa fraca)';

    return {
        score,
        decision,
        hunt_analysis: huntAnalysis,
        prey_quality: preyQuality,
        trap_detected: redFlags.length > 2,
        confidence: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
        reasons,
        redFlags
    };
}

// ═══════════════════════════════════════════════════════════════
// QUICK ANALYSIS (para triagem rápida)
// ═══════════════════════════════════════════════════════════════
export function quickAnalysis(tokenInfo) {
    // Filtros rápidos que não precisam de AI
    const issues = [];

    if (!tokenInfo) return { pass: false, issues: ['无数据'] };

    if (tokenInfo.mc < 20000) issues.push('市值<20K');
    if (tokenInfo.mc > 1000000) issues.push('市值>1M');
    if (tokenInfo.liquidity < 5000) issues.push('流动性<5K');

    if (tokenInfo.buys24h && tokenInfo.sells24h) {
        const ratio = tokenInfo.buys24h / (tokenInfo.sells24h || 1);
        if (ratio < 0.3) issues.push('卖压过大');
    }

    if (tokenInfo.priceChange24h < -50) issues.push('暴跌>50%');

    return {
        pass: issues.length === 0,
        issues
    };
}
