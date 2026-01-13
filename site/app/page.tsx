'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import FadeIn from '@/components/FadeIn';
import ScaleIn from '@/components/ScaleIn';
import TigerState from '@/components/TigerState';
import StatsCard from '@/components/StatsCard';
import TradesList from '@/components/TradesList';
import {
    getSystemStatus,
    getRecentTrades,
    subscribeToStatus,
    subscribeToTrades,
    SystemStatus,
    Trade
} from '@/lib/supabase';

export default function Home() {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial fetch
        async function fetchData() {
            const [statusData, tradesData] = await Promise.all([
                getSystemStatus(),
                getRecentTrades(10)
            ]);
            setStatus(statusData);
            setTrades(tradesData);
            setLoading(false);
        }
        fetchData();

        // Realtime subscriptions
        const statusSub = subscribeToStatus((newStatus) => {
            setStatus(newStatus);
        });

        const tradesSub = subscribeToTrades((newTrade) => {
            setTrades(prev => [newTrade, ...prev].slice(0, 10));
        });

        return () => {
            statusSub.unsubscribe();
            tradesSub.unsubscribe();
        };
    }, []);

    return (
        <div className="min-h-screen bg-mountains">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-mountain" />

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <Image
                            src="/logo.png"
                            alt="执行白虎"
                            width={180}
                            height={180}
                            className="mx-auto rounded-full animate-breathe glow-gold"
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-chinese text-5xl md:text-7xl font-bold text-gold-gradient mb-4"
                    >
                        执行白虎
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl md:text-2xl text-gray-400 mb-2"
                    >
                        ZHÍXÍNG BÁIHǓ
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg text-gray-500 mb-8"
                    >
                        O Tigre que Executa
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col items-center gap-4 mb-12"
                    >
                        <p className="font-chinese text-2xl text-white">
                            观察。等待。执行。
                        </p>
                        <p className="text-gray-400">
                            Observar. Esperar. Executar.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="inline-block px-6 py-3 bg-gold/20 rounded-full border border-gold/30"
                    >
                        <span className="text-gold font-chinese">模拟模式</span>
                        <span className="text-gray-400 ml-2">| Modo Simulação</span>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    >
                        <div className="animate-bounce">
                            <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="dashboard" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="font-chinese text-3xl font-bold text-gold mb-2">实时数据</h2>
                            <p className="text-gray-400">Dashboard em Tempo Real</p>
                        </div>
                    </FadeIn>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="text-4xl animate-breathe mb-4">🐯</div>
                            <p className="text-gray-400 font-chinese">加载中...</p>
                        </div>
                    ) : (
                        <>
                            {/* Tiger State */}
                            {status && (
                                <FadeIn delay={0.1}>
                                    <div className="max-w-md mx-auto mb-12">
                                        <TigerState
                                            state={status.mental_state}
                                            sanity={status.sanity}
                                            thought={status.current_thought}
                                        />
                                    </div>
                                </FadeIn>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                <StatsCard
                                    title="Balance"
                                    titleCn="模拟余额"
                                    value={`${(status?.simulated_balance || 10).toFixed(4)} BNB`}
                                    icon="💰"
                                    delay={0.1}
                                />
                                <StatsCard
                                    title="Total PnL"
                                    titleCn="总盈亏"
                                    value={`${(status?.total_pnl || 0) >= 0 ? '+' : ''}${(status?.total_pnl || 0).toFixed(4)} BNB`}
                                    icon="📊"
                                    trend={(status?.total_pnl || 0) >= 0 ? 'up' : 'down'}
                                    delay={0.2}
                                />
                                <StatsCard
                                    title="Win Rate"
                                    titleCn="胜率"
                                    value={`${(status?.win_rate || 0).toFixed(1)}%`}
                                    icon="🎯"
                                    delay={0.3}
                                />
                                <StatsCard
                                    title="Trades"
                                    titleCn="交易次数"
                                    value={status?.total_trades || 0}
                                    subtitle={`${status?.wins || 0}W / ${status?.losses || 0}L`}
                                    icon="📈"
                                    delay={0.4}
                                />
                            </div>

                            {/* Trades List */}
                            <FadeIn delay={0.5}>
                                <TradesList trades={trades} />
                            </FadeIn>
                        </>
                    )}
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 px-4 bg-bg-secondary/50">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="font-chinese text-3xl font-bold text-gold mb-2">白虎传说</h2>
                            <p className="text-gray-400">A Lenda do Tigre Branco</p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="glass rounded-2xl p-8">
                            <p className="font-chinese text-lg text-gray-300 leading-relaxed mb-6">
                                在西方圣山，太阳每天消逝的地方，住着天界守护者白虎。
                            </p>
                            <p className="text-gray-400 mb-6">
                                Nas montanhas sagradas do Oeste, onde o sol morre todo dia, vivia o Guardião Celestial - o Tigre Branco.
                            </p>
                            <p className="font-chinese text-lg text-gray-300 leading-relaxed mb-6">
                                三千年来，他观察帝国兴衰，财富聚散，宇宙的规律。
                            </p>
                            <p className="text-gray-400 mb-6">
                                Por 3000 anos ele observou impérios nascerem e caírem, fortunas serem feitas e perdidas, os padrões do universo.
                            </p>
                            <p className="font-chinese text-lg text-gold leading-relaxed">
                                "我不猎杀。我执行。"
                            </p>
                            <p className="text-gray-400">
                                "Eu não caço. Eu EXECUTO."
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="font-chinese text-3xl font-bold text-gold mb-2">运作方式</h2>
                            <p className="text-gray-400">Como Funciona</p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '👁️', titleCn: '观察', title: 'Observar', desc: '扫描BSC新代币' },
                            { icon: '🧠', titleCn: '分析', title: 'Analisar', desc: 'AI评估每个代币' },
                            { icon: '⚡', titleCn: '执行', title: 'Executar', desc: '自动模拟交易' },
                            { icon: '📊', titleCn: '记录', title: 'Registrar', desc: '透明展示结果' },
                        ].map((step, index) => (
                            <ScaleIn key={index} delay={index * 0.1}>
                                <div className="glass rounded-2xl p-6 text-center card-hover">
                                    <div className="text-4xl mb-4">{step.icon}</div>
                                    <h3 className="font-chinese text-xl text-gold mb-1">{step.titleCn}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{step.title}</p>
                                    <p className="text-gray-500 text-sm font-chinese">{step.desc}</p>
                                </div>
                            </ScaleIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <ScaleIn>
                    <div className="max-w-2xl mx-auto text-center glass rounded-3xl p-12 glow-gold">
                        <h2 className="font-chinese text-3xl font-bold text-gold mb-4">
                            模拟模式
                        </h2>
                        <p className="text-gray-300 mb-6 font-chinese">
                            白虎正在训练。所有交易都是模拟的。
                        </p>
                        <p className="text-gray-400 mb-8">
                            O Tigre está treinando. Todos os trades são simulados.
                        </p>
                        <div className="inline-block px-8 py-4 bg-gold/20 rounded-xl border border-gold/30">
                            <span className="text-gold font-chinese text-lg">
                                "一千次虚拟猎杀造就完美真实猎杀"
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-4">
                            "Mil caças virtuais fazem uma caça real perfeita"
                        </p>
                    </div>
                </ScaleIn>
            </section>
        </div>
    );
}
