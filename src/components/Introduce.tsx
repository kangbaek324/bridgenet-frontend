export default function Introduce() {
    return (
        <div className="w-full shadow-2xl rounded-2xl p-6 bg-linear-to-br from-gray-800 to-black h-[450px] ">
            <h1 className="text-4xl slow-font text-white pb-4">Introduce</h1>
            <p className="slow-font text-white">Welcome to BridgeNet 🌉</p>
            <p className="slow-font text-white">We Support Cross Chain Bridge on TestNetwork</p>
            <p className="slow-font text-white my-2.5">Support Network</p>

            <div className="flex gap-3">
                <img src="/logo/ethereum.png" alt="ethereum-logo" className="w-8 h-8" />
                <img src="/logo/polygon.png" alt="polygon-logo" className="w-8 h-8" />
                <img src="/logo/binance-smart-chain-bsc.png" alt="binance-smart-chain-bsc-logo" className="w-8 h-8" />
            </div>

            <p className="slow-font text-white mt-10">Thank You</p>
        </div>
    );
}