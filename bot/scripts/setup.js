#!/usr/bin/env node
/**
 * 执行白虎 - Setup Automático
 * Uso: node scripts/setup.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (question) => new Promise(resolve => rl.question(question, resolve));

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  执行白虎 (ZHÍXÍNG BÁIHǓ) - Setup                           ║
║  O Tigre que Executa                                         ║
╚══════════════════════════════════════════════════════════════╝
`);

async function main() {
    // 1. Verificar/Criar .env
    console.log('[1/5] Verificando .env...');
    if (!fs.existsSync('.env')) {
        if (fs.existsSync('.env.example')) {
            fs.copyFileSync('.env.example', '.env');
            console.log('      ⚠️  .env criado a partir de .env.example');
            console.log('      📝 EDITE o .env com suas credenciais!');
        } else {
            console.log('      ❌ .env.example não encontrado');
            process.exit(1);
        }
    } else {
        console.log('      ✅ .env já existe');
    }

    // 2. Instalar dependências
    console.log('');
    console.log('[2/5] Instalando dependências...');
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('      ✅ Dependências instaladas!');
    } catch (e) {
        console.log('      ❌ Erro ao instalar dependências');
        process.exit(1);
    }

    // 3. Criar pasta de logs
    console.log('');
    console.log('[3/5] Criando pasta de logs...');
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs', { recursive: true });
    }
    console.log('      ✅ Pasta logs/ criada');

    // 4. Verificar variáveis obrigatórias
    console.log('');
    console.log('[4/5] Verificando variáveis de ambiente...');

    const envContent = fs.readFileSync('.env', 'utf-8');
    const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missing = [];

    for (const varName of required) {
        const regex = new RegExp(`^${varName}=.+`, 'm');
        if (!regex.test(envContent) || envContent.includes(`${varName}=https://xxx`)) {
            missing.push(varName);
        }
    }

    if (missing.length > 0) {
        console.log('      ⚠️  Variáveis faltando ou não configuradas:');
        missing.forEach(v => console.log(`         - ${v}`));
        console.log('');
        console.log('      📝 Preencha essas variáveis no .env');
    } else {
        console.log('      ✅ Variáveis obrigatórias configuradas!');
    }

    // 5. Instruções finais
    console.log('');
    console.log('[5/5] Próximos passos...');
    console.log('      Execute: node scripts/test-connections.js');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Setup concluído! Próximos passos:');
    console.log('');
    console.log('1. Verifique/edite o .env com suas credenciais');
    console.log('2. Execute: node scripts/test-connections.js');
    console.log('3. Se tudo OK: npm start');
    console.log('═══════════════════════════════════════════════════════════════');

    rl.close();
    process.exit(0);
}

main().catch(e => {
    console.error(e);
    rl.close();
    process.exit(1);
});
