interface BridgeItemProps {
    direction: string;
    selectedChain: string;
    onChainChange: (chain: string) => void;
    value: string;
    onValueChange?: (value: string) => void;
    readOnly?: boolean;
}

export default function BridgeItem({ 
    direction, 
    selectedChain, 
    onChainChange, 
    value,
    onValueChange,
    readOnly = false
}: BridgeItemProps) {
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!readOnly && onValueChange) {
            const newValue = e.target.value;
            
            // 음수 방지
            if (parseFloat(newValue) < 0) return;
            onValueChange(newValue);
        }
    };

    return (
        <div className="flex py-6 bg-[#333333] p-5 color rounded-lg mt-5">
            <div className="w-[30%]">
                <p className="mb-3 text-sm font-light text-slate-400">{direction}</p>
                <input 
                    className="text-4xl text-white bg-transparent border-0 focus:outline-0 mbc-font" 
                    placeholder="0.00" 
                    type="number" 
                    min={0.00001}
                    value={value}
                    onChange={handleValueChange}
                    readOnly={readOnly}
                />
            </div>
            <div className="w-[70%] text-right">
                <select 
                    className="pb-1.5 text-white text-base slow-font bg-[#333333] focus:outline-none cursor-pointer"
                    value={selectedChain}
                    onChange={(e) => onChainChange(e.target.value)}
                >
                    <option value="11155111">Sepolia</option>
                    <option value="80002">Amoy</option>
                </select>
            </div>
        </div>
    );
}