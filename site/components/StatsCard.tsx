'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    titleCn: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
    delay?: number;
}

export default function StatsCard({
    title,
    titleCn,
    value,
    subtitle,
    icon,
    trend = 'neutral',
    delay = 0
}: StatsCardProps) {
    const trendColors = {
        up: 'text-profit',
        down: 'text-loss',
        neutral: 'text-gold'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="glass rounded-2xl p-6 card-hover"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-gold text-xs font-chinese">{titleCn}</p>
                </div>
                {icon && <span className="text-2xl">{icon}</span>}
            </div>

            <p className={`text-3xl font-bold font-mono ${trendColors[trend]}`}>
                {value}
            </p>

            {subtitle && (
                <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
            )}
        </motion.div>
    );
}
