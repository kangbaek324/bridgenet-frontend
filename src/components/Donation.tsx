import DonationItem from "./DonationItem"

export default function Donation() {
    return (
        <div className="w-full h-full shadow-2xl rounded-2xl p-6 bg-gradient-to-br from-gray-800 to-black flex flex-col">
            <h1 className="text-4xl slow-font text-white pb-2">Donation</h1>
            <p className="slow-font text-white pb-4">Donation For Me 💫</p>
            
            <DonationItem
                chainName="My Address"
                contractAddress="0x0A6B6a4d7ad63E73D9BC630B6B4C8b66A8F3DCEE"
                imageUrl="/logo/ethereum.png"
            />

            <p className="slow-font text-white mt-6 pb-4">Donation For Contract 🌐</p>
            
            <div className="flex gap-3 flex-col max-h-60 overflow-y-scroll scroll-auto flex-1 custom-scrollbar">   
                <DonationItem 
                    chainName="BSC"
                    contractAddress="Not yet"
                    imageUrl="/logo/binance-smart-chain-bsc.png"
                />             
                <DonationItem 
                    chainName="Sepolia"
                    contractAddress="0x04Ff4586a5Fa21BC950Eb441B28Eb05E5Bd73E5b"
                    imageUrl="/logo/ethereum.png"
                />
                <DonationItem 
                    chainName="Amoy"
                    contractAddress="0xF8862C3829FB4BF2E21CECc6423a55a4Cd325Cb9"
                    imageUrl="/logo/polygon.png"
                />
            </div>
        </div>
    )
}