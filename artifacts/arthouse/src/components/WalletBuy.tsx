import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { base } from "wagmi/chains";

const CONTRACT = "0xd3216582e3e31578e01b7fd8eda6de969f3658ce";
const UNISWAP_URL = `https://app.uniswap.org/swap?outputCurrency=${CONTRACT}&chain=base`;
const DEXSCREENER_URL = `https://dexscreener.com/base/${CONTRACT}`;

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function WalletBuyButton() {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const wrongChain = isConnected && chain?.id !== base.id;

  if (!isConnected) {
    return (
      <button className="wallet-buy-btn" onClick={openConnectModal}>
        <span className="wallet-buy-icon">◈</span>
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="wallet-connected-wrap">
      <div className="wallet-addr-row">
        <span className="wallet-dot"></span>
        <span className="wallet-addr">{shortAddr(address!)}</span>
        {wrongChain && <span className="wallet-wrong-chain">Wrong Network</span>}
        <button className="wallet-disconnect" onClick={() => disconnect()}>✕</button>
      </div>
      <div className="wallet-buy-row">
        <a
          href={UNISWAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="wallet-swap-btn"
        >
          Buy $ARTHOUSE on Uniswap ↗
        </a>
        <a
          href={DEXSCREENER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="wallet-chart-btn"
        >
          Chart ↗
        </a>
      </div>
    </div>
  );
}

export function HeroWalletBuy() {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <button className="btn-wallet-hero" onClick={openConnectModal}>
        <span>◈</span> Connect &amp; Buy $ARTHOUSE
      </button>
    );
  }

  return (
    <div className="hero-wallet-connected">
      <div className="hero-wallet-addr">
        <span className="wallet-dot"></span>
        {shortAddr(address!)}
        <button className="wallet-disconnect-sm" onClick={() => disconnect()}>✕</button>
      </div>
      <a
        href={UNISWAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-wallet-swap"
      >
        Buy $ARTHOUSE on Uniswap ↗
      </a>
    </div>
  );
}
