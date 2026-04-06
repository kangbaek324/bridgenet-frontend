import DonationItem from "./DonationItem"

export default function Donation() {
    return (
        <div className="w-[480px] h-[500px] shadow-2xl rounded-2xl p-6 bg-gradient-to-br from-gray-800 to-black flex flex-col">
            <h1 className="pb-2 text-4xl text-white slow-font">Donation</h1>
            <p className="pb-4 text-white slow-font">Donation For Me 💫</p>
            
            <DonationItem
                chainName="My Address"
                contractAddress="0x0A6B6a4d7ad63E73D9BC630B6B4C8b66A8F3DCEE"
                imageUrl="/logo/11155111-logo.png"
            />

            <p className="pb-4 mt-6 text-white slow-font">Donation For Contract 🌐</p>
            
            <div className="flex flex-col flex-1 gap-3 overflow-y-auto scrollbar-hide max-h-60r">   
                <DonationItem 
                    chainName="BSC"
                    contractAddress="Not yet"
                    imageUrl="/logo/binance-smart-chain-bsc.png"
                />             
                <DonationItem 
                    chainName="Sepolia"
                    contractAddress="0x04Ff4586a5Fa21BC950Eb441B28Eb05E5Bd73E5b"
                    imageUrl="/logo/11155111-logo.png"
                />
                <DonationItem 
                    chainName="Amoy"
                    contractAddress="0xF8862C3829FB4BF2E21CECc6423a55a4Cd325Cb9"
                    imageUrl="/logo/80002-logo.png"
                />
            </div>
        </div>
    )
}