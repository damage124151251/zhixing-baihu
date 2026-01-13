export default function Privacy() {
    return (
        <div className="min-h-screen bg-mountains py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-chinese text-3xl font-bold text-gold mb-2">隐私政策</h1>
                <p className="text-gray-400 mb-8">Privacy Policy</p>
                <p className="text-gray-500 mb-8">最后更新: {new Date().toLocaleDateString()}</p>

                <div className="glass rounded-2xl p-8 space-y-8">
                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">信息收集</h2>
                        <h3 className="text-gray-400 text-sm mb-2">Information We Collect</h3>
                        <p className="text-gray-300">
                            我们仅收集公开的区块链数据用于显示目的。我们不收集个人信息。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            We only collect public blockchain data for display purposes. We do not collect personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">信息使用</h2>
                        <h3 className="text-gray-400 text-sm mb-2">How We Use Information</h3>
                        <p className="text-gray-300">
                            所有数据仅用于在dashboard上显示模拟交易结果。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            All data is used solely to display simulated trading results on the dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">数据存储</h2>
                        <h3 className="text-gray-400 text-sm mb-2">Data Storage</h3>
                        <p className="text-gray-300">
                            交易数据存储用于显示目的。所有区块链数据本质上是公开的。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Transaction data is stored for display purposes. All blockchain data is public by nature.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">联系方式</h2>
                        <h3 className="text-gray-400 text-sm mb-2">Contact</h3>
                        <p className="text-gray-300">
                            如有问题，请通过Twitter/X联系我们。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            For questions about this policy, contact us on Twitter/X.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
