"use client";
import { WalletConnectContextProvider } from "@provenanceio/walletconnect-js";
import WalletProvider from "./wallet";
import { GRPC_URL, WALLET_URL } from "../consts";
import { WalletContextProvider } from "@provenanceio/wallet-lib";
import SignMessage from "./SignMessage";
// import dynamic from "next/dynamic";

// const WalletProvider = dynamic(() => import("./wallet"), {
//   ssr: false,
// });

// const WalletContextProvider = dynamic(
//   () =>
//     import("@provenanceio/wallet-lib").then((mod) => mod.WalletContextProvider),
//   {
//     ssr: false,
//   }
// );
// const WalletConnectContextProvider = dynamic(
//   () =>
//     import("@provenanceio/walletconnect-js").then(
//       (mod) => mod.WalletConnectContextProvider
//     ),
//   {
//     ssr: false,
//   }
// );

const Example = () => {
  return (
    <>
      <WalletConnectContextProvider>
        <WalletContextProvider
          grpcServiceAddress={GRPC_URL}
          walletUrl={WALLET_URL}
        >
          <>
            <WalletProvider />
            <SignMessage />
          </>
        </WalletContextProvider>
      </WalletConnectContextProvider>
    </>
  );
};

export default Example;
