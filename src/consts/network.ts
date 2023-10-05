export const NETWORK = process.env.NEXT_PUBLIC_NETWORK as "mainnet" | "testnet";
export const PRODUCTION = NETWORK == "mainnet";
export const EXPLORER_URL = PRODUCTION
  ? "https://explorer.provenance.io"
  : "https://explorer.test.provenance.io";
export const GRPC_URL: any = PRODUCTION
  ? "https://wallet.provenance.io/proxy"
  : "https://wallet.test.provenance.io/proxy";
// export const GRPC_URL = 'http://localhost:8080'

export const ROOT_NAME = "wallettest3.pb";
export const FEE_DENOM = "nhash";

export const WALLET_URL = PRODUCTION
  ? "wss://www.figure.tech/service-wallet-connect-bridge/ws/external"
  : "wss://test.figure.tech/service-wallet-connect-bridge/ws/external";
// export const WALLET_URL = PRODUCTION
//   ? "https://wallet.provenance.io"
//   : "https://wallet.test.provenance.io";
