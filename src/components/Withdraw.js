import React, { useEffect, useState } from "react";
import "../assets/style/deposit.scss";
import "../assets/style/withdraw.scss";
import { Form, Image, Spinner } from "react-bootstrap";
import { Dai, Usdt, Usdc, Ethereum, Btc } from "react-web3-icons";
import { MdOutlineSecurity } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import Web3 from "web3";
import toIcn from "../assets/images/logo.png";
import { useAccount, useConnect, useNetwork, useSwitchNetwork, useBalance } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { IoMdWallet } from "react-icons/io";
import { HiSwitchHorizontal } from "react-icons/hi";
import metamask from "../assets/images/metamask.svg";
import TabMenu from "./TabMenu";
function sleep(ms) {
  // add ms millisecond timeout before promise resolution
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const optimismSDK = require("@eth-optimism/sdk");
const MessageStatus = optimismSDK.MessageStatus;
const ethers = require("ethers");
const Withdraw = () => {
  const [ethValue, setEthValue] = useState("");
  const [sendToken, setSendToken] = useState("ETH");
  const [errorInput, setErrorInput] = useState("");
  const [checkMetaMask, setCheckMetaMask] = useState("");
  const [loader, setLoader] = useState(false);
  const [waitingForProve, setWaitingForProve] = useState(false);
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const { connect } = useConnect({
    connector: new InjectedConnector({ chains }),
    onError(error) {
      console.log("Error", error);
    },
    onMutate(args) {
      console.log("Mutate", args);
      if (args.connector.ready === true) {
        setCheckMetaMask(false);
      } else {
        setCheckMetaMask(true);
      }
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
    onSuccess(data) {
      console.log("Success", data);
    },
  });
  const [metaMastError, setMetaMaskError] = useState("");
  const { chain: chaida } = useNetwork();

  const { error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork({
    // throwForSwitchChainNotSupported: true,
    chainId: 90001,
    onError(error) {
      console.log("Error", error);
    },
    onMutate(args) {
      console.log("Mutate", args);
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
      try {
        window.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: process.env.REACT_APP_L2_CHAIN_ID_WITH_HEX,
                rpcUrls: [process.env.REACT_APP_L2_RPC_URL],
                chainName: process.env.REACT_APP_L2_NETWORK_NAME,
                nativeCurrency: {
                  name: "ETHEREUM",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: [process.env.REACT_APP_L2_EXPLORER_URL],
              },
            ],
          })
          .then((data) => {
            setMetaMaskError("");
          })
          .catch((err) => {
            if (err.code === -32002) {
              setMetaMaskError("Request stuck in pending state");
            }
          });
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess(data) {
      console.log("Success", data);
    },
  });
  //========================================================== BALANCES =======================================================================

  const { data } = useBalance({
    address: address,
    chainId: Number(process.env.REACT_APP_L2_CHAIN_ID),
    watch: true,
  });

  const dataUSDT = useBalance({
    address: address,
    chainId: Number(process.env.REACT_APP_L2_CHAIN_ID),
    token: process.env.REACT_APP_L2_USDT,
    watch: true,
  });
  const dataDAI = useBalance({
    address: address,
    chainId: Number(process.env.REACT_APP_L2_CHAIN_ID),
    token: process.env.REACT_APP_L2_DAI,
    watch: true,
  });
  const dataUSDC = useBalance({
    address: address,
    chainId: Number(process.env.REACT_APP_L2_CHAIN_ID),
    token: process.env.REACT_APP_L2_USDC,
    watch: true,
  });
  const datawBTC = useBalance({
    address: address,
    chainId: Number(process.env.REACT_APP_L2_CHAIN_ID),
    token: process.env.REACT_APP_L2_wBTC,
    watch: true,
  });

  ////========================================================== WITHDRAW =======================================================================
  const getCrossChainMessenger = () => {
    const l1Url = process.env.REACT_APP_L1_RPC_URL;
    const l2Url = process.env.REACT_APP_L2_RPC_URL;
    const l1Provider = new ethers.providers.JsonRpcProvider(l1Url, "any");
    const l2Provider = new ethers.providers.JsonRpcProvider(l2Url, "any");
    const l1Signer = l1Provider.getSigner(address);
    const l2Signer = l2Provider.getSigner(address);
    const zeroAddr = "0x".padEnd(42, "0");
    const l1Contracts = {
      StateCommitmentChain: zeroAddr,
      CanonicalTransactionChain: zeroAddr,
      BondManager: zeroAddr,
      AddressManager: process.env.REACT_APP_LIB_ADDRESSMANAGER,
      L1CrossDomainMessenger: process.env.REACT_APP_PROXY_OVM_L1CROSSDOMAINMESSENGER,
      L1StandardBridge: process.env.REACT_APP_PROXY_OVM_L1STANDARDBRIDGE,
      OptimismPortal: process.env.REACT_APP_OPTIMISM_PORTAL_PROXY,
      L2OutputOracle: process.env.REACT_APP_L2_OUTPUTORACLE_PROXY,
    };
    const bridges = {
      Standard: {
        l1Bridge: l1Contracts.L1StandardBridge,
        l2Bridge: "0x4200000000000000000000000000000000000010",
        Adapter: optimismSDK.StandardBridgeAdapter,
      },
      ETH: {
        l1Bridge: l1Contracts.L1StandardBridge,
        l2Bridge: "0x4200000000000000000000000000000000000010",
        Adapter: optimismSDK.ETHBridgeAdapter,
      },
    };
    return new optimismSDK.CrossChainMessenger({
      contracts: {
        l1: l1Contracts,
      },
      bridges: bridges,
      l1ChainId: Number(process.env.REACT_APP_L1_CHAIN_ID),
      l2ChainId: Number(process.env.REACT_APP_L2_CHAIN_ID),
      l1SignerOrProvider: l1Signer,
      l2SignerOrProvider: l2Signer,
      bedrock: true,
    });
  };
  const proveMessage = async () => {
    try {
      setLoader(true);
      await switchNetwork(process.env.REACT_APP_L1_CHAIN_ID);
      const l1Url = process.env.REACT_APP_L1_RPC_URL;
      const l2Url = process.env.REACT_APP_L2_RPC_URL;
      const l1Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const l2Provider = new ethers.providers.JsonRpcProvider(l2Url, "any");
      const l1Signer = l1Provider.getSigner(address);
      const l2Signer = l2Provider.getSigner(address);
      let ethWithdrawReceipt = JSON.parse(localStorage.getItem("rcp"));
      console.log({ Awe: ethWithdrawReceipt });
      ethWithdrawReceipt = await l2Provider.getTransactionReceipt(
        ethWithdrawReceipt.transactionHash
      );
      console.log({ ethWithdrawReceipt });

      const crossChainMessenger = getCrossChainMessenger();
      console.log({ ethWithdrawReceipt });
      const ethProve = await crossChainMessenger.proveMessage(ethWithdrawReceipt, {
        signer: l1Signer,
      });
      console.log(`Transaction hash: ${ethProve.hash}`);
      const ethProveReceipt = await ethProve.wait();
      // const ethProveReceipt = await l1Provider.getTransactionReceipt(
      //   "0xdbe7f9ab2226d4168ea365844d80da7df67b5d2747c2434b02e72dfb67a4c868"
      // );
      if (ethProveReceipt.status !== 1) {
        setLoader(false);
        throw new Error("Prove withdrawal transaction reverted");
      }
      console.log("Successfully proved withdrawal");

      console.log("Waiting to be able to finalize withdrawal");

      const finalizeInterval = setInterval(async () => {
        const currentStatus = await crossChainMessenger.getMessageStatus(ethWithdrawReceipt);
        console.log(`Message status: ${MessageStatus[currentStatus]}`);
      }, 3000);

      try {
        await crossChainMessenger.waitForMessageStatus(
          ethWithdrawReceipt,
          MessageStatus.READY_FOR_RELAY
        );
      } finally {
        clearInterval(finalizeInterval);
      }
      await sleep(30 * 10000);
      console.log("Finalizing eth withdrawal...");
      const ethFinalize = await crossChainMessenger.finalizeMessage(ethWithdrawReceipt, {
        signer: l1Signer,
      });
      console.log(`Transaction hash: ${ethFinalize.hash}`);
      const ethFinalizeReceipt = await ethFinalize.wait();
      if (ethFinalizeReceipt.status !== 1) {
        setLoader(false);
        throw new Error("Finalize withdrawal reverted");
      }
      localStorage.removeItem("rcp");
      console.log(`ETH withdrawal complete - included in block ${ethFinalizeReceipt.blockNumber}`);
      setLoader(false);
      setWaitingForProve(false);
    } catch (e) {
      console.error(e);
      setLoader(false);
      setCheckMetaMask(e?.message ?? e.toString());
    }
  };
  const handleWithdraw = async () => {
    try {
      if (!ethValue) {
        setErrorInput("Please enter the amount");
      } else {
        if (!parseFloat(ethValue) > 0) {
          setErrorInput("Invalid Amount Entered!");
        } else {
          setErrorInput("");

          //-------------------------------------------------------- SEND TOKEN VALUE -----------------------------------------------------------------
          const l1Url = process.env.REACT_APP_L1_RPC_URL;
          const l2Url = process.env.REACT_APP_L2_RPC_URL;
          const l1Provider = new ethers.providers.JsonRpcProvider(l1Url, "any");
          const l2Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          const l1Signer = l1Provider.getSigner(address);
          const l2Signer = l2Provider.getSigner(address);
          try {
            const crossChainMessenger = getCrossChainMessenger();
            if (sendToken == "ETH") {
              const weiValue = parseInt(ethers.utils.parseEther(ethValue)._hex, 16);
              setLoader(true);

              const response = await crossChainMessenger.withdrawETH(weiValue.toString(), {
                signer: l2Signer,
              });

              const ethWithdrawReceipt = await response.wait();
              // const ethWithdrawReceipt = {
              //   to: "0x4200000000000000000000000000000000000010",
              //   from: "0x7dc7972c2100d54485ceBf9496E372C15d2cB030",
              //   contractAddress: null,
              //   transactionIndex: 1,
              //   gasUsed: {
              //     type: "BigNumber",
              //     hex: "0x01c937",
              //   },
              //   logsBloom:
              //     "0x00000000000040000010000200000000000000000080000000100000001000000000000000000080000000000004008004000000000000000400100000000200000000000004400040000000000000000400000000000000000800000000040100000000020000000000000000008800800808800040000000000004000000000a04000000000000000000000000000000800000000000000001000000000000000000000000000001000000000000000000200000000000000000000000000000000000000000000000800408020000000002100000000000000040000020001000000000000000000100000000000000000000000000000000010000000000",
              //   blockHash: "0xc0c87f1d700685c745857ec656c2fb949e56f537f8302cf81089119193f48ba2",
              //   transactionHash:
              //     "0x19670dfa2d2a68b74d7a496ea77bae33fc3873bb35b03ede7fbd2ee65be06977",
              //   logs: [
              //     {
              //       transactionIndex: 1,
              //       blockNumber: 15087478,
              //       transactionHash:
              //         "0x19670dfa2d2a68b74d7a496ea77bae33fc3873bb35b03ede7fbd2ee65be06977",
              //       address: "0x4200000000000000000000000000000000000010",
              //       topics: [
              //         "0x73d170910aba9e6d50b102db522b1dbcd796216f5128b445aa2135272886497e",
              //         "0x0000000000000000000000000000000000000000000000000000000000000000",
              //         "0x000000000000000000000000deaddeaddeaddeaddeaddeaddeaddeaddead0000",
              //         "0x0000000000000000000000007dc7972c2100d54485cebf9496e372c15d2cb030",
              //       ],
              //       data: "0x0000000000000000000000007dc7972c2100d54485cebf9496e372c15d2cb03000000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
              //       logIndex: 0,
              //       blockHash: "0xc0c87f1d700685c745857ec656c2fb949e56f537f8302cf81089119193f48ba2",
              //     },
              //     {
              //       transactionIndex: 1,
              //       blockNumber: 15087478,
              //       transactionHash:
              //         "0x19670dfa2d2a68b74d7a496ea77bae33fc3873bb35b03ede7fbd2ee65be06977",
              //       address: "0x4200000000000000000000000000000000000010",
              //       topics: [
              //         "0x2849b43074093a05396b6f2a937dee8565b15a48a7b3d4bffb732a5017380af5",
              //         "0x0000000000000000000000007dc7972c2100d54485cebf9496e372c15d2cb030",
              //         "0x0000000000000000000000007dc7972c2100d54485cebf9496e372c15d2cb030",
              //       ],
              //       data: "0x00000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000",
              //       logIndex: 1,
              //       blockHash: "0xc0c87f1d700685c745857ec656c2fb949e56f537f8302cf81089119193f48ba2",
              //     },
              //     {
              //       transactionIndex: 1,
              //       blockNumber: 15087478,
              //       transactionHash:
              //         "0x19670dfa2d2a68b74d7a496ea77bae33fc3873bb35b03ede7fbd2ee65be06977",
              //       address: "0x4200000000000000000000000000000000000016",
              //       topics: [
              //         "0x02a52367d10742d8032712c1bb8e0144ff1ec5ffda1ed7d70bb05a2744955054",
              //         "0x00010000000000000000000000000000000000000000000000000000000015be",
              //         "0x0000000000000000000000004200000000000000000000000000000000000007",
              //         "0x0000000000000000000000005086d1eef304eb5284a0f6720f79403b4e9be294",
              //       ],
              //       data: "0x00000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000000000000000000000000000000000046388000000000000000000000000000000000000000000000000000000000000008012767a5e1858f747b5f5b86452ddab37e54f8c4a793005c287fc510e723dbadf00000000000000000000000000000000000000000000000000000000000001a4d764ad0b00010000000000000000000000000000000000000000000000000000000015b10000000000000000000000004200000000000000000000000000000000000010000000000000000000000000636af16bf2f682dd3109e60102b8e1a089fedaa800000000000000000000000000000000000000000000000000038d7ea4c68000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000a41635f5fd0000000000000000000000007dc7972c2100d54485cebf9496e372c15d2cb0300000000000000000000000007dc7972c2100d54485cebf9496e372c15d2cb03000000000000000000000000000000000000000000000000000038d7ea4c68000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
              //       logIndex: 2,
              //       blockHash: "0xc0c87f1d700685c745857ec656c2fb949e56f537f8302cf81089119193f48ba2",
              //     },
              //     {
              //       transactionIndex: 1,
              //       blockNumber: 15087478,
              //       transactionHash:
              //         "0x19670dfa2d2a68b74d7a496ea77bae33fc3873bb35b03ede7fbd2ee65be06977",
              //       address: "0x4200000000000000000000000000000000000007",
              //       topics: [
              //         "0xcb0f7ffd78f9aee47a248fae8db181db6eee833039123e026dcbff529522e52a",
              //         "0x000000000000000000000000636af16bf2f682dd3109e60102b8e1a089fedaa8",
              //       ],
              //       data: "0x0000000000000000000000004200000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000008000010000000000000000000000000000000000000000000000000000000015b1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a41635f5fd0000000000000000000000007dc7972c2100d54485cebf9496e372c15d2cb0300000000000000000000000007dc7972c2100d54485cebf9496e372c15d2cb03000000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
              //       logIndex: 3,
              //       blockHash: "0xc0c87f1d700685c745857ec656c2fb949e56f537f8302cf81089119193f48ba2",
              //     },
              //     {
              //       transactionIndex: 1,
              //       blockNumber: 15087478,
              //       transactionHash:
              //         "0x19670dfa2d2a68b74d7a496ea77bae33fc3873bb35b03ede7fbd2ee65be06977",
              //       address: "0x4200000000000000000000000000000000000007",
              //       topics: [
              //         "0x8ebb2ec2465bdb2a06a66fc37a0963af8a2a6a1479d81d56fdb8cbb98096d546",
              //         "0x0000000000000000000000004200000000000000000000000000000000000010",
              //       ],
              //       data: "0x00000000000000000000000000000000000000000000000000038d7ea4c68000",
              //       logIndex: 4,
              //       blockHash: "0xc0c87f1d700685c745857ec656c2fb949e56f537f8302cf81089119193f48ba2",
              //     },
              //   ],
              //   blockNumber: 15087478,
              //   confirmations: 1,
              //   cumulativeGasUsed: {
              //     type: "BigNumber",
              //     hex: "0x028e4c",
              //   },
              //   effectiveGasPrice: {
              //     type: "BigNumber",
              //     hex: "0x59682f32",
              //   },
              //   status: 1,
              //   type: 2,
              //   byzantium: true,
              // };
              console.log({ ethWithdrawReceipt });
              const proveInterval = setInterval(async () => {
                const currentStatus = await crossChainMessenger.getMessageStatus(
                  ethWithdrawReceipt
                );
                console.log(`Message status: ${MessageStatus[currentStatus]}`);
              }, 3000);

              try {
                await crossChainMessenger.waitForMessageStatus(
                  ethWithdrawReceipt,
                  MessageStatus.READY_TO_PROVE
                );
              } finally {
                clearInterval(proveInterval);
              }
              console.log("aweawe");
              localStorage.setItem("rcp", JSON.stringify(ethWithdrawReceipt));
              if (ethWithdrawReceipt) {
                console.log("insider");
                setLoader(false);
                setEthValue("");
                setWaitingForProve(true);
              }
              console.log("Proving eth withdrawal...");
            }
            if (sendToken == "DAI") {
              var daiValue = Web3.utils.toWei(ethValue, "ether");
              setLoader(true);
              var depositTxn2 = await crossChainMessenger.withdrawERC20(
                "0xb93cba7013f4557cDFB590fD152d24Ef4063485f",
                "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                daiValue
              );
              var receiptDAI = await depositTxn2.wait();
              if (receiptDAI) {
                setLoader(false);
                setEthValue("");
              }
              setWaitingForProve(true);
            }

            if (sendToken == "USDT") {
              var usdtValue = parseInt(ethValue * 1000000);
              setLoader(true);
              var receiptUSDT = await crossChainMessenger.withdrawERC20(
                "0xfad6367E97217cC51b4cd838Cc086831f81d38C2",
                "0x4faf8Ba72fa0105c90A339453A420866388071a0",
                usdtValue
              );
              var getReceiptUSDT = await receiptUSDT.wait();
              if (getReceiptUSDT) {
                setLoader(false);
                setEthValue("");
              }
            }
            if (sendToken == "wBTC") {
              var wBTCValue = parseInt(ethValue * 1000000);
              setLoader(true);
              var receiptwBTC = await crossChainMessenger.withdrawERC20(
                "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
                "0xbFFfa9a3BD00eF826486498a014010E0f9F42E15",
                wBTCValue
              );
              var getReceiptwBTC = await receiptwBTC.wait();
              if (getReceiptwBTC) {
                setLoader(false);
                setEthValue("");
              }
            }
            if (sendToken == "USDC") {
              var usdcValue = parseInt(ethValue * 1000000);
              setLoader(true);
              var receiptUSDC = await crossChainMessenger.withdrawERC20(
                "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
                "0xbFFfa9a3BD00eF826486498a014010E0f9F42E15",
                usdcValue
              );
              var getReceiptUSDC = await receiptUSDC.wait();
              if (getReceiptUSDC) {
                setLoader(false);
                setEthValue("");
              }
            }
            //-------------------------------------------------------- SEND TOKEN VALUE END-----------------------------------------------------------------
          } catch (error) {
            setLoader(false);
            console.log({ error }, 98);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitch = () => {
    try {
      switchNetwork(process.env.REACT_APP_L2_CHAIN_ID);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSwitchToL1 = () => {
    try {
      switchNetwork(process.env.REACT_APP_L1_CHAIN_ID);
    } catch (error) {
      console.log(error);
    }
  };
  ////========================================================== HANDLE CHANGE =======================================================================

  const handleChange = (e) => {
    if (sendToken == "ETH") {
      if (data?.formatted < e.target.value) {
        setErrorInput("Insufficient ETH balance.");
      } else {
        setErrorInput("");
      }
      setEthValue(e.target.value);
    }
    if (sendToken == "DAI") {
      if (dataDAI.data?.formatted < e.target.value) {
        setErrorInput("Insufficient DAI balance.");
      } else {
        setErrorInput("");
      }
      setEthValue(e.target.value);
    }
    if (sendToken == "USDT") {
      if (dataUSDT.data?.formatted < e.target.value) {
        setErrorInput("Insufficient DAI balance.");
      } else {
        setErrorInput("");
      }
      setEthValue(e.target.value);
    }
    if (sendToken == "wBTC") {
      if (datawBTC.data?.formatted < e.target.value) {
        setErrorInput("Insufficient wBTC balance.");
      } else {
        setErrorInput("");
      }
      setEthValue(e.target.value);
    }
    if (sendToken == "USDC") {
      if (dataUSDC.data?.formatted < e.target.value) {
        setErrorInput("Insufficient USDC balance.");
      } else {
        setErrorInput("");
      }
      setEthValue(e.target.value);
    }
  };
  return (
    <>
      <div className="bridge_wrap">
        <TabMenu />
        <section className="deposit_wrap">
          <div className="withdraw_title_wrap">
            <div className="withdraw_title_icn">
              <MdOutlineSecurity />
            </div>
            <div className="withdraw_title_content">
              <h3>Use the official bridge</h3>
              <p>This usually takes 7 days</p>
              <p>Bridge any token to Ethereum Mainnet</p>
            </div>
          </div>
          <div className="deposit_price_wrap">
            <div className="deposit_price_title">
              <p>From</p>
              <h5>
                <Image src={toIcn} alt="To icn" fluid /> OP
              </h5>
            </div>
            <div className="deposit_input_wrap">
              <Form>
                <div className="deposit_inner_input">
                  <Form.Control
                    type="number"
                    name="eth_value"
                    value={ethValue}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="any"
                  />
                  <Form.Select
                    aria-label="Default select example"
                    className="select_wrap"
                    onChange={({ target }) => setSendToken(target.value)}>
                    <option>ETH</option>
                    {/* <option value="DAI">DAI</option>
                    <option value="USDT">USDT</option>
                    <option value="wBTC">wBTC</option>
                    <option value="USDC">USDC</option> */}
                  </Form.Select>
                </div>
                <div className="input_icn_wrap">
                  {sendToken == "ETH" ? (
                    <span className="input_icn">
                      <Ethereum style={{ fontSize: "1.5rem" }} />
                    </span>
                  ) : sendToken == "DAI" ? (
                    <span className="input_icn">
                      <Dai style={{ fontSize: "1.5rem" }} />
                    </span>
                  ) : sendToken == "USDT" ? (
                    <span className="input_icn">
                      <Usdt style={{ fontSize: "1.5rem" }} />
                    </span>
                  ) : sendToken == "wBTC" ? (
                    <span className="input_icn">
                      <Btc style={{ fontSize: "1.5rem" }} />
                    </span>
                  ) : (
                    <span className="input_icn">
                      <Usdc style={{ fontSize: "1.5rem" }} />
                    </span>
                  )}
                </div>
              </Form>
            </div>
            {errorInput && <small className="text-danger">{errorInput}</small>}
            {sendToken === "ETH" ? (
              address && (
                <p className="wallet_bal mt-2">Balance: {Number(data?.formatted).toFixed(5)} ETH</p>
              )
            ) : sendToken === "DAI" ? (
              address && (
                <p className="wallet_bal mt-2">
                  Balance: {Number(dataDAI.data?.formatted).toFixed(5)} DAI
                </p>
              )
            ) : sendToken == "USDT" ? (
              address && (
                <p className="wallet_bal mt-2">
                  Balance: {Number(dataUSDT.data?.formatted).toFixed(5)} USDT
                </p>
              )
            ) : sendToken === "wBTC" ? (
              address && (
                <p className="wallet_bal mt-2">
                  Balance: {Number(datawBTC.data?.formatted).toFixed(5)} wBTC
                </p>
              )
            ) : (
              <p className="wallet_bal mt-2">
                Balance: {Number(dataUSDC.data?.formatted).toFixed(5)} USDC
              </p>
            )}
          </div>
          <div className="deposit_details_wrap">
            <div className="deposit_details">
              <p>To:</p>
              <h5>
                <FaEthereum /> Goerli Testnet
              </h5>
            </div>
            <div className="withdraw_bal_sum">
              {sendToken == "ETH" ? (
                <span className="input_icn">
                  <Ethereum style={{ fontSize: "1.5rem" }} />
                </span>
              ) : sendToken == "DAI" ? (
                <span className="input_icn">
                  <Dai style={{ fontSize: "1.5rem" }} />
                </span>
              ) : sendToken == "USDT" ? (
                <span className="input_icn">
                  <Usdt style={{ fontSize: "1.5rem" }} />
                </span>
              ) : sendToken == "wBTC" ? (
                <span className="input_icn">
                  <Btc style={{ fontSize: "1.5rem" }} />
                </span>
              ) : (
                <span className="input_icn">
                  <Usdc style={{ fontSize: "1.5rem" }} />
                </span>
              )}
              <p>
                You’ll receive: {ethValue ? ethValue : "0"} {sendToken}
              </p>
              <div></div>
              {/* <span className='input_title'>ETH</span> */}
            </div>
          </div>
          <div className="deposit_btn_wrap">
            {checkMetaMask === true ? (
              <a className="btn deposit_btn" href="https://metamask.io/" target="_blank">
                <Image src={metamask} alt="metamask icn" fluid /> Please Install Metamask Wallet
              </a>
            ) : !isConnected ? (
              <button className="btn deposit_btn" onClick={() => connect()}>
                <IoMdWallet />
                Connect Wallet
              </button>
            ) : waitingForProve && chain.id !== Number(process.env.REACT_APP_L1_CHAIN_ID) ? (
              <button className="btn deposit_btn" onClick={handleSwitchToL1}>
                <HiSwitchHorizontal />
                Switch to Mainnet Testnet
              </button>
            ) : waitingForProve ? (
              <button
                className="btn deposit_btn"
                disabled={loader ? true : false}
                onClick={proveMessage}>
                <HiSwitchHorizontal />
                {loader ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  "Prove"
                )}
              </button>
            ) : chain.id !== Number(process.env.REACT_APP_L2_CHAIN_ID) ? (
              <button className="btn deposit_btn" onClick={handleSwitch}>
                <HiSwitchHorizontal />
                Switch to OP Testnet
              </button>
            ) : (
              <button
                className="btn deposit_btn"
                onClick={handleWithdraw}
                disabled={loader ? true : false}>
                {loader ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  "Withdraw"
                )}
              </button>
            )}
          </div>
          {metaMastError && (
            <small className="d-block text-danger text-center mt-2">{metaMastError}</small>
          )}
        </section>
      </div>
    </>
  );
};

export default Withdraw;
