'use client';

import { motion } from 'framer-motion';

interface TigerStateProps {
    state: string;
    sanity: number;
    thought: string;
}

const stateInfo: Record<string, { name: string; emoji: string; color: string }> = {
    LIESHA: { name: '猎杀', emoji: '🔥', color: 'from-red-500 to-orange-500' },
    QIANFU: { name: '潜伏', emoji: '😎', color: 'from-green-500 to-emerald-500' },
    GUANCHA: { name: '观察', emoji: '🤔', color: 'from-yellow-500 to-amber-500' },
    JINGJUE: { name: '警觉', emoji: '😤', color: 'from-purple-500 to-pink-500' },
    SHOUSHANG: { name: '受伤', emoji: '💀', color: 'from-gray-500 to-gray-700' },
};

export default function TigerState({ state, sanity, thought }: TigerStateProps) {
    const info = stateInfo[state] || stateInfo.GUANCHA;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 glow-gold"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className={`text-4xl animate-breathe`}>
                    {info.emoji}
                </div>
                <div>
                    <p className="text-gray-400 text-sm">虎态 (Estado)</p>
                    <h3 className={`text-2xl font-chinese font-bold bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                        {info.name}
                    </h3>
                </div>
            </div>

            {/* Sanity Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400 font-chinese">精神值</span>
                    <span className="text-gold">{sanity}%</span>
                </div>
                <div className="h-3 bg-bg-primary rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sanity}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${info.color}`}
                    />
                </div>
            </div>

            {/* Thought */}
            <div className="bg-bg-primary/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1 font-chinese">白虎心语</p>
                <p className="text-white text-sm font-chinese italic">"{thought}"</p>
            </div>
        </motion.div>
    );
}
