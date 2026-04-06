import { register, login  } from "../api/walletAuth";

export default function My() {
    return (
        <div className="flex flex-col h-full">
            <header className="mb-5">
                <div className="flex gap-3 mb-3">
                    <h1 className="mb-3 text-3xl text-white slow-font">My</h1>
                </div>
            </header>
            <main className="justify-center h-full">
                <button 
                    className="flex-1 px-3 py-2 text-xs font-medium text-white transition-all border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={register}
                >
                register
                </button>                
                <button 
                    className="flex-1 px-3 py-2 text-xs font-medium text-white transition-all border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={login}
                >
                Login
                </button>
            </main>
        </div>
    )
}