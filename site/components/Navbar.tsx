'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="执行白虎"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="font-chinese text-lg font-bold text-gold">执行白虎</span>
                            <span className="text-xs text-gray-400 -mt-1">ZHÍXÍNG BÁIHǓ</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-300 hover:text-gold transition-colors font-chinese">
                            首页
                        </Link>
                        <Link href="/docs" className="text-gray-300 hover:text-gold transition-colors font-chinese">
                            文档
                        </Link>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-gold transition-colors"
                        >
                            Twitter/X
                        </a>
                        <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-chinese">
                            模拟模式
                        </span>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gold/20">
                        <div className="flex flex-col gap-4">
                            <Link href="/" className="text-gray-300 hover:text-gold font-chinese">首页</Link>
                            <Link href="/docs" className="text-gray-300 hover:text-gold font-chinese">文档</Link>
                            <a href="https://twitter.com" target="_blank" className="text-gray-300 hover:text-gold">
                                Twitter/X
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
