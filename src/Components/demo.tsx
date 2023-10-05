"use client";
import React from "react";
import { WalletConnectContextProvider } from "@provenanceio/walletconnect-js";
import { WalletContextProvider } from "@provenanceio/wallet-lib";
import { GRPC_URL, NETWORK, WALLET_URL } from "../consts";

const Demo = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <WalletConnectContextProvider network={NETWORK}>
        <WalletContextProvider
          grpcServiceAddress={GRPC_URL}
          walletUrl={WALLET_URL}
        >
          {children as any}
        </WalletContextProvider>
      </WalletConnectContextProvider>
    </>
  );
};

export default Demo;
