"use client";
import { useState, useEffect } from "react";
import {
  QRCodeModal,
  useWalletConnect,
  WINDOW_MESSAGES,
} from "@provenanceio/walletconnect-js";
import styled from "styled-components";
import { Button, Connect, Disconnect, Popup } from "../Components";
import { ROOT_NAME } from "../consts";
import { REACT_APP_WCJS_VERSION } from "../version"; // eslint-disable-line
import { useWallet } from "@provenanceio/wallet-lib";
import { TEXT_ACCENT, PRIMARY_BACKGROUND, TEXT } from "../consts/colors";
import { Header, SubHeader } from "../Components/Headers";
import { RegisterName } from "../Components/RegisterName";
import { NameContractService } from "../services";
import { ConversionUtil } from "../util/ConversionUtil";
import { TabContainer } from "../Components/Tabs";
import { NameLookup } from "../Components/NameLookup";
import { Name, NameList } from "../Components/NameList";
import { NameSearch } from "../Components/NameSearch";
import AddressLink from "../Components/AddressLink";
import { BigParagraph } from "../Components/Display";

const Wrapper = styled.div`
  background: ${PRIMARY_BACKGROUND};

  a {
    color: ${TEXT_ACCENT};
    &:hover {
      color: ${TEXT};
    }
  }
`;
const HomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  max-width: 100%;
  min-height: 100vh;
  position: relative;
`;
const Content = styled.div`
  min-width: 600px;
  padding: 30px 50px;
  border-radius: 4px;
  margin-bottom: 40px;
`;

const WalletProvider = () => {
  const [popupContent, setPopupContent] = useState("");
  const [popupStatus, setPopupStatus] = useState("success");
  const [popupDuration, setPopupDuration] = useState(2500);
  const [hashAmount, setHashAmount] = useState(null);
  const [listenersAdded, setListenersAdded] = useState(false);

  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { address, connected, peer } = walletConnectState;

  const setPopup = (message: any, status: any, duration: any) => {
    setPopupContent(message);
    if (status) {
      setPopupStatus(status);
    }
    if (duration) {
      setPopupDuration(duration);
    }
  };
  const nameContractService = new NameContractService(ROOT_NAME);
  const [registeredNames, setRegisteredNames] = useState([]);

  const fetchNames = () => {
    if (address) {
      nameContractService
        .listNames(address)
        .then((names: any) => setRegisteredNames(names));
    } else {
      setRegisteredNames([]);
    }
  };

  useEffect(() => {
    fetchNames();
  }, [address]);

  const { grpcService } = useWallet();

  const fetchBalance = () => {
    if (address) {
      grpcService.getBalancesList(address).then((balances) => {
        let hashAmount: any = ConversionUtil.getHashBalance(balances);
        if (hashAmount) {
          setHashAmount(hashAmount);
        }
      });
    } else {
      setHashAmount(null);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address]);

  useEffect(() => {
    console.log("Adding event listeners");
    const actionCompleteListener = (result: any) => {
      console.log(
        `WalletConnectJS | Custom Action Complete | Result: `,
        result
      );
      fetchNames();
      fetchBalance();
    };
    wcs.addListener(
      WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE,
      actionCompleteListener
    );

    const actionFailedListener = (result: any) => {
      const { error } = result;
      console.log(
        `WalletConnectJS | Custom Action Failed | result, error: `,
        result,
        error
      );
    };
    wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_FAILED, actionFailedListener);
    return () => {
      wcs.removeListener(
        WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE,
        actionCompleteListener
      );
      wcs.removeListener(
        WINDOW_MESSAGES.CUSTOM_ACTION_FAILED,
        actionFailedListener
      );
    };
  }, [wcs]);

  // const handleConnect = async (walletAppId: any) => {
  //   console.log("connecting");
  // };
  return (
    <>
      <Wrapper>
        <HomeContainer>
          {popupContent && (
            <Popup
              delay={popupDuration}
              onClose={() => setPopupContent("")}
              status={popupStatus}
            >
              {popupContent}
            </Popup>
          )}
          <Header>Policy Ledger</Header>
          <Content>
            {connected ? (
              <>
                <TabContainer
                  tabs={[
                    {
                      title: "Your Names",
                      element: (
                        <>
                          {peer?.name && (
                            <BigParagraph>
                              Wallet:{" "}
                              {peer.url ? (
                                <a
                                  href={peer.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {peer.name}
                                </a>
                              ) : (
                                peer.name
                              )}
                            </BigParagraph>
                          )}
                          <AddressLink address={address} />
                          {hashAmount && (
                            <BigParagraph>
                              Hash Balance: {hashAmount}
                            </BigParagraph>
                          )}
                          <SubHeader>Your registered names</SubHeader>
                          <NameList>
                            {registeredNames.map((name) => (
                              <Name key={name}>{name}</Name>
                            ))}
                          </NameList>
                          <RegisterName
                            onRegister={async (name) => {
                              return wcs.customAction({
                                message:
                                  await nameContractService.generateNameRegisterBase64Message(
                                    name,
                                    address
                                  ),
                                description: `Register ${name} to ${address}`,
                                method: "provenance_sendTransaction",
                              });
                            }}
                          />
                        </>
                      ),
                    },
                    {
                      title: "Name Lookup",
                      element: <NameLookup />,
                    },
                    {
                      title: "Name Search",
                      element: <NameSearch />,
                    },
                  ]}
                />
                <Disconnect walletConnectService={wcs} setPopup={setPopup} />
              </>
            ) : (
              <>
                {/* <Button
                  width="20%"
                  onClick={() => handleConnect("figure_extension")}
                >
                  Figure Connect
                </Button> */}
                <Connect walletConnectService={wcs} setPopup={setPopup} />
              </>
            )}
          </Content>
          <QRCodeModal
            walletConnectService={wcs}
            // walletConnectState={walletConnectState}
            title="Scan to initiate walletConnect-js session"
          />
          <div>
            WalletConnect-JS Version: {REACT_APP_WCJS_VERSION || "??.??.??"}
          </div>
        </HomeContainer>
      </Wrapper>
    </>
  );
};

export default WalletProvider;
