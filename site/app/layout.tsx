import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
    title: '执行白虎 | ZHÍXÍNG BÁIHǓ - O Tigre que Executa',
    description: 'AI交易机器人 - BSC模拟交易 | AI Trading Bot - BSC Simulation Trading',
    keywords: ['BSC', 'BNB', 'trading', 'bot', 'AI', 'PancakeSwap', 'memecoin', '白虎', '执行'],
    icons: {
        icon: '/logo.png',
        apple: '/logo.png',
    },
    openGraph: {
        title: '执行白虎 | ZHÍXÍNG BÁIHǓ',
        description: 'AI交易机器人 - BSC模拟交易',
        type: 'website',
        images: ['/logo.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '执行白虎 | ZHÍXÍNG BÁIHǓ',
        description: 'AI交易机器人 - BSC模拟交易',
        images: ['/logo.png'],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-CN">
            <body className="min-h-screen flex flex-col bg-bg-primary text-white">
                <SmoothScroll>
                    <Navbar />
                    <main className="flex-1 pt-16">
                        {children}
                    </main>
                    <Footer />
                </SmoothScroll>
            </body>
        </html>
    );
}
