export default function Introduce() {
    return (
        <div className="w-[480px] h-[500px] shadow-2xl rounded-2xl p-6 bg-linear-to-br from-gray-800 to-black ">
            <h1 className="pb-4 text-4xl text-white slow-font">Introduce</h1>
            <p className="text-white slow-font">Welcome to BridgeNet 🌉</p>
            <p className="text-white slow-font">We Support Cross Chain Bridge on TestNetwork</p>
            <p className="slow-font text-white my-2.5">Support Network</p>

            <div className="flex gap-3">
                <img src="/logo/11155111-logo.png" alt="ethereum-logo" className="w-8 h-8" />
                <img src="/logo/80002-logo.png" alt="polygon-logo" className="w-8 h-8" />
                <img src="/logo/binance-smart-chain-bsc.png" alt="binance-smart-chain-bsc-logo" className="w-8 h-8" />
            </div>

            <p className="mt-10 text-white slow-font">Thank You</p>
        </div>
    );
}