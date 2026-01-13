-- ═══════════════════════════════════════════════════════════════
-- 执行白虎 (ZHÍXÍNG BÁIHǓ) - Database Schema
-- O Tigre que Executa - BSC Trading Bot
-- ═══════════════════════════════════════════════════════════════

-- System Status (Estado do Tigre)
CREATE TABLE IF NOT EXISTS system_status (
    id TEXT PRIMARY KEY DEFAULT 'main',
    status TEXT DEFAULT 'OFFLINE',
    wallet_address TEXT,
    simulated_balance DECIMAL(20, 9) DEFAULT 10.0,
    total_pnl DECIMAL(20, 9) DEFAULT 0,
    total_pnl_percent DECIMAL(10, 2) DEFAULT 0,
    win_rate DECIMAL(5, 2) DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    sanity INTEGER DEFAULT 50,
    mental_state TEXT DEFAULT 'GUANCHA',
    current_thought TEXT DEFAULT '观察中...',
    is_simulation BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default status
INSERT INTO system_status (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- Tokens Analisados
CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ca TEXT UNIQUE NOT NULL,
    name TEXT,
    symbol TEXT,
    logo TEXT,
    market_cap DECIMAL(20, 2),
    price DECIMAL(30, 18),
    liquidity DECIMAL(20, 2),
    volume_24h DECIMAL(20, 2),
    tiger_score INTEGER,
    tiger_analysis TEXT,
    prey_quality TEXT,
    trap_detected BOOLEAN DEFAULT FALSE,
    decision TEXT,
    filter_reason TEXT,
    status TEXT DEFAULT 'analyzing',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trades (Simulados)
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_ca TEXT REFERENCES tokens(ca),
    type TEXT NOT NULL, -- 'buy' ou 'sell'
    simulated_amount_bnb DECIMAL(20, 9),
    simulated_price DECIMAL(30, 18),
    simulated_tokens DECIMAL(30, 18),
    simulated_pnl DECIMAL(20, 9),
    simulated_pnl_percent DECIMAL(10, 2),
    mental_state TEXT,
    tiger_thought TEXT,
    tx_hash TEXT,
    exit_reason TEXT, -- 'TP', 'SL', 'manual'
    is_simulation BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Positions (Posições Simuladas)
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_ca TEXT REFERENCES tokens(ca),
    simulated_entry_price DECIMAL(30, 18),
    simulated_amount_bnb DECIMAL(20, 9),
    simulated_tokens DECIMAL(30, 18),
    current_price DECIMAL(30, 18),
    simulated_pnl_percent DECIMAL(10, 2),
    simulated_pnl DECIMAL(20, 9),
    mental_state_at_entry TEXT,
    tiger_score INTEGER,
    is_simulation BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'open', -- 'open', 'closed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tokens_ca ON tokens(ca);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
CREATE INDEX IF NOT EXISTS idx_tokens_created ON tokens(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_created ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_type ON trades(type);
CREATE INDEX IF NOT EXISTS idx_positions_status ON positions(status);
CREATE INDEX IF NOT EXISTS idx_positions_token ON positions(token_ca);
