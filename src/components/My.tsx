import { useState } from "react";
import { register, login } from "../api/walletAuth";

export default function My() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
    const [address, setAddress] = useState(localStorage.getItem("walletAddress") ?? "");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try { await register(); } catch (e) {} finally { setLoading(false); }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login();
            setIsLoggedIn(true);
        } catch (e) {}
        finally { setLoading(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* ── 헤더 ── */}
            <div className="mb-4">
                <h1 className="text-2xl text-white slow-font">My Account</h1>
                <p className="text-sm text-gray-500 slow-font mt-0.5">
                    Connect your wallet to use the bridge service
                </p>
            </div>

            <div className="rounded-xl border border-gray-700/60 overflow-hidden">
                {/* 상태 바 */}
                <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-800/40 border-b border-gray-700/60">
                    <div className={`w-2 h-2 rounded-full ${isLoggedIn ? "bg-emerald-400" : "bg-gray-600"}`} />
                    <span className="text-sm slow-font text-gray-400">
                        {isLoggedIn ? "Connected" : "Not connected"}
                    </span>
                </div>

                {/* 계정 정보 rows */}
                <div className="px-5 py-1">
                    <div className="flex items-center gap-4 py-3 border-b border-gray-700/40">
                        <span className="w-36 shrink-0 text-sm text-gray-500 slow-font">Session Status</span>
                        <span className={`px-2.5 py-0.5 rounded text-xs slow-font ${
                            isLoggedIn
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}>
                            {isLoggedIn ? "LOGGED IN" : "LOGGED OUT"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 py-3">
                        <span className="w-36 shrink-0 text-sm text-gray-500 slow-font">Access Token</span>
                        <span className="font-mono text-xs text-gray-400 truncate">
                            {isLoggedIn
                                ? (localStorage.getItem("accessToken") ?? "").slice(0, 40) + "..."
                                : "—"
                            }
                        </span>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 px-5 pb-5 pt-2">
                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="flex-1 py-2.5 text-sm slow-font text-white bg-blue-600/80 border border-blue-500/50 rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Processing..." : "Login with Wallet"}
                            </button>
                            <button
                                onClick={handleRegister}
                                disabled={loading}
                                className="flex-1 py-2.5 text-sm slow-font text-gray-300 bg-gray-700/40 border border-gray-600 rounded-lg hover:bg-gray-700/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Processing..." : "Register"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="flex-1 py-2.5 text-sm slow-font text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
