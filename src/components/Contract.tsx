import ContractItem from "./ContractItem";

export default function Contract() {
    return (
        <div className="flex flex-col h-full">
            <header className="mb-5">
                <div className="flex gap-3 mb-3">
                    <h1 className="mb-3 text-3xl text-white slow-font">Contract</h1>
                </div>
                <div className="text-white slow-font">
                    <p>Can use Contract On Bridge</p>
                </div>
            </header>
            <main className="grid grid-cols-2 gap-4 h-[574px] content-start overflow-y-auto scrollbar-hide">
                <ContractItem></ContractItem>
                <ContractItem></ContractItem>
                <ContractItem></ContractItem>
                <ContractItem></ContractItem>
            </main>
        </div>
    );
}