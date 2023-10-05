"use client";
import { GRPC_URL, NETWORK, WALLET_URL } from "../consts";
// import { WalletConnectContextProvider } from "@provenanceio/walletconnect-js";
// import { WalletContextProvider } from "@provenanceio/wallet-lib";

import WalletProvider from "../Components/wallet";
import dynamic from "next/dynamic";

const WalletContextProvider = dynamic(
  () =>
    import("@provenanceio/wallet-lib").then((mod) => mod.WalletContextProvider),
  {
    ssr: false,
  }
);
const WalletConnectContextProvider = dynamic(
  () =>
    import("@provenanceio/walletconnect-js").then(
      (mod) => mod.WalletConnectContextProvider
    ),
  {
    ssr: false,
  }
);

const Example = () => {
  return (
    <>
      <WalletConnectContextProvider network={NETWORK}>
        <WalletContextProvider
          grpcServiceAddress={GRPC_URL}
          walletUrl={WALLET_URL}
        >
          <WalletProvider />
        </WalletContextProvider>
      </WalletConnectContextProvider>
    </>
  );
};

export default Example;
