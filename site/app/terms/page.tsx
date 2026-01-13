export default function Terms() {
    return (
        <div className="min-h-screen bg-mountains py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-chinese text-3xl font-bold text-gold mb-2">服务条款</h1>
                <p className="text-gray-400 mb-8">Terms of Service</p>
                <p className="text-gray-500 mb-8">最后更新: {new Date().toLocaleDateString()}</p>

                <div className="glass rounded-2xl p-8 space-y-8">
                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">接受条款</h2>
                        <h3 className="text-gray-400 text-sm mb-2">Acceptance of Terms</h3>
                        <p className="text-gray-300">
                            使用本服务即表示您同意这些条款。这是一个实验性项目。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            By using this service, you agree to these terms. This is an experimental project.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">风险声明</h2>
                        <h3 className="text-gray-400 text-sm mb-2">Risk Disclaimer</h3>
                        <p className="text-gray-300">
                            加密货币交易涉及重大风险。您可能会损失所有资金。这不是投资建议。交易前请自行研究。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Trading cryptocurrencies involves significant risk. You may lose all your funds.
                            This is not financial advice. Do your own research before trading.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">模拟交易</h2>
                        <h3 className="text-gray-400 text-sm mb-2">Simulation Mode</h3>
                        <p className="text-gray-300">
                            本机器人目前在模拟模式下运行。所有交易都是虚拟的，不涉及真实资金。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            This bot currently operates in simulation mode. All trades are virtual and do not involve real funds.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">无担保</h2>
                        <h3 className="text-gray-400 text-sm mb-2">No Guarantees</h3>
                        <p className="text-gray-300">
                            我们不对利润或性能做任何保证。过去的表现不代表未来的结果。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            We make no guarantees about profits or performance. Past performance does not indicate future results.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-chinese text-xl font-semibold text-gold mb-3">责任限制</h2>
                        <h3 className="text-gray-400 text-sm mb-2">Limitation of Liability</h3>
                        <p className="text-gray-300">
                            对于使用本服务造成的任何损失，我们不承担责任。
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            We are not liable for any losses incurred through use of this service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
