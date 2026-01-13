import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

// ═══════════════════════════════════════════════════════════════
// 执行白虎 SUPABASE - Database Operations
// ═══════════════════════════════════════════════════════════════

export const supabase = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_KEY || config.SUPABASE_ANON_KEY
);

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════
export async function updateSystemStatus(data) {
    const { error } = await supabase
        .from('system_status')
        .upsert({
            id: 'main',
            ...data,
            updated_at: new Date().toISOString()
        });
    if (error) console.error('[SUPABASE] Status error:', error.message);
    return !error;
}

export async function getSystemStatus() {
    const { data, error } = await supabase
        .from('system_status')
        .select('*')
        .eq('id', 'main')
        .single();
    if (error) return null;
    return data;
}

// ═══════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════
export async function upsertToken(token) {
    const { data, error } = await supabase
        .from('tokens')
        .upsert({
            ...token,
            updated_at: new Date().toISOString()
        }, { onConflict: 'ca' })
        .select()
        .single();
    if (error) console.error('[SUPABASE] Token error:', error.message);
    return data;
}

export async function getToken(ca) {
    const { data } = await supabase
        .from('tokens')
        .select('*')
        .eq('ca', ca)
        .single();
    return data;
}

export async function getRecentTokens(limit = 50) {
    const { data } = await supabase
        .from('tokens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    return data || [];
}

// ═══════════════════════════════════════════════════════════════
// TRADES
// ═══════════════════════════════════════════════════════════════
export async function recordTrade(trade) {
    const { data, error } = await supabase
        .from('trades')
        .insert({
            ...trade,
            is_simulation: true,
            created_at: new Date().toISOString()
        })
        .select()
        .single();
    if (error) console.error('[SUPABASE] Trade error:', error.message);
    return data;
}

export async function getTrades(limit = 100) {
    const { data } = await supabase
        .from('trades')
        .select('*, tokens(*)')
        .order('created_at', { ascending: false })
        .limit(limit);
    return data || [];
}

export async function getTradeStats() {
    const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .eq('type', 'sell');

    if (!trades || trades.length === 0) {
        return { totalPnl: 0, wins: 0, losses: 0, winRate: 0 };
    }

    let totalPnl = 0;
    let wins = 0;
    let losses = 0;

    trades.forEach(t => {
        if (t.simulated_pnl) {
            totalPnl += t.simulated_pnl;
            if (t.simulated_pnl > 0) wins++;
            else losses++;
        }
    });

    const winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;

    return { totalPnl, wins, losses, winRate };
}

// ═══════════════════════════════════════════════════════════════
// POSITIONS
// ═══════════════════════════════════════════════════════════════
export async function createPosition(position) {
    const { data, error } = await supabase
        .from('positions')
        .insert({
            ...position,
            is_simulation: true,
            status: 'open',
            created_at: new Date().toISOString()
        })
        .select()
        .single();
    if (error) console.error('[SUPABASE] Position error:', error.message);
    return data;
}

export async function getOpenPositions() {
    const { data } = await supabase
        .from('positions')
        .select('*, tokens(*)')
        .eq('status', 'open');
    return data || [];
}

export async function updatePosition(id, updates) {
    const { data, error } = await supabase
        .from('positions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) console.error('[SUPABASE] Update position error:', error.message);
    return data;
}

export async function closePosition(id, pnl, pnlPercent) {
    const { data, error } = await supabase
        .from('positions')
        .update({
            status: 'closed',
            simulated_pnl: pnl,
            simulated_pnl_percent: pnlPercent,
            closed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    if (error) console.error('[SUPABASE] Close error:', error.message);
    return data;
}

// ═══════════════════════════════════════════════════════════════
// TIGER STATE
// ═══════════════════════════════════════════════════════════════
export async function updateTigerState(sanity, mentalState, currentThought) {
    return updateSystemStatus({
        sanity,
        mental_state: mentalState,
        current_thought: currentThought
    });
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
export async function initializeDatabase() {
    // Criar status inicial se não existir
    const { data: existing } = await supabase
        .from('system_status')
        .select('id')
        .eq('id', 'main')
        .single();

    if (!existing) {
        await supabase
            .from('system_status')
            .insert({
                id: 'main',
                status: 'OFFLINE',
                simulated_balance: 10.0,
                total_pnl: 0,
                total_pnl_percent: 0,
                win_rate: 0,
                total_trades: 0,
                wins: 0,
                losses: 0,
                sanity: 50,
                mental_state: 'GUANCHA',
                current_thought: '观察中...',
                is_simulation: true
            });
    }

    return true;
}
