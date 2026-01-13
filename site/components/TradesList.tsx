'use client';

import { motion } from 'framer-motion';

interface Trade {
    id: string;
    type: 'buy' | 'sell';
    token_ca: string;
    simulated_amount_bnb: number;
    simulated_pnl_percent?: number | null;
    mental_state: string;
    created_at: string;
    tokens?: {
        symbol: string;
        name: string;
    } | null;
}

interface TradesListProps {
    trades: Trade[];
}

export default function TradesList({ trades }: TradesListProps) {
    if (trades.length === 0) {
        return (
            <div className="glass rounded-2xl p-8 text-center">
                <p className="text-4xl mb-4">🐯</p>
                <p className="text-gray-400 font-chinese">白虎正在观察...</p>
                <p className="text-gray-500 text-sm">O Tigre está observando...</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gold/10">
                <h3 className="font-chinese text-lg text-gold">最近交易</h3>
                <p className="text-gray-500 text-sm">Trades Recentes (Simulados)</p>
            </div>

            <div className="divide-y divide-white/5">
                {trades.map((trade, index) => (
                    <motion.div
                        key={trade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-4 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    trade.type === 'buy'
                                        ? 'bg-profit/20 text-profit'
                                        : 'bg-loss/20 text-loss'
                                }`}>
                                    {trade.type === 'buy' ? '买入' : '卖出'}
                                </span>
                                <div>
                                    <p className="font-mono text-white">
                                        {trade.tokens?.symbol || trade.token_ca.slice(0, 8) + '...'}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(trade.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-mono text-white">
                                    {trade.simulated_amount_bnb.toFixed(4)} BNB
                                </p>
                                {trade.simulated_pnl_percent != null && trade.type === 'sell' && (
                                    <p className={`text-sm ${
                                        trade.simulated_pnl_percent >= 0 ? 'text-profit' : 'text-loss'
                                    }`}>
                                        {trade.simulated_pnl_percent >= 0 ? '+' : ''}{trade.simulated_pnl_percent.toFixed(1)}%
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
