import React from "react";
import { Button } from ".";
import { useWalletConnect } from "@provenanceio/walletconnect-js";
import { NameContractService } from "../services";
import { ROOT_NAME } from "./../consts";

const SignMessage = () => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { address, connected, peer } = walletConnectState;
  const nameContractService = new NameContractService(ROOT_NAME);

  const registerName = async (name = "desai") => {
    return wcs
      .sendMessage({
        message: await nameContractService.generateNameRegisterBase64Message(
          name,
          address
        ),
        description: `Register ${name} to ${address}`,
        method: "provenance_sendTransaction",
      })
      .then((result) => {
        console.log("result", result);
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  return <Button onClick={registerName}>Register Name</Button>;
};

export default SignMessage;
