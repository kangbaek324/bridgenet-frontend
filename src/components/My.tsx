import { useState } from "react";
import { register, login } from "../api/walletAuth";

export default function My() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
    const [loading, setLoading]       = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try { await login(); setIsLoggedIn(true); } catch {}
        finally { setLoading(false); }
    };
    const handleRegister = async () => {
        setLoading(true);
        try { await register(); } catch {}
        finally { setLoading(false); }
    };
    const handleLogout = () => { localStorage.removeItem("accessToken"); setIsLoggedIn(false); };

    const token = localStorage.getItem("accessToken") ?? "";

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-lg text-white slow-font">My Account</h2>
                <p className="text-xs text-gray-500 mt-0.5">Connect your wallet to use the bridge service</p>
            </div>

            {/* 계정 정보 카드 */}
            <div className="rounded-xl border border-white/8 overflow-hidden">
                {/* 상태 바 */}
                <div className="flex items-center gap-3 px-5 py-3 bg-white/3 border-b border-white/8">
                    <span className={`w-2 h-2 rounded-full ${isLoggedIn ? "bg-emerald-400" : "bg-gray-600"}`} />
                    <span className="text-sm text-gray-300 slow-font">
                        {isLoggedIn ? "Wallet Connected" : "Not Connected"}
                    </span>
                </div>

                {/* 정보 rows */}
                <div className="divide-y divide-white/5">
                    <Row label="Session Status">
                        <span className={`flex items-center gap-1.5 text-xs slow-font ${isLoggedIn ? "text-emerald-400" : "text-gray-500"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isLoggedIn ? "bg-emerald-400" : "bg-gray-600"}`} />
                            {isLoggedIn ? "ACTIVE" : "INACTIVE"}
                        </span>
                    </Row>
                    <Row label="Access Token">
                        {isLoggedIn ? (
                            <span className="font-mono text-xs text-gray-400 break-all">
                                {token.slice(0, 48)}...
                            </span>
                        ) : (
                            <span className="text-xs text-gray-600 slow-font">—</span>
                        )}
                    </Row>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 px-5 py-4 bg-white/2 border-t border-white/5">
                    {isLoggedIn ? (
                        <button onClick={handleLogout}
                            className="flex-1 py-2.5 text-sm slow-font text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors">
                            Logout
                        </button>
                    ) : (
                        <>
                            <button onClick={handleLogin} disabled={loading}
                                className="flex-1 py-2.5 text-sm slow-font text-white bg-blue-600/70 border border-blue-500/40 rounded-lg hover:bg-blue-600/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                {loading ? "Processing..." : "Login with Wallet"}
                            </button>
                            <button onClick={handleRegister} disabled={loading}
                                className="flex-1 py-2.5 text-sm slow-font text-gray-300 border border-white/10 rounded-lg hover:bg-white/8 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                {loading ? "Processing..." : "Register"}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <p className="text-xs text-blue-400 slow-font text-center mt-4">
                To use the bridge, register your whitelist in the Contracts tab
            </p>
        </div>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-32 shrink-0 text-sm text-gray-500 slow-font">{label}</span>
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );
}
