import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Log from "../components/Log";
import Ranking from "../components/Ranking";
import Contract from "../components/Contract";
import My from "../components/My";

type Tab = "log" | "ranking" | "contract" | "my";

const TABS: { key: Tab; label: string; short: string }[] = [
  { key: "log",      label: "Transactions", short: "Txns"      },
  { key: "ranking",  label: "Ranking",      short: "Ranking"   },
  { key: "contract", label: "Contracts",    short: "Contracts" },
  { key: "my",       label: "My Account",   short: "My"        },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<Tab>("log");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tab: Tab) => {
    if (tab === currentTab) return;
    setIsTransitioning(true);
    setTimeout(() => { setCurrentTab(tab); setIsTransitioning(false); }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 sm:py-10 bg-linear-to-br from-gray-700 to-gray-900">

      {/* ── 최상단 네비 ── */}
      <div className="w-full max-w-7xl px-4 sm:px-6 mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors slow-font"
        >
          ← Bridge
        </button>
        <span className="text-xs text-gray-600 slow-font">BridgeNet Explorer</span>
      </div>

      {/* ── 메인 카드 ── */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="shadow-2xl rounded-2xl bg-linear-to-br from-gray-800 to-black overflow-hidden">

          {/* 탭 바 */}
          <div className="flex items-end px-4 sm:px-6 pt-4 sm:pt-5 border-b border-white/8 bg-black/20">
            {TABS.map(({ key, label, short }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`relative px-2 sm:px-4 pb-3 text-xs sm:text-sm slow-font transition-colors mr-0.5 sm:mr-1 ${
                  currentTab === key ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{short}</span>
                {currentTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* 콘텐츠 */}
          <div
            className={`p-4 sm:p-8 transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            style={{ minHeight: 600 }}
          >
            {currentTab === "log"      && <Log />}
            {currentTab === "ranking"  && <Ranking />}
            {currentTab === "contract" && <Contract />}
            {currentTab === "my"       && <My />}
          </div>
        </div>
      </div>

      {/* GitHub */}
      <div className="mt-5">
        <a
          href="https://github.com/kangbaek324/bridgenet-backend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 mx-auto transition-colors border rounded-full bg-white/5 border-white/10 hover:bg-white/10"
        >
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
