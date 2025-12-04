interface DonationItemProps {
    chainName: string
    contractAddress: string,
    imageUrl: string
}

export default function DonationItem({ chainName, contractAddress, imageUrl }: DonationItemProps) {
    return (
        <div className="bg-[#333333] p-5 rounded-lg w-full">
            <div className="flex gap-3 leading-4.5 mb-2">
                <img src={imageUrl} className="w-6 h-6" />
                <p className="text-white slow-font">{chainName}</p>
            </div>
            <p className="font-mono text-base text-white break-all">{contractAddress}</p>
        </div>
    )
}