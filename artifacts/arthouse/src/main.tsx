import { createRoot } from "react-dom/client";
import { Web3Provider } from "@/lib/web3";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Web3Provider>
    <App />
  </Web3Provider>
);
