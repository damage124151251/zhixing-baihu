import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-bg-mountain border-t border-gold/10 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/logo.png"
                                alt="执行白虎"
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                            <div>
                                <h3 className="font-chinese text-xl font-bold text-gold">执行白虎</h3>
                                <p className="text-sm text-gray-500">ZHÍXÍNG BÁIHǓ</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm font-chinese">
                            观察。等待。执行。
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            Observar. Esperar. Executar.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-gold mb-4 font-chinese">链接</h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/" className="text-gray-400 hover:text-gold text-sm transition-colors">
                                首页 (Home)
                            </Link>
                            <Link href="/docs" className="text-gray-400 hover:text-gold text-sm transition-colors">
                                文档 (Docs)
                            </Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-gold text-sm transition-colors">
                                隐私政策 (Privacy)
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-gold text-sm transition-colors">
                                服务条款 (Terms)
                            </Link>
                        </div>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-sm font-semibold text-gold mb-4 font-chinese">社交</h4>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gold text-sm flex items-center gap-2 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                Twitter/X
                            </a>
                            <a
                                href="https://bscscan.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gold text-sm flex items-center gap-2 transition-colors"
                            >
                                <span>🔍</span>
                                BSCScan
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-gold/10 text-center">
                    <p className="text-gray-500 text-xs font-chinese">
                        © {new Date().getFullYear()} 执行白虎. 模拟交易 - 非投资建议
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                        Simulation Trading - Not Financial Advice
                    </p>
                </div>
            </div>
        </footer>
    );
}
