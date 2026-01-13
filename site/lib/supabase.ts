import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════
// 执行白虎 - Supabase Client (Lazy Initialization)
// ═══════════════════════════════════════════════════════════════

let instance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (instance) return instance;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Durante build, retorna client dummy
    if (!url || !key) {
        if (typeof window === 'undefined') {
            return createClient('https://placeholder.supabase.co', 'placeholder');
        }
        throw new Error('Missing Supabase env vars');
    }

    instance = createClient(url, key);
    return instance;
}

// Types
export interface SystemStatus {
    id: string;
    status: string;
    simulated_balance: number;
    total_pnl: number;
    total_pnl_percent: number;
    win_rate: number;
    total_trades: number;
    wins: number;
    losses: number;
    sanity: number;
    mental_state: string;
    current_thought: string;
    is_simulation: boolean;
    updated_at: string;
}

export interface Token {
    id: string;
    ca: string;
    name: string;
    symbol: string;
    market_cap: number;
    price: number;
    liquidity: number;
    tiger_score: number | null;
    tiger_analysis: string | null;
    prey_quality: string | null;
    decision: string | null;
    status: string;
    created_at: string;
}

export interface Trade {
    id: string;
    token_ca: string;
    type: 'buy' | 'sell';
    simulated_amount_bnb: number;
    simulated_price: number;
    simulated_pnl: number | null;
    simulated_pnl_percent: number | null;
    mental_state: string;
    tiger_thought: string;
    created_at: string;
    tokens?: Token;
}

export interface Position {
    id: string;
    token_ca: string;
    status: 'open' | 'closed';
    simulated_amount_bnb: number;
    simulated_entry_price: number;
    current_price: number;
    simulated_pnl_percent: number;
    simulated_pnl: number;
    created_at: string;
    tokens?: Token;
}

// ═══════════════════════════════════════════════════════════════
// FETCH FUNCTIONS
// ═══════════════════════════════════════════════════════════════
export async function getSystemStatus(): Promise<SystemStatus | null> {
    const client = getSupabase();
    const { data, error } = await client
        .from('system_status')
        .select('*')
        .eq('id', 'main')
        .single();

    if (error) return null;
    return data;
}

export async function getRecentTokens(limit = 20): Promise<Token[]> {
    const client = getSupabase();
    const { data } = await client
        .from('tokens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    return data || [];
}

export async function getRecentTrades(limit = 20): Promise<Trade[]> {
    const client = getSupabase();
    const { data } = await client
        .from('trades')
        .select('*, tokens(*)')
        .order('created_at', { ascending: false })
        .limit(limit);

    return data || [];
}

export async function getOpenPositions(): Promise<Position[]> {
    const client = getSupabase();
    const { data } = await client
        .from('positions')
        .select('*, tokens(*)')
        .eq('status', 'open');

    return data || [];
}

// ═══════════════════════════════════════════════════════════════
// REALTIME SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════
export function subscribeToStatus(callback: (status: SystemStatus) => void) {
    const client = getSupabase();
    return client
        .channel('system_status')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'system_status' }, (payload) => {
            callback(payload.new as SystemStatus);
        })
        .subscribe();
}

export function subscribeToTrades(callback: (trade: Trade) => void) {
    const client = getSupabase();
    return client
        .channel('trades')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trades' }, (payload) => {
            callback(payload.new as Trade);
        })
        .subscribe();
}

export function subscribeToTokens(callback: (token: Token) => void) {
    const client = getSupabase();
    return client
        .channel('tokens')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, (payload) => {
            callback(payload.new as Token);
        })
        .subscribe();
}
