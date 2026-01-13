#!/usr/bin/env node
/**
 * 执行白虎 - Test Connections
 * Uso: node scripts/test-connections.js
 */

import 'dotenv/config';

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  执行白虎 - Teste de Conexões                                ║
║  Verificando APIs e Serviços                                  ║
╚══════════════════════════════════════════════════════════════╝
`);

const results = {
    supabase: false,
    bscRpc: false,
    dexscreener: false,
    claude: false
};

// Test Supabase
async function testSupabase() {
    console.log('[1/4] Testando Supabase...');
    try {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY;

        if (!url || !key || url.includes('xxx')) {
            console.log('      ❌ SUPABASE_URL ou SUPABASE_ANON_KEY não configurado');
            return;
        }

        const response = await fetch(`${url}/rest/v1/`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        if (response.ok || response.status === 404) {
            console.log('      ✅ Supabase conectado!');
            results.supabase = true;
        } else {
            console.log(`      ❌ Supabase erro: ${response.status}`);
        }
    } catch (e) {
        console.log(`      ❌ Supabase erro: ${e.message}`);
    }
}

// Test BSC RPC
async function testBscRpc() {
    console.log('[2/4] Testando BSC RPC...');
    try {
        const rpc = process.env.BSC_RPC || 'https://bsc-dataseed1.binance.org';

        const response = await fetch(rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_blockNumber',
                params: []
            })
        });

        const data = await response.json();

        if (data.result) {
            const blockNumber = parseInt(data.result, 16);
            console.log(`      ✅ BSC RPC OK! (Block: ${blockNumber})`);
            results.bscRpc = true;
        } else {
            console.log(`      ❌ BSC RPC erro: ${JSON.stringify(data.error)}`);
        }
    } catch (e) {
        console.log(`      ❌ BSC RPC erro: ${e.message}`);
    }
}

// Test DexScreener
async function testDexScreener() {
    console.log('[3/4] Testando DexScreener (API grátis)...');
    try {
        // Testar com WBNB
        const response = await fetch(
            'https://api.dexscreener.com/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
        );

        if (response.ok) {
            const data = await response.json();
            if (data.pairs && data.pairs.length > 0) {
                const bnbPrice = parseFloat(data.pairs[0].priceUsd);
                console.log(`      ✅ DexScreener OK! (BNB = $${bnbPrice.toFixed(2)})`);
                results.dexscreener = true;
            } else {
                console.log('      ⚠️  DexScreener: Nenhum par encontrado');
            }
        } else {
            console.log(`      ❌ DexScreener erro: ${response.status}`);
        }
    } catch (e) {
        console.log(`      ❌ DexScreener erro: ${e.message}`);
    }
}

// Test Claude (opcional)
async function testClaude() {
    console.log('[4/4] Testando Claude AI (opcional)...');
    try {
        const apiKey = process.env.CLAUDE_API_KEY;

        if (!apiKey) {
            console.log('      ⚠️  CLAUDE_API_KEY não configurado (opcional)');
            console.log('         O bot usará análise básica sem IA');
            return;
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'Say "OK"' }]
            })
        });

        if (response.ok) {
            console.log('      ✅ Claude AI OK!');
            results.claude = true;
        } else {
            const data = await response.json();
            console.log(`      ❌ Claude erro: ${data.error?.message || response.status}`);
        }
    } catch (e) {
        console.log(`      ❌ Claude erro: ${e.message}`);
    }
}

// Run all tests
async function runTests() {
    await testSupabase();
    await testBscRpc();
    await testDexScreener();
    await testClaude();

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('RESULTADO:');
    console.log('');

    const required = ['supabase', 'bscRpc', 'dexscreener'];
    const allRequiredOk = required.every(k => results[k]);

    Object.entries(results).forEach(([name, ok]) => {
        const status = ok ? '✅' : '❌';
        const optional = name === 'claude' ? ' (opcional)' : '';
        const nameCn = {
            supabase: 'Supabase',
            bscRpc: 'BSC RPC',
            dexscreener: 'DexScreener',
            claude: 'Claude AI'
        }[name];
        console.log(`  ${status} ${nameCn}${optional}`);
    });

    console.log('');

    if (allRequiredOk) {
        console.log('🐯 白虎准备好了! Pode rodar: npm start');
    } else {
        console.log('⚠️  Corrija os erros acima antes de rodar o bot.');
    }

    console.log('═══════════════════════════════════════════════════════════════');
}

runTests().catch(console.error);
