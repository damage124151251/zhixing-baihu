import FadeIn from '@/components/FadeIn';

export default function Docs() {
    return (
        <div className="min-h-screen bg-mountains py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="font-chinese text-4xl font-bold text-gold mb-2">æ–‡æ¡£</h1>
                        <p className="text-gray-400">DocumentaÃ§Ã£o</p>
                    </div>
                </FadeIn>

                <div className="space-y-8">
                    {/* What is it */}
                    <FadeIn delay={0.1}>
                        <div className="glass rounded-2xl p-8">
                            <h2 className="font-chinese text-2xl text-gold mb-4">ðŸ¯ ä»€ä¹ˆæ˜¯æ‰§è¡Œç™½è™Ž?</h2>
                            <p className="text-gray-300 mb-4 font-chinese">
                                æ‰§è¡Œç™½è™Žæ˜¯ä¸€ä¸ªAIé©±åŠ¨çš„BSCäº¤æ˜“æœºå™¨äººï¼Œå®žæ—¶åˆ†æžæ–°ä»£å¸å¹¶è‡ªåŠ¨æ‰§è¡Œæ¨¡æ‹Ÿäº¤æ˜“ã€‚
                            </p>
                            <p className="text-gray-400">
                                æ‰§è¡Œç™½è™Ž Ã© um bot de trading AI para BSC que analisa novos tokens em tempo real
                                and executes simulated trades automatically.
                            </p>
                        </div>
                    </FadeIn>

                    {/* How it works */}
                    <FadeIn delay={0.2}>
                        <div className="glass rounded-2xl p-8">
                            <h2 className="font-chinese text-2xl text-gold mb-4">âš™ï¸ è¿ä½œåŽŸç†</h2>
                            <ol className="space-y-4">
                                <li className="flex gap-4">
                                    <span className="text-gold font-bold">1.</span>
                                    <div>
                                        <p className="text-gray-300 font-chinese">æ‰«æDexScreenerèŽ·å–æ–°ä»£å¸</p>
                                        <p className="text-gray-500 text-sm">Scans DexScreener for new tokens</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-gold font-bold">2.</span>
                                    <div>
                                        <p className="text-gray-300 font-chinese">AIåˆ†æžå¹¶è¯„åˆ†(0-100)</p>
                                        <p className="text-gray-500 text-sm">AI analisa e dÃ¡ score (0-100)</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-gold font-bold">3.</span>
                                    <div>
                                        <p className="text-gray-300 font-chinese">åˆ†æ•°&gt;=75è‡ªåŠ¨æ¨¡æ‹Ÿä¹°å…¥</p>
                                        <p className="text-gray-500 text-sm">Score &gt;= 75 auto-compra simulada</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-gold font-bold">4.</span>
                                    <div>
                                        <p className="text-gray-300 font-chinese">ç›‘æŽ§æŒä»“ï¼Œæ­¢ç›ˆæ­¢æŸ</p>
                                        <p className="text-gray-500 text-sm">Monitora posiÃ§Ãµes, TP/SL automÃ¡tico</p>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </FadeIn>

                    {/* Tiger States */}
                    <FadeIn delay={0.3}>
                        <div className="glass rounded-2xl p-8">
                            <h2 className="font-chinese text-2xl text-gold mb-4">ðŸŽ­ è™Žæ€ç³»ç»Ÿ</h2>
                            <p className="text-gray-400 mb-6">Tiger State System</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { emoji: 'ðŸ”¥', name: 'çŒŽæ€', en: 'LIESHA', range: '80-100%', desc: 'æ¨¡å¼æ”»å‡»' },
                                    { emoji: 'ðŸ˜Ž', name: 'æ½œä¼', en: 'QIANFU', range: '60-79%', desc: 'åŸ‹ä¼ç­‰å¾…' },
                                    { emoji: 'ðŸ¤”', name: 'è§‚å¯Ÿ', en: 'GUANCHA', range: '40-59%', desc: 'è°¨æ…Žåˆ†æž' },
                                    { emoji: 'ðŸ˜¤', name: 'è­¦è§‰', en: 'JINGJUE', range: '20-39%', desc: 'é˜²å¾¡æ¨¡å¼' },
                                    { emoji: 'ðŸ’€', name: 'å—ä¼¤', en: 'SHOUSHANG', range: '0-19%', desc: 'æ¢å¤ä¸­' },
                                ].map((state, i) => (
                                    <div key={i} className="bg-bg-primary/50 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{state.emoji}</span>
                                            <div>
                                                <p className="font-chinese text-gold">{state.name} ({state.en})</p>
                                                <p className="text-gray-500 text-sm">{state.range} - {state.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Parameters */}
                    <FadeIn delay={0.4}>
                        <div className="glass rounded-2xl p-8">
                            <h2 className="font-chinese text-2xl text-gold mb-4">ðŸ“Š äº¤æ˜“å‚æ•°</h2>
                            <div className="bg-bg-primary/50 rounded-lg p-4 space-y-2 font-mono text-sm">
                                <p><span className="text-gold">åˆå§‹ä½™é¢:</span> <span className="text-white">10 BNB (æ¨¡æ‹Ÿ)</span></p>
                                <p><span className="text-gold">æœ€ä½Žåˆ†æ•°:</span> <span className="text-white">75/100</span></p>
                                <p><span className="text-gold">å•ç¬”æœ€å¤§:</span> <span className="text-white">0.5 BNB</span></p>
                                <p><span className="text-gold">æ­¢æŸ:</span> <span className="text-loss">-20%</span></p>
                                <p><span className="text-gold">æ­¢ç›ˆ:</span> <span className="text-profit">+40%</span></p>
                                <p><span className="text-gold">æ»‘ç‚¹:</span> <span className="text-white">12%</span></p>
                            </div>
                        </div>
                    </FadeIn>

                    {/* FAQ */}
                    <FadeIn delay={0.5}>
                        <div className="glass rounded-2xl p-8">
                            <h2 className="font-chinese text-2xl text-gold mb-4">â“ å¸¸è§é—®é¢˜</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-chinese text-lg text-white mb-2">ä¸ºä»€ä¹ˆæ˜¯æ¨¡æ‹Ÿ?</h3>
                                    <p className="text-gray-400">
                                        ç™½è™Žä¸ä¼šåœ¨æ²¡æœ‰æŠŠæ¡çš„æƒ…å†µä¸‹å‡ºå‡»ã€‚æ¨¡æ‹Ÿæ˜¯ä¸ºäº†è¯æ˜Žç­–ç•¥æœ‰æ•ˆã€‚
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-chinese text-lg text-white mb-2">æ•°æ®æ˜¯çœŸå®žçš„å—?</h3>
                                    <p className="text-gray-400">
                                        äº¤æ˜“æ˜¯æ¨¡æ‹Ÿçš„ï¼Œä½†åˆ†æžæ˜¯é’ˆå¯¹çœŸå®žä»£å¸çš„ã€‚æ‰€æœ‰æ•°æ®é€æ˜Žå…¬å¼€ã€‚
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-chinese text-lg text-white mb-2">ä»€ä¹ˆæ—¶å€™çœŸå®žäº¤æ˜“?</h3>
                                    <p className="text-gray-400">
                                        å½“æ¨¡æ‹Ÿç»“æžœæŒç»­ç›ˆåˆ©æ—¶ã€‚ä¹Ÿè®¸ã€‚(YÄ›xÇ” - Talvez)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}

