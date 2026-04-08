import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatEther } from "ethers";

const MOCK_DETAIL: Record<string, any> = {
  "1": {
    id: 1,
    from: {
      chain: {
        chainId: 11155111,
        chainName: "Sepolia",
        value: "100000000000000000",
        unit: "ETH",
      },
      tx: [
        {
          hash: "0x4f3a1b2c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
          processedBlock: "5823041",
          status: "CONFIRMED",
        },
      ],
    },
    to: {
      chain: {
        chainId: 80002,
        chainName: "Amoy",
        value: "98000000000000000",
        unit: "MATIC",
      },
      tx: [
        {
          hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
          processedBlock: "9041823",
          status: "CONFIRMED",
        },
        {
          hash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
          processedBlock: "9041890",
          status: "CONFIRMED",
        },
      ],
    },
    approveStatus: "APPROVE",
    bridgeStatus: "COMPLETED",
    createdAt: "2025-04-06T10:30:00",
  },
};

const approveStyle: Record<string, { dot: string; text: string }> = {
  APPROVE: { dot: "bg-emerald-400", text: "text-emerald-400" },
  REJECT: { dot: "bg-red-400", text: "text-red-400" },
  PENDING: { dot: "bg-amber-400", text: "text-amber-400" },
};
const bridgeStyle: Record<string, { dot: string; text: string }> = {
  COMPLETED: { dot: "bg-emerald-400", text: "text-emerald-400" },
  FAILED: { dot: "bg-red-400", text: "text-red-400" },
  IN_PROGRESS: { dot: "bg-blue-400 animate-pulse", text: "text-blue-400" },
  PENDING: { dot: "bg-amber-400", text: "text-amber-400" },
};
const txStyle: Record<string, { dot: string; text: string }> = {
  CONFIRMED: { dot: "bg-emerald-400", text: "text-emerald-400" },
  DROPPED: { dot: "bg-red-400", text: "text-red-400" },
  PENDING: { dot: "bg-amber-400", text: "text-amber-400" },
};

function StatusDot({
  style,
  label,
}: {
  style: { dot: string; text: string };
  label: string;
}) {
  return (
    <span
      className={`flex items-center gap-2 text-base slow-font ${style.text}`}
    >
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot}`} />
      {label}
    </span>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-3.5 border-b border-white/5 last:border-0">
      <span className="w-40 pt-px text-sm text-gray-400 shrink-0 slow-font">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8081/api/bridge/requests/${id}`)
      .then((r) => r.json())
      .then((r) => setDetail(r.data))
      .catch(() => setDetail(MOCK_DETAIL[id!] ?? MOCK_DETAIL["1"]))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-700 to-gray-900">
        <div className="w-10 h-10 border-4 rounded-full border-slate-600 border-t-white animate-spin" />
        <p className="mt-4 text-white slow-font">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-linear-to-br from-gray-700 to-gray-900">
      {/* 네비 */}
      <div className="flex items-center justify-between px-1 mb-4 w-7xl">
        <button
          onClick={() => navigate("/explore")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors slow-font"
        >
          ← Explore
        </button>
        <span className="text-xs text-gray-600 slow-font">
          Transaction Detail
        </span>
      </div>

      {/* 메인 카드 */}
      <div
        className="overflow-hidden shadow-2xl w-7xl rounded-2xl bg-linear-to-br from-gray-800 to-black"
        style={{ minHeight: 820 }}
      >
        {detail ? (
          <>
            {/* ── 카드 헤더 ── */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/8 bg-black/20">
              <div>
                <p className="text-xs text-gray-400 slow-font mb-0.5">
                  Request ID
                </p>
                <h1 className="text-3xl text-white slow-font">#{detail.id}</h1>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="mb-1 text-xs text-gray-400 slow-font">
                    Approve Status
                  </p>
                  <StatusDot
                    style={
                      approveStyle[detail.approveStatus] ?? {
                        dot: "bg-gray-500",
                        text: "text-gray-400",
                      }
                    }
                    label={detail.approveStatus}
                  />
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-right">
                  <p className="mb-1 text-xs text-gray-400 slow-font">
                    Bridge Status
                  </p>
                  <StatusDot
                    style={
                      bridgeStyle[detail.bridgeStatus] ?? {
                        dot: "bg-gray-500",
                        text: "text-gray-400",
                      }
                    }
                    label={detail.bridgeStatus}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 px-8 py-6">
              {/* ── 섹션 1: Overview ── */}
              <Section title="Overview">
                <Row label="Request ID">
                  <span className="font-mono text-base text-white">
                    #{detail.id}
                  </span>
                </Row>
                <Row label="Approve Status">
                  <StatusDot
                    style={
                      approveStyle[detail.approveStatus] ?? {
                        dot: "bg-gray-500",
                        text: "text-gray-400",
                      }
                    }
                    label={detail.approveStatus}
                  />
                </Row>
                <Row label="Bridge Status">
                  <StatusDot
                    style={
                      bridgeStyle[detail.bridgeStatus] ?? {
                        dot: "bg-gray-500",
                        text: "text-gray-400",
                      }
                    }
                    label={detail.bridgeStatus}
                  />
                </Row>
                <Row label="Timestamp">
                  <span className="text-base text-gray-100 slow-font">
                    {new Date(detail.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </Row>
              </Section>

              {/* ── 섹션 2: From Chain ── */}
              <Section
                title="From Chain"
                icon={
                  <img
                    src={`/logo/${detail.from.chain.chainId}-logo.png`}
                    className="w-5 h-5 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                }
                accent="border-blue-500/40"
              >
                <Row label="Chain Name">
                  <span className="text-base text-white slow-font">
                    {detail.from.chain.chainName}
                  </span>
                </Row>
                <Row label="Chain ID">
                  <span className="font-mono text-base text-gray-100">
                    {detail.from.chain.chainId}
                  </span>
                </Row>
                <Row label="Send Amount">
                  <span className="font-mono text-base text-emerald-400">
                    {formatEther(detail.from.chain.value.toString())}
                  </span>
                  <span className="text-gray-400 text-sm ml-1.5">
                    {detail.from.chain.unit}
                  </span>
                </Row>
                <Row label="Transactions">
                  <TxList
                    txs={detail.from.tx}
                    chainId={detail.from.chain.chainId}
                  />
                </Row>
              </Section>

              {/* ── 화살표 ── */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/8" />
                <span className="px-3 text-xs text-gray-600 slow-font">
                  ↓ Bridge Transfer
                </span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* ── 섹션 3: To Chain ── */}
              <Section
                title="To Chain"
                icon={
                  <img
                    src={`/logo/${detail.to.chain.chainId}-logo.png`}
                    className="w-5 h-5 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                }
                accent="border-purple-500/40"
              >
                <Row label="Chain Name">
                  <span className="text-base text-white slow-font">
                    {detail.to.chain.chainName}
                  </span>
                </Row>
                <Row label="Chain ID">
                  <span className="font-mono text-base text-gray-100">
                    {detail.to.chain.chainId}
                  </span>
                </Row>
                <Row label="Receive Amount">
                  <span className="font-mono text-base text-emerald-400">
                    {formatEther(detail.to.chain.value.toString())}
                  </span>
                  <span className="text-gray-400 text-sm ml-1.5">
                    {detail.to.chain.unit}
                  </span>
                </Row>
                <Row label="Transactions">
                  <TxList
                    txs={detail.to.tx}
                    chainId={detail.to.chain.chainId}
                  />
                </Row>
              </Section>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full py-32 text-gray-600 slow-font">
            Request not found.
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  accent = "border-white/8",
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border ${accent} overflow-hidden`}>
      <div className="flex items-center gap-2.5 px-5 py-3 bg-white/3 border-b border-white/8">
        {icon}
        <span className="text-sm font-semibold text-white slow-font">
          {title}
        </span>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </div>
  );
}

const EXPLORER_BASE: Record<number, string> = {
  11155111: "https://sepolia.etherscan.io/tx/",
  80002: "https://amoy.polygonscan.com/tx/",
};

function TxList({ txs, chainId }: { txs: any[]; chainId?: number }) {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (hash: string, idx: number) => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  if (txs.length === 0)
    return (
      <span className="text-sm italic text-gray-500 slow-font">
        No transactions yet
      </span>
    );
  return (
    <div className="flex flex-col w-full gap-4">
      {txs.map((tx, i) => {
        const s = txStyle[tx.status] ?? {
          dot: "bg-gray-500",
          text: "text-gray-400",
        };
        const explorerUrl =
          chainId && tx.hash ? `${EXPLORER_BASE[chainId]}${tx.hash}` : null;
        return (
          <div key={i} className="flex flex-col gap-1.5">
            {txs.length > 1 && (
              <span className="text-xs text-gray-600 slow-font mb-0.5">
                Transaction #{i + 1}
              </span>
            )}
            <div className="flex items-start gap-4">
              <span className="text-sm text-gray-400 w-28 shrink-0 slow-font">
                Tx Hash
              </span>
              <div className="flex items-start min-w-0 gap-2">
                {explorerUrl ? (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-blue-400 break-all transition-colors hover:text-blue-300"
                  >
                    {tx.hash}
                  </a>
                ) : (
                  <span className="font-mono text-sm text-gray-100 break-all">
                    {tx.hash ?? "—"}
                  </span>
                )}
                {tx.hash && (
                  <div className="relative shrink-0 mt-0.5">
                    <button
                      onClick={() => copy(tx.hash, i)}
                      className="text-gray-500 transition-colors hover:text-white"
                      title="Copy hash"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                    {copied === i && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-emerald-400 slow-font bg-gray-900 px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
                        Copied!
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-28 shrink-0 slow-font">
                Block Number
              </span>
              <span className="font-mono text-sm text-gray-100">
                {tx.processedBlock ?? "—"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-28 shrink-0 slow-font">
                Status
              </span>
              <span
                className={`flex items-center gap-1.5 text-sm slow-font ${s.text}`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                {tx.status}
              </span>
            </div>
            {i < txs.length - 1 && (
              <div className="mt-2 border-b border-white/8" />
            )}
          </div>
        );
      })}
    </div>
  );
}
