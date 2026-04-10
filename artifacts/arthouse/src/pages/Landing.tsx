import { useEffect, useRef, useState, useCallback } from "react";

const SCAN_MESSAGES = [
  "◆ SCANNING...",
  "◆ ANALYZING ONCHAIN...",
  "◆ BUILDER DETECTED",
  "◆ TALENT SCOUTING...",
  "◆ ZORA NETWORK OK",
  "◆ INTELLIGENCE ACTIVE",
];

const TICKER_ITEMS = [
  "Onchain Art Intelligence",
  "Base + Zora",
  "Creator Discovery",
  "Not Every Creator Who Mints Is Building",
  "$ARTHOUSE",
  "Talent Scout",
  "Onchain Forever",
  "@arthousexbt_bot",
];

type ChatMessage = {
  type: "usr" | "ai" | "sys" | "score";
  content?: string;
  scoreData?: {
    creator: string;
    score: number;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    cls: string;
    cc: string;
    note: string;
  };
};

const FLOWS: Record<string, ChatMessage[]> = {
  "analyze @liquidcreator": [
    { type: "sys", content: "◆ Scanning onchain activity for @liquidcreator..." },
    {
      type: "score",
      scoreData: {
        creator: "@liquidcreator",
        score: 74,
        d1: 19,
        d2: 18,
        d3: 22,
        d4: 12,
        cls: "WATCHLIST ⚡",
        cc: "#66C800",
        note: "Strong content consistency and building signals. Traction still early. Monitor next 3–4 weeks.",
      },
    },
  ],
  "who is building this week?": [
    { type: "sys", content: "\u25C6 Analyzing active builders on Zora this week..." },
    {
      type: "ai",
      content:
        "Top 3 active builders on Zora this week:\n\n1. @voidmaker \u2014 Void Series part 7 published. Deep community engagement.\n\n2. @electriccanvas \u2014 Experimenting with Zora Coins + generative drops. High Farcaster activity.\n\n3. @quietform \u2014 Slow and consistent. No hype, strong collector base growing organically.",
    },
  ],
  "is this creator legit?": [
    { type: "sys", content: "\u25C6 Running red flag checklist..." },
    {
      type: "ai",
      content:
        "To run a full red flag check, share the creator handle.\n\nChecklist I run:\n\u2713 Wallet age > 3 months\n\u2713 Bio with real context\n\u2713 Active Farcaster presence\n\u2713 Content has a theme/niche\n\u2713 Holder distribution (not 1-2 wallets)\n\u2713 Engages with other creators\n\nSend me the handle and I will check all 6.",
    },
  ],
  "builder vs flipper?": [
    {
      type: "ai",
      content:
        "Builder vs Flipper:\n\nBuilder signals:\n\u2192 Shares process, not just results\n\u2192 Has a content series in progress\n\u2192 Replies to other creators with substance\n\u2192 Active on Farcaster discussing the ecosystem\n\u2192 Still posting 6 months from now\n\nFlipper signals:\n\u2192 Burst posting then silence\n\u2192 All posts = buy my coin\n\u2192 Never engages with anyone\n\u2192 No narrative behind the work\n\nBuilders build. Flippers exit.",
    },
  ],
};

const FALLBACK_FLOW: ChatMessage[] = [
  { type: "sys", content: "◆ Processing your query..." },
  {
    type: "ai",
    content:
      "Good question. For detailed live analysis with real onchain data, continue this conversation on @arthousexbt_bot in Telegram.\n\nFull intelligence layer runs there — no limits for $ARTHOUSE holders.",
  },
];

function ScoreBubble({ data }: { data: NonNullable<ChatMessage["scoreData"]> }) {
  const p1 = (data.d1 / 25) * 100;
  const p2 = (data.d2 / 25) * 100;
  const p3 = (data.d3 / 30) * 100;
  const p4 = (data.d4 / 20) * 100;

  return (
    <div className="bubble ai">
      <div className="score-disp">
        <strong>{data.creator}</strong>
        <br /><br />
        <span style={{ fontSize: 9, letterSpacing: "0.1em", color: "#999", textTransform: "uppercase" }}>Creator Score</span>
        <br />
        <span style={{ fontFamily: "'Bebas Neue'", fontSize: 42, color: "var(--blue)", lineHeight: 1 }}>{data.score}</span>
        <span style={{ color: "#aaa", fontSize: 12 }}> / 100</span>
        <br /><br />
        {[
          { label: "Profile & Identity", val: `${data.d1}/25`, pct: p1 },
          { label: "Content Consistency", val: `${data.d2}/25`, pct: p2 },
          { label: "Currently Building ★", val: `${data.d3}/30`, pct: p3 },
          { label: "Early Traction", val: `${data.d4}/20`, pct: p4 },
        ].map(row => (
          <div key={row.label}>
            <div className="score-row"><span>{row.label}</span><span style={{ color: "var(--blue)" }}>{row.val}</span></div>
            <div style={{ height: 3, background: "#f0f0f0", marginBottom: 7 }}>
              <div style={{ width: `${row.pct}%`, height: 3, background: "var(--blue)" }}></div>
            </div>
          </div>
        ))}
        <div style={{ padding: "8px 14px", border: `2px solid ${data.cc}`, display: "inline-block", fontWeight: 700, color: data.cc, letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
          {data.cls}
        </div>
        <br /><br />
        <span style={{ color: "#888", fontSize: 12 }}>{data.note}</span>
      </div>
    </div>
  );
}

function ChatWindow() {
  const [messages, setMessages] = useState<(ChatMessage & { id: number })[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [showRedir, setShowRedir] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const addMsg = useCallback((msg: ChatMessage) => {
    const id = idRef.current++;
    setMessages(prev => [...prev, { ...msg, id }]);
    return id;
  }, []);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const greet: ChatMessage = { type: "sys", content: "◆ Arthousexbt online — onchain art intelligence active." };
    addMsg(greet);
  }, [addMsg]);

  const runFlow = useCallback(async (query: string, flow: ChatMessage[]) => {
    if (busy) return;
    setBusy(true);
    const newCount = msgCount + 1;
    setMsgCount(newCount);

    addMsg({ type: "usr", content: query });

    for (const step of flow) {
      await new Promise(r => setTimeout(r, 600));
      if (step.type === "score" && step.scoreData) {
        addMsg(step);
      } else if (step.type === "sys") {
        addMsg(step);
        await new Promise(r => setTimeout(r, 900));
      } else {
        addMsg(step);
      }
    }

    setBusy(false);
    if (newCount >= 2) setShowRedir(true);
  }, [busy, msgCount, addMsg]);

  const doSend = useCallback(() => {
    const q = inputVal.trim();
    if (!q || busy) return;
    setInputVal("");
    const flow = FLOWS[q.toLowerCase()] || FALLBACK_FLOW;
    runFlow(q, flow);
  }, [inputVal, busy, runFlow]);

  const doChip = useCallback((q: string) => {
    if (busy) return;
    const flow = FLOWS[q.toLowerCase()] || FALLBACK_FLOW;
    runFlow(q, flow);
  }, [busy, runFlow]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setMsgCount(0);
    setShowRedir(false);
    setBusy(false);
    idRef.current = 0;
    setTimeout(() => {
      addMsg({ type: "sys", content: "◆ Arthousexbt online — onchain art intelligence active." });
    }, 50);
  }, [addMsg]);

  return (
    <div className="chat-win">
      <div className="chat-hdr">
        <div className="chat-avatar">🎨</div>
        <div className="chat-name">Arthousexbt</div>
        <div className="chat-dot"></div>
        <span className="chat-online">Online</span>
        <button className="chat-reset" onClick={resetChat}>↺ Reset</button>
      </div>
      <div className="chat-msgs" ref={msgsRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`msg${msg.type === "usr" ? " usr" : ""}`}>
            {msg.type === "score" && msg.scoreData ? (
              <ScoreBubble data={msg.scoreData} />
            ) : msg.type === "sys" ? (
              <div className="bubble sys">{msg.content}</div>
            ) : msg.type === "usr" ? (
              <div className="bubble usr">{msg.content}</div>
            ) : (
              <div className="bubble ai">{(msg.content || "").split("\n").map((line, i) => (
                <span key={i}>{line}{i < (msg.content || "").split("\n").length - 1 && <br />}</span>
              ))}</div>
            )}
          </div>
        ))}
        {busy && (
          <div className="msg">
            <div className="bubble ai">
              <div className="typi">
                <div className="tdot"></div>
                <div className="tdot"></div>
                <div className="tdot"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="chips">
        {["analyze @liquidcreator", "who is building this week?", "is this creator legit?", "builder vs flipper?"].map(chip => (
          <button key={chip} className="chip" onClick={() => doChip(chip)}>{chip}</button>
        ))}
      </div>
      <div className="chat-inp-wrap">
        <input
          className="chat-inp"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSend()}
          placeholder="Ask about any creator..."
        />
        <button className="chat-send" onClick={doSend}>SEND</button>
      </div>
      <div className={`chat-redir${showRedir ? " show" : ""}`}>
        <span className="redir-txt">◆ &nbsp; Continue full conversation on Telegram</span>
        <a href="https://t.me/arthousexbt_bot" target="_blank" rel="noopener noreferrer" className="redir-btn">Open @arthousexbt ↗</a>
      </div>
    </div>
  );
}

function DroidSVG() {
  return (
    <svg className="droid" id="droidSvg" width="520" height="693" viewBox="0 0 260 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ARTHOUSEXBT droid character">
      <ellipse cx="130" cy="354" rx="64" ry="7" fill="#66C800" opacity=".08"/>
      <g id="droidLegs">
        <rect x="88" y="290" width="28" height="52" rx="2" fill="#1a1a1a" stroke="#333" strokeWidth="1.5"/>
        <rect x="144" y="290" width="28" height="52" rx="2" fill="#1a1a1a" stroke="#333" strokeWidth="1.5"/>
        <rect x="81" y="335" width="42" height="15" rx="2" fill="#111" stroke="#444" strokeWidth="1.5"/>
        <rect x="137" y="335" width="42" height="15" rx="2" fill="#111" stroke="#444" strokeWidth="1.5"/>
        <line x1="102" y1="298" x2="102" y2="332" stroke="#66C800" strokeWidth="1.5" opacity=".5"/>
        <line x1="158" y1="298" x2="158" y2="332" stroke="#66C800" strokeWidth="1.5" opacity=".5"/>
        <rect x="83" y="346" width="8" height="3" rx="1" fill="#0000ff" opacity=".7"/>
        <rect x="139" y="346" width="8" height="3" rx="1" fill="#0000ff" opacity=".7"/>
      </g>
      <g id="droidBody">
        <rect x="58" y="176" width="144" height="120" rx="5" fill="#111" stroke="#2a2a2a" strokeWidth="2"/>
        <rect x="70" y="188" width="120" height="96" rx="3" fill="#0d0d0d" stroke="#1e1e1e" strokeWidth="1"/>
        <circle className="d-chest-light" cx="100" cy="220" r="8" fill="#0000ff" opacity=".9"/>
        <circle cx="100" cy="220" r="4.5" fill="#4466ff"/>
        <circle className="d-chest-light2" cx="130" cy="220" r="8" fill="#66C800" opacity=".9"/>
        <circle cx="130" cy="220" r="4.5" fill="#88ee22"/>
        <circle className="d-chest-light3" cx="160" cy="220" r="8" fill="#66C800" opacity=".9"/>
        <circle cx="160" cy="220" r="4.5" fill="#88ee44"/>
        <rect x="76" y="242" width="108" height="24" rx="2" fill="#080808" stroke="#2a2a2a" strokeWidth="1"/>
        <text x="130" y="258" fontFamily="monospace" fontSize="8.5" fill="#66C800" textAnchor="middle" letterSpacing="1.8">ARTHOUSEXBT</text>
        <clipPath id="bodyClip"><rect x="70" y="188" width="120" height="96" rx="3"/></clipPath>
        <rect className="d-scan-line" x="70" y="188" width="120" height="2" fill="#66C800" opacity=".5" clipPath="url(#bodyClip)"/>
        <rect x="60" y="200" width="8" height="3" rx="1" fill="#333"/>
        <rect x="60" y="207" width="8" height="3" rx="1" fill="#333"/>
        <rect x="60" y="214" width="8" height="3" rx="1" fill="#333"/>
        <rect x="192" y="200" width="8" height="3" rx="1" fill="#333"/>
        <rect x="192" y="207" width="8" height="3" rx="1" fill="#333"/>
        <rect x="192" y="214" width="8" height="3" rx="1" fill="#333"/>
      </g>
      <g id="armLeft">
        <rect x="20" y="184" width="37" height="84" rx="4" fill="#111" stroke="#2a2a2a" strokeWidth="1.5"/>
        <rect x="26" y="190" width="25" height="72" rx="3" fill="#0d0d0d"/>
        <rect x="16" y="260" width="45" height="20" rx="3" fill="#0f0f0f" stroke="#2a2a2a" strokeWidth="1.5"/>
        <line x1="33" y1="198" x2="33" y2="258" stroke="#0000ff" strokeWidth="1.5" opacity=".4"/>
        <circle cx="28" cy="272" r="2.5" fill="#0000ff" opacity=".6"/>
        <circle cx="38" cy="272" r="2.5" fill="#66C800" opacity=".6"/>
        <circle cx="48" cy="272" r="2.5" fill="#0000ff" opacity=".6"/>
      </g>
      <g id="armRight">
        <rect x="203" y="184" width="37" height="84" rx="4" fill="#111" stroke="#2a2a2a" strokeWidth="1.5"/>
        <rect x="209" y="190" width="25" height="72" rx="3" fill="#0d0d0d"/>
        <rect x="199" y="260" width="45" height="20" rx="3" fill="#0f0f0f" stroke="#2a2a2a" strokeWidth="1.5"/>
        <line x1="227" y1="198" x2="227" y2="258" stroke="#0000ff" strokeWidth="1.5" opacity=".4"/>
        <circle cx="212" cy="272" r="2.5" fill="#66C800" opacity=".6"/>
        <circle cx="222" cy="272" r="2.5" fill="#66C800" opacity=".6"/>
        <circle cx="232" cy="272" r="2.5" fill="#0000ff" opacity=".6"/>
      </g>
      <rect x="110" y="158" width="40" height="22" rx="2" fill="#0d0d0d" stroke="#222" strokeWidth="1.5"/>
      <line x1="118" y1="163" x2="118" y2="176" stroke="#333" strokeWidth="1"/>
      <line x1="130" y1="160" x2="130" y2="176" stroke="#444" strokeWidth="1"/>
      <line x1="142" y1="163" x2="142" y2="176" stroke="#333" strokeWidth="1"/>
      <g id="droidHead">
        <rect x="52" y="66" width="156" height="96" rx="7" fill="#111" stroke="#2a2a2a" strokeWidth="2"/>
        <rect x="61" y="74" width="138" height="80" rx="4" fill="#0d0d0d" stroke="#1a1a1a" strokeWidth="1"/>
        <rect x="70" y="84" width="50" height="40" rx="4" fill="#080808" stroke="#0000ff" strokeWidth="2"/>
        <rect x="74" y="88" width="42" height="32" rx="2" fill="#030310"/>
        <g id="eyeballL">
          <circle cx="95" cy="104" r="11" fill="#0000ff" opacity=".95"/>
          <circle cx="95" cy="104" r="6.5" fill="#3355ff"/>
          <circle cx="95" cy="104" r="3.5" fill="white" opacity=".95"/>
          <circle cx="97" cy="102" r="1.8" fill="white"/>
        </g>
        <rect x="140" y="84" width="50" height="40" rx="4" fill="#080808" stroke="#0000ff" strokeWidth="2"/>
        <rect x="144" y="88" width="42" height="32" rx="2" fill="#030310"/>
        <g id="eyeballR">
          <circle cx="165" cy="104" r="11" fill="#0000ff" opacity=".95"/>
          <circle cx="165" cy="104" r="6.5" fill="#3355ff"/>
          <circle cx="165" cy="104" r="3.5" fill="white" opacity=".95"/>
          <circle cx="167" cy="102" r="1.8" fill="white"/>
        </g>
        <rect x="76" y="134" width="108" height="12" rx="2" fill="#080808" stroke="#222" strokeWidth="1"/>
        <rect x="78" y="136" width="64" height="8" rx="1" fill="#66C800" opacity=".85"/>
        <rect x="144" y="136" width="12" height="8" rx="1" fill="#0000ff" opacity=".5"/>
        <rect x="158" y="136" width="24" height="8" rx="1" fill="#111"/>
        <circle cx="68" cy="74" r="3.5" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="192" cy="74" r="3.5" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="68" cy="158" r="3.5" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="192" cy="158" r="3.5" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <line x1="61" y1="152" x2="199" y2="152" stroke="#66C800" strokeWidth="1" opacity=".2"/>
        <g className="d-antenna">
          <line x1="130" y1="66" x2="130" y2="34" stroke="#222" strokeWidth="3"/>
          <rect x="115" y="24" width="30" height="14" rx="2" fill="#111" stroke="#222" strokeWidth="1.5"/>
          <circle className="d-antenna-dot" cx="130" cy="18" r="10" fill="#0000ff" stroke="#222" strokeWidth="2"/>
          <circle cx="130" cy="18" r="5.5" fill="#3355ff"/>
          <circle cx="130" cy="18" r="2.5" fill="white" opacity=".9"/>
        </g>
      </g>
    </svg>
  );
}

function TokenSection() {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [tokenData, setTokenData] = useState<{
    price: string;
    change: number;
    vol: string;
    mcap: string;
    liq: string;
    txns: string;
    refreshTime: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const CONTRACT = "0xd3216582e3e31578e01b7fd8eda6de969f3658ce";

  const fmt = (n: number | undefined | null): string => {
    if (!n || isNaN(n)) return "—";
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    return "$" + n.toFixed(2);
  };

  const fetchToken = useCallback(async () => {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`,
        { signal: ctrl.signal }
      );
      clearTimeout(tid);
      if (!res.ok) throw new Error("http " + res.status);
      const d = await res.json();
      const p = d.pairs && d.pairs[0];
      if (!p) throw new Error("no pair");
      const pr = parseFloat(p.priceUsd);
      const price =
        pr < 0.000001
          ? "$" + pr.toExponential(2)
          : pr < 0.0001
          ? "$" + pr.toFixed(8)
          : pr < 0.01
          ? "$" + pr.toFixed(6)
          : "$" + pr.toFixed(4);
      const chg = p.priceChange?.h24 || 0;
      const tx = p.txns?.h24;
      setTokenData({
        price,
        change: parseFloat(chg.toFixed(2)),
        vol: fmt(p.volume?.h24),
        mcap: fmt(p.marketCap),
        liq: fmt(p.liquidity?.usd),
        txns: tx ? (tx.buys + tx.sells).toLocaleString() : "\u2014",
        refreshTime: "Updated " + new Date().toLocaleTimeString(),
      });
      setLoading(false);
      setFailed(false);
    } catch {
      setLoading(false);
      setFailed(prev => prev || true);
    }
  }, []);

  useEffect(() => {
    fetchToken();
    const interval = setInterval(fetchToken, 30000);
    return () => clearInterval(interval);
  }, [fetchToken]);

  const copyAddr = () => {
    navigator.clipboard.writeText(CONTRACT).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="token-section" id="token">
      <div style={{ maxWidth: "100%", padding: "0 clamp(16px, 4vw, 48px)" }}>
        <div className="token-inner">
          <div className="token-left rev-l">
            <div className="token-label">$ARTHOUSE Token · Base Network</div>
            <div className="token-name">$ARTHOUSE</div>
            <div className="token-addr" onClick={copyAddr} title="Click to copy" style={copied ? { color: "var(--green)" } : {}}>
              {copied ? "✓ Copied!" : CONTRACT}
            </div>
            {loading && <div className="token-loading">Fetching live price...</div>}
            {!loading && tokenData && (
              <div>
                <div className="token-price-big">{tokenData.price}</div>
                <div className={`token-change ${tokenData.change >= 0 ? "pos" : "neg"}`}>
                  {tokenData.change >= 0 ? "+" : ""}{tokenData.change}% (24h)
                </div>
                <div className="token-stats-grid" style={{ marginTop: 20 }}>
                  <div className="token-stat"><div className="token-stat-val">{tokenData.vol}</div><div className="token-stat-lbl">Volume 24h</div></div>
                  <div className="token-stat"><div className="token-stat-val">{tokenData.mcap}</div><div className="token-stat-lbl">Market Cap</div></div>
                  <div className="token-stat"><div className="token-stat-val">{tokenData.liq}</div><div className="token-stat-lbl">Liquidity</div></div>
                  <div className="token-stat"><div className="token-stat-val">{tokenData.txns}</div><div className="token-stat-lbl">Txns 24h</div></div>
                </div>
                <div className="token-refresh">{tokenData.refreshTime}</div>
              </div>
            )}
            {!loading && failed && (
              <div className="token-fallback">
                Live data unavailable in this environment.<br />
                View real-time chart → <a href={`https://dexscreener.com/base/${CONTRACT}`} target="_blank" rel="noopener noreferrer">DexScreener ↗</a>
              </div>
            )}
            <a href={`https://dexscreener.com/base/${CONTRACT}`} target="_blank" rel="noopener noreferrer" className="token-cta">View Full Chart ↗</a>
          </div>
          <div className="token-right rev-r">
            <div className="token-label">Why Hold $ARTHOUSE</div>
            <p className="token-desc">The token is not speculation. It's access. Holders unlock the full intelligence layer — deeper analysis, early alerts, unlimited creator scoring.</p>
            <ul className="token-benefits">
              <li><span>Full 5-dimension creator scoring reports</span></li>
              <li><span>Unlimited @arthousexbt analysis</span></li>
              <li><span>Early alerts — high-scoring creators before they trend</span></li>
              <li><span>Weekly top builders report on Zora</span></li>
              <li><span>Access to curated watchlists</span></li>
              <li><span>Early access to new features</span></li>
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <a href="https://zora.co/arthousebase" target="_blank" rel="noopener noreferrer" className="token-cta" style={{ marginTop: 0 }}>Explore on Zora ↗</a>
              <a href="https://t.me/arthousexbt_bot" target="_blank" rel="noopener noreferrer" className="token-cta" style={{ marginTop: 0, borderLeft: "none" }}>Get Full Access ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  const creators = [
    {
      rank: "◆ TOP BUILDER · WEEK 14",
      avatar: "🎨",
      handle: "@VOIDMAKER",
      chain: "Zora · Base · Farcaster",
      score: 91,
      badge: "BUILDER",
      badgeClass: "builder",
      bio: "Seven-part generative series exploring the void between digital permanence and human memory. Deep community engagement with consistent collector growth each drop.",
      dims: [{ label: "Profile & Identity", val: "24/25", pct: 96 }, { label: "Content Consistency", val: "23/25", pct: 92 }, { label: "Currently Building ★", val: "29/30", pct: 97 }, { label: "Early Traction", val: "15/20", pct: 75 }],
      link: "https://zora.co",
    },
    {
      rank: "◆ RISING SIGNAL · WEEK 14",
      avatar: "⚡",
      handle: "@ELECTRICCANVAS",
      chain: "Zora Coins · Farcaster",
      score: 78,
      badge: "WATCHLIST",
      badgeClass: "watchlist",
      bio: "Pioneering the intersection of Zora Coins and generative art. High Farcaster engagement, experimenting with new mint mechanics. Early-stage traction accelerating.",
      dims: [{ label: "Profile & Identity", val: "20/25", pct: 80 }, { label: "Content Consistency", val: "21/25", pct: 84 }, { label: "Currently Building ★", val: "24/30", pct: 80 }, { label: "Early Traction", val: "13/20", pct: 65 }],
      link: "https://zora.co",
    },
    {
      rank: "◆ CONSISTENT BUILDER · WEEK 14",
      avatar: "🌿",
      handle: "@QUIETFORM",
      chain: "Base · Zora",
      score: 85,
      badge: "BUILDER",
      badgeClass: "builder",
      bio: "Slow, deliberate, permanent. No hype cycles — just consistent release of thoughtful work. Strong organic collector base built over 18 months of continuous building.",
      dims: [{ label: "Profile & Identity", val: "22/25", pct: 88 }, { label: "Content Consistency", val: "24/25", pct: 96 }, { label: "Currently Building ★", val: "26/30", pct: 87 }, { label: "Early Traction", val: "13/20", pct: 65 }],
      link: "https://zora.co",
    },
  ];

  return (
    <section className="featured-section" id="featured">
      <div className="container">
        <div className="featured-inner">
          <div className="featured-header section-header reveal">
            <span className="section-num">02 —</span>
            <h2 className="section-title" style={{ color: "var(--white)" }}>FEATURED<br /><em style={{ WebkitTextStroke: "2px rgba(255,255,255,0.4)", color: "transparent" }}>BUILDERS</em></h2>
            <p className="section-desc" style={{ color: "#666", borderLeftColor: "var(--blue)" }}>This week's highest-scoring creators on Base and Zora. Updated weekly by @arthousexbt intelligence.</p>
          </div>

          <div className="featured-grid reveal d1">
            {creators.map((c, i) => (
              <a key={c.handle} href={c.link} target="_blank" rel="noopener noreferrer" className="creator-card">
                <span className="creator-rank">{c.rank}</span>
                <div className="creator-avatar">{c.avatar}</div>
                <span className="creator-handle">{c.handle}</span>
                <span className="creator-chain">{c.chain}</span>
                <span className="creator-score-num">{c.score}</span>
                <span className="creator-score-max">/ 100 creator score</span>
                <br /><br />
                {c.dims.map(d => (
                  <div key={d.label} className="creator-score-wrap">
                    <div className="creator-score-label"><span>{d.label}</span><span>{d.val}</span></div>
                    <div className="creator-score-bar"><div className="creator-score-fill" style={{ width: `${d.pct}%` }}></div></div>
                  </div>
                ))}
                <div className="creator-badge-wrap" style={{ margin: "16px 0" }}>
                  <span className={`creator-badge ${c.badgeClass}`}>{c.badge}</span>
                </div>
                <p className="creator-bio">{c.bio}</p>
                <div className="creator-arrow">◆ VIEW ON ZORA ↗</div>
              </a>
            ))}
          </div>

          <div className="featured-stats reveal d2">
            <div className="featured-stat">
              <div className="featured-stat-val">2,400+</div>
              <div className="featured-stat-label">Creators Analyzed</div>
            </div>
            <div className="featured-stat">
              <div className="featured-stat-val">91%</div>
              <div className="featured-stat-label">Accuracy Rate</div>
            </div>
            <div className="featured-stat">
              <div className="featured-stat-val">5</div>
              <div className="featured-stat-label">Score Dimensions</div>
            </div>
            <div className="featured-stat">
              <div className="featured-stat-val">Weekly</div>
              <div className="featured-stat-label">Intelligence Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState("◆ SCANNING...");
  const [showDialog, setShowDialog] = useState(false);
  const scanIdxRef = useRef(0);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const droidRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const eyeLRef = useRef<SVGGElement | null>(null);
  const eyeRRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const svg = document.getElementById("droidSvg") as SVGSVGElement | null;
    const head = document.getElementById("droidHead") as SVGGElement | null;
    const eyeL = document.getElementById("eyeballL") as SVGGElement | null;
    const eyeR = document.getElementById("eyeballR") as SVGGElement | null;
    if (!svg || !head || !eyeL || !eyeR) return;

    svgRef.current = svg;
    headRef.current = head;
    eyeLRef.current = eyeL;
    eyeRRef.current = eyeR;

    svg.style.opacity = "0";
    svg.style.transform = "translateY(40px) scale(.96)";
    const t = setTimeout(() => {
      svg.style.transition = "opacity .9s cubic-bezier(.25,.46,.45,.94), transform .9s cubic-bezier(.25,.46,.45,.94)";
      svg.style.opacity = "1";
      svg.style.transform = "translateY(0) scale(1)";
    }, 300);

    const EL = { cx: 95, cy: 104, lim: 5 };
    const ER = { cx: 165, cy: 104, lim: 5 };
    const HEAD_TILT = 6;

    const isMobile = () => window.innerWidth <= 768;

    const onMouseMove = (e: MouseEvent) => {
      if (isMobile() || !svg || !head || !eyeL || !eyeR) return;
      const rect = svg.getBoundingClientRect();
      const sx = 260 / rect.width;
      const sy = 360 / rect.height;
      const mx = (e.clientX - rect.left) * sx;
      const my = (e.clientY - rect.top) * sy;

      [{ el: eyeL, ...EL }, { el: eyeR, ...ER }].forEach(eye => {
        const dx = mx - eye.cx;
        const dy = my - eye.cy;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const tx = Math.max(-eye.lim, Math.min(eye.lim, (dx / d) * eye.lim));
        const ty = Math.max(-eye.lim, Math.min(eye.lim, (dy / d) * eye.lim));
        eye.el.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px)`;
      });

      const headRect = head.getBoundingClientRect();
      const hcx = headRect.left + headRect.width / 2;
      const hcy = headRect.top + headRect.height / 2;
      const hdx = (e.clientX - hcx) / (window.innerWidth / 2);
      const hdy = (e.clientY - hcy) / (window.innerHeight / 2);
      const rotY = Math.max(-HEAD_TILT, Math.min(HEAD_TILT, hdx * HEAD_TILT));
      const rotX = Math.max(-HEAD_TILT / 2, Math.min(HEAD_TILT / 2, hdy * (HEAD_TILT / 2)));
      head.style.transform = `rotateY(${rotY}deg) rotateX(${-rotX}deg)`;
    };

    let idleT = 0;
    let rafId: number;
    const idleTick = () => {
      if (isMobile() && eyeL && eyeR && head) {
        idleT += 0.018;
        const tx = Math.sin(idleT) * 3.5;
        const ty = Math.cos(idleT * 0.7) * 2;
        eyeL.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px)`;
        eyeR.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px)`;
        head.style.transform = `rotateY(${(Math.sin(idleT * 0.5) * 3).toFixed(2)}deg)`;
      }
      rafId = requestAnimationFrame(idleTick);
    };
    idleTick();

    const onScroll = () => {
      if (droidRef.current) {
        droidRef.current.style.transform = `translateY(${(window.scrollY * 0.12).toFixed(1)}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("v"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal,.rev-l,.rev-r").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const droidClick = useCallback(() => {
    if (scanning) return;
    setScanning(true);
    const msgs = SCAN_MESSAGES;
    setScanMsg(msgs[scanIdxRef.current % msgs.length]);
    scanIdxRef.current++;
    setShowDialog(true);
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(() => {
      setScanning(false);
      setShowDialog(false);
    }, 1800);
  }, [scanning]);

  const closeMenu = () => setMenuOpen(false);

  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <div className="cursor" id="cur" style={{ display: "none" }} />
      <div className="cursor-ring" id="ring" style={{ display: "none" }} />

      <nav className={navScrolled ? "scrolled" : ""}>
        <a href="#what" className="nav-logo">
          <span className="slash">// </span>
          <span className="wordmark">ARTHOUSE</span>
        </a>
        <div className="nav-links">
          <a href="#does">What It Does</a>
          <a href="#featured">Featured</a>
          <a href="#token">Token</a>
          <a href="#bot">Arthousexbt</a>
          <a href="#social">Social</a>
          <a href="https://t.me/arthousexbt_bot" target="_blank" rel="noopener noreferrer" className="nav-cta">Open Bot ↗</a>
        </div>
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mob-menu${menuOpen ? " open" : ""}`}>
        <span className="menu-section-label">Navigate</span>
        <a href="#what" onClick={closeMenu}>Home <span className="menu-arrow">↗</span></a>
        <a href="#token" onClick={closeMenu}>$Arthouse Token <span className="menu-arrow">↗</span></a>
        <div className="menu-divider"></div>
        <span className="menu-section-label">Explore</span>
        <a href="#does" onClick={closeMenu}>What It Does <span className="menu-arrow">↗</span></a>
        <a href="#featured" onClick={closeMenu}>Featured Builders <span className="menu-arrow">↗</span></a>
        <a href="#bot" onClick={closeMenu}>Meet Arthousexbt <span className="menu-arrow">↗</span></a>
        <a href="#start" onClick={closeMenu}>Get Started <span className="menu-arrow">↗</span></a>
        <div className="menu-divider"></div>
        <a href="https://t.me/arthousexbt_bot" target="_blank" rel="noopener noreferrer" className="mob-cta" onClick={closeMenu}>Open Bot on Telegram ↗</a>
        <div className="menu-socials">
          <a href="https://x.com/arthousebase" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>𝕏 Twitter</a>
          <a href="https://base.app/profile/arthouse" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>🔵 Base</a>
          <a href="https://www.instagram.com/arthousebase" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>📸 Instagram</a>
          <a href="https://www.tiktok.com/@arthousebase" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>▶ TikTok</a>
          <a href="https://dexscreener.com/base/0xd3216582e3e31578e01b7fd8eda6de969f3658ce" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>📈 DexScreener</a>
        </div>
      </div>

      <div className="ticker">
        <div className="ticker-track">
          {tickerItems.map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      <section className="hero" id="what">
        <div className="hero-bg-grid"></div>
        <div className="hero-geo">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <polygon className="geo-hex" points="120,60 160,38 200,60 200,104 160,126 120,104" fill="none" stroke="#0052FF" strokeWidth="1"/>
            <polygon className="geo-hex" points="980,120 1030,92 1080,120 1080,176 1030,204 980,176" fill="none" stroke="#66C800" strokeWidth="1" style={{ animationDelay: "-6s" }}/>
            <polygon className="geo-tri" points="400,80 440,150 360,150" fill="none" stroke="#0052FF" strokeWidth="1"/>
            <polygon className="geo-tri" points="1100,700 1140,770 1060,770" fill="none" stroke="#66C800" strokeWidth=".8" style={{ animationDelay: "-9s" }}/>
            <rect className="geo-sq" x="600" y="60" width="48" height="48" fill="none" stroke="#66C800" strokeWidth="1" transform="rotate(45 624 84)"/>
            <circle className="geo-circ" cx="800" cy="150" r="80" fill="none" stroke="#0052FF" strokeWidth=".8"/>
            <circle className="geo-circ" cx="160" cy="750" r="60" fill="none" stroke="#66C800" strokeWidth=".8" style={{ animationDelay: "-12s" }}/>
            <line className="geo-line" x1="0" y1="280" x2="320" y2="280" stroke="#0052FF" strokeWidth=".5"/>
            <line className="geo-line" x1="1100" y1="400" x2="1440" y2="400" stroke="#66C800" strokeWidth=".5" style={{ animationDelay: "-8s" }}/>
          </svg>
        </div>
        <div className="hero-spotlight"></div>
        <div className="hero-floor"></div>
        <div className="hero-line-l"></div>
        <div className="hero-line-r"></div>

        <div className="hero-inner">
          <div className="hero-right">
            <div
              ref={droidRef}
              className={`droid-wrap${scanning ? " scanning" : ""}`}
              onClick={droidClick}
              onTouchStart={e => { e.preventDefault(); droidClick(); }}
              title="Click to interact"
            >
              <div className="droid-glow"></div>
              <div className={`droid-dialog${showDialog ? " show" : ""}`}>{scanMsg}</div>
              <div className="droid-particle" style={{ width: 5, height: 5, left: 80, top: 260, background: "#66C800", "--dur": "3.8s", "--del": "0s", "--tx": "40px", "--ty": "-90px" } as React.CSSProperties}></div>
              <div className="droid-particle" style={{ width: 3, height: 3, left: 320, top: 280, background: "#0000ff", "--dur": "4.5s", "--del": ".9s", "--tx": "-30px", "--ty": "-100px" } as React.CSSProperties}></div>
              <div className="droid-particle" style={{ width: 4, height: 4, left: 200, top: 380, background: "#66C800", "--dur": "3.3s", "--del": "1.5s", "--tx": "20px", "--ty": "-80px" } as React.CSSProperties}></div>
              <DroidSVG />
              <div className="droid-nametag">◆ ARTHOUSEXBT ◆</div>
            </div>
          </div>

          <div className="hero-left">
            <div className="hero-label reveal">◆ Onchain Art Intelligence · Base + Zora</div>
            <h1 className="reveal d1"><span className="blue">ACTUALLY</span> <span className="stroke">BUILDING.</span></h1>
            <p className="hero-desc reveal d2">The intelligence layer for onchain art — separating builders from flippers on Base and Zora.</p>
            <div className="hero-btns reveal d3">
              <a href="https://t.me/arthousexbt_bot" target="_blank" rel="noopener noreferrer" className="btn-primary">Ask @arthousexbt ↗</a>
              <a href="#token" className="btn-secondary">View $ARTHOUSE →</a>
            </div>
          </div>
        </div>
      </section>

      <TokenSection />

      <section className="does-section" id="does">
        <div className="container">
          <div className="does-inner">
            <div className="section-header reveal">
              <span className="section-num">01 —</span>
              <h2 className="section-title">WHAT<br />ARTHOUSE <em>DOES</em></h2>
              <p className="section-desc">Intelligence tools for serious collectors and curators on Base and Zora.</p>
            </div>
            <div className="features-grid reveal d1">
              <div className="feature-card">
                <span className="feat-num">◆ 01</span>
                <div className="feat-icon">🔍</div>
                <h3 className="feat-title">Talent Scout</h3>
                <p className="feat-desc">Surface emerging creators before the crowd. Arthouse analyzes onchain activity, social signals, and content patterns to find builders — not flippers.</p>
              </div>
              <div className="feature-card">
                <span className="feat-num">◆ 02</span>
                <div className="feat-icon">⚡</div>
                <h3 className="feat-title">Creator Scoring</h3>
                <p className="feat-desc">A rigorous scoring system across identity, consistency, building signals, traction, and reputation. 0–100 points. No guessing. Just data.</p>
              </div>
              <div className="feature-card">
                <span className="feat-num">◆ 03</span>
                <div className="feat-icon">⛓️</div>
                <h3 className="feat-title">Onchain Forever</h3>
                <p className="feat-desc">Permanent preservation on Base and Zora. No platforms, no gatekeepers. Art and creator intelligence stored onchain, accessible forever.</p>
              </div>
            </div>

            <div className="how-strip reveal d2">
              <div className="how-step">
                <span className="how-num">01</span>
                <div className="how-text"><strong>Connect</strong><span>Open @arthousexbt_bot on Telegram — no wallet needed.</span></div>
              </div>
              <div className="how-step">
                <span className="how-num">02</span>
                <div className="how-text"><strong>Ask</strong><span>"Analyze @username" — scored across 5 dimensions instantly.</span></div>
              </div>
              <div className="how-step">
                <span className="how-num">03</span>
                <div className="how-text"><strong>Discover</strong><span>Get a clear classification: Builder, Watchlist, Skip — every time.</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedSection />

      <section className="bot-section" id="bot">
        <div style={{ maxWidth: "100%", padding: "0 clamp(16px, 4vw, 48px)" }}>
          <div className="bot-inner">
            <div className="bot-info rev-l">
              <div className="bot-label">AI Intelligence Agent</div>
              <h2 className="bot-title">MEET<br /><span>@ARTHOUSEXBT</span></h2>
              <p className="bot-text">Ask about any creator on Zora. Get a score, a classification, and a clear recommendation. Arthousexbt doesn't hype — it curates.</p>
              <ul className="bot-caps">
                <li><div className="cap-icon">📊</div><div className="cap-text"><strong>Analyze Any Creator</strong><span>"analyze @username" — get full scoring breakdown</span></div></li>
                <li><div className="cap-icon">🎯</div><div className="cap-text"><strong>Detect Red Flags</strong><span>"is this legit?" — runs red flag checklist instantly</span></div></li>
                <li><div className="cap-icon">🏆</div><div className="cap-text"><strong>Find Top Builders</strong><span>"who's building this week?" — top 3 with reasoning</span></div></li>
                <li><div className="cap-icon">💎</div><div className="cap-text"><strong>Collection Intelligence</strong><span>Context on drops, coins, and cultural movements</span></div></li>
              </ul>
              <a href="https://t.me/arthousexbt_bot" target="_blank" rel="noopener noreferrer" className="btn-primary">Open Full Bot on Telegram ↗</a>
            </div>
            <div className="bot-demo rev-r">
              <ChatWindow />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="start">
        <div className="container">
          <div className="cta-inner">
            <div className="deco-corner tl" style={{ top: 40, left: 48 }}></div>
            <div className="deco-corner tr" style={{ top: 40, right: 48 }}></div>
            <div className="deco-corner bl" style={{ bottom: 40, left: 48 }}></div>
            <div className="deco-corner br" style={{ bottom: 40, right: 48 }}></div>
            <div className="cta-deco reveal">ARTHOUSE · ONCHAIN FOREVER</div>
            <h2 className="cta-title reveal d1">START<br /><span>NOW.</span><br /><em>EXPLORE.</em></h2>
            <p className="cta-desc reveal d2">Join the onchain art intelligence layer. Ask @arthousexbt anything. Find creators worth following before everyone else does.</p>
            <div className="cta-btns reveal d3">
              <a href="https://t.me/arthousexbt_bot" target="_blank" rel="noopener noreferrer" className="cta-main">Open @arthousexbt on Telegram ↗</a>
              <a href="https://zora.co/arthousebase" target="_blank" rel="noopener noreferrer" className="cta-ghost">Explore on Zora →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="social-section" id="social">
        <div className="container">
          <div className="social-inner">
            <div className="social-header reveal">
              <div style={{ flex: 1, minWidth: 200 }}>
                <div className="social-label">Official Channels</div>
                <h2 className="social-title">FOLLOW<br /><em>ARTHOUSE</em></h2>
              </div>
              <p className="social-desc">Stay connected across all official Arthouse channels. Updates, drops, and intelligence — live.</p>
            </div>
            <div className="social-grid">
              {[
                { href: "https://x.com/arthousebase", icon: "𝕏", platform: "X (TWITTER)", handle: "@arthousebase", num: "01", delay: "d1" },
                { href: "https://base.app/profile/arthouse", icon: "🔵", platform: "BASE APP", handle: "@arthouse", num: "02", delay: "d2" },
                { href: "https://www.instagram.com/arthousebase", icon: "📸", platform: "INSTAGRAM", handle: "@arthousebase", num: "03", delay: "d3" },
                { href: "https://www.tiktok.com/@arthousebase", icon: "▶", platform: "TIKTOK", handle: "@arthousebase", num: "04", delay: "d4" },
              ].map(s => (
                <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer" className={`social-card reveal ${s.delay}`}>
                  <div className="sc-green-bar"></div>
                  <div className="sc-top">
                    <div className="sc-icon-wrap">{s.icon}</div>
                    <span className="sc-num">{s.num}</span>
                  </div>
                  <span className="sc-platform">{s.platform}</span>
                  <span className="sc-handle">{s.handle}</span>
                  <div className="sc-arrow">FOLLOW ↗</div>
                </a>
              ))}
            </div>
            <div style={{ marginTop: 40, height: 1, background: "linear-gradient(to right, var(--green), transparent)", opacity: 0.4 }}></div>
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-grid">
          <div className="foot-col">
            <div className="foot-brand">ART<span>HOUSE</span></div>
            <p className="foot-tag">The intelligence layer for onchain art. Preserving creativity on Base and Zora. Talent scout, not trading bot.</p>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--green)", letterSpacing: "0.1em" }}>◆ &nbsp; ONCHAIN FOREVER</div>
          </div>
          <div className="foot-col">
            <h4>Platform</h4>
            <a href="https://zora.co/arthousebase" target="_blank" rel="noopener noreferrer">Zora</a>
            <a href="https://www.base.org" target="_blank" rel="noopener noreferrer">Base</a>
            <a href="https://t.me/arthousexbt_bot" target="_blank" rel="noopener noreferrer">Telegram Bot</a>
            <a href="https://dexscreener.com/base/0xd3216582e3e31578e01b7fd8eda6de969f3658ce" target="_blank" rel="noopener noreferrer">DexScreener</a>
          </div>
          <div className="foot-col">
            <h4>Features</h4>
            <a href="#does">What It Does</a>
            <a href="#featured">Featured Builders</a>
            <a href="#bot">Meet Arthousexbt</a>
            <a href="#start">Get Started</a>
            <a href="#social">Social Channels</a>
          </div>
          <div className="foot-col">
            <h4>Connect</h4>
            <a href="https://x.com/arthousebase" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href="https://base.app/profile/arthouse" target="_blank" rel="noopener noreferrer">Base App</a>
            <a href="https://www.instagram.com/arthousebase" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@arthousebase" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
        <div className="foot-bot">
          <div className="foot-copy">© 2026 Arthouse. All rights reserved.</div>
          <div className="foot-ever">Onchain Forever</div>
        </div>
      </footer>
    </>
  );
}
