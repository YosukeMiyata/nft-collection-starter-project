// App.js
import myEpicNft from "./utils/MyEpicNFT.json";
import { ethers } from "ethers";
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpiner";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
//import {AnimatePresence, motion} from "framer-motion/dist/framer-motion"; 
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = "juilliard_inst";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/account";
const MAX_TOTAL_MINT_COUNT = 15;
// 0x4 は　Rinkeby の ID です。
const EthereumMainNetworkChainId = "0x1";
const RopstenTestNetworkChainId = "0x3";
const RinkebyTestNetworkChainId = "0x4";
const GoerliTestNetworkChainId = "0x5";
const KovanTestNetworkChainId = "0x2a";
let _tokenIds;

const App = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /* ミント数を保存するために使用する状態変数を定義 */
  const [totalMintCount, setTotalMintCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);
  const CONTRACT_ADDRESS =
      "0x1BdE21c241f88cf1A9C129610E028b6e8911189A";
  /*
   * ユーザーが認証可能なウォレットアドレスを持っているか確認します。
   */
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);
    switch( chainId ){
      case EthereumMainNetworkChainId: 
            alert("You are connected to the Ethereum Main Network! Could you please connect to the Rinkeby Test Network?");
            break;
      case RopstenTestNetworkChainId: 
            alert("You are connected to the Ropsten Test Network! Could you please connect to the Rinkeby Test Network?");
            break;
      case RinkebyTestNetworkChainId: 
            console.log("You are connected to the Rinkeby Test Network!");
            break;
      case GoerliTestNetworkChainId: 
            alert("You are connected to the Goerli Test Network! Could you please connect to the Rinkeby Test Network?");
            break;
      case KovanTestNetworkChainId: 
            alert("You are connected to the Kovan Test Network! Could you please connect to the Rinkeby Test Network?");
            break;
      default:
            alert("You are not connected to the Rinkeby Test Network! Could you please connect to the Rinkeby Test Network?");
            break;
    }
    /* ユーザーが認証可能なウォレットアドレスを持っている場合は、
     * ユーザーに対してウォレットへのアクセス許可を求める。
     * 許可されれば、ユーザーの最初のウォレットアドレスを
     * accounts に格納する。
     */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // NFT が発行されます。
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        /* コントラクトからgetTokenIdsメソッドを呼び出す */
        _tokenIds = await connectedContract.getTokenIds();
        setTotalMintCount( _tokenIds.toNumber() );
        console.log("checkIfWalletIsConnected setTotalMintCount!  ", _tokenIds.toNumber() );
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }      

      // **** イベントリスナーをここで設定 ****
      // この時点で、ユーザーはウォレット接続が済んでいます。
      setupEventListener();
      
    } else {
      console.log("No authorized account found");
    }
  };

  /*
   * connectWallet メソッドを実装します。
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付けます。
       */
      setCurrentAccount(accounts[0]);

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // NFT が発行されます。
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        /* コントラクトからgetTokenIdsメソッドを呼び出す */
        _tokenIds = await connectedContract.getTokenIds();
        setTotalMintCount( _tokenIds.toNumber() );
        console.log("connectWallet setTotalMintCount!  ", _tokenIds.toNumber() );
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }      

      // **** イベントリスナーをここで設定 ****
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // setupEventListener 関数を定義します。
  // MyEpicNFT.sol の中で event が　emit された時に、
  // 情報を受け取ります。
  const setupEventListener = async () => {
    
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // NFT が発行されます。
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        // Event が　emit される際に、コントラクトから送信される情報を受け取っています。
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });
        /*connectedContract.on("NewTotalMintCount", (tokenId) => {
          setTotalMintCount( tokenId.toNumber() );
          console.log("setupEvent setTotalMintCount!  ",tokenId.toNumber() );
        });*/
        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let wavePortalContract;

    const onNewTotalMintCount = (tokenId) => {
      console.log("useEffect NewTotalMintCount", tokenId.toNumber());
      const tokenIdCleaned = tokenId.toNumber();
      setTotalMintCount(tokenIdCleaned);
    };

    /* NewWaveイベントがコントラクトから発信されたときに、情報をを受け取ります */
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicNft.abi,
        signer
      );
      wavePortalContract.on("NewTotalMintCount", onNewTotalMintCount);
    }
    /*メモリリークを防ぐために、NewWaveのイベントを解除します*/
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewTotalMintCount", onNewTotalMintCount);
      }
    };
  }, []);

  const askContractToMintNft = async () => {
    
    if( totalMintCount < MAX_TOTAL_MINT_COUNT ){
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            myEpicNft.abi,
            signer
          );
          //setIsLoading(true);
          console.log("Going to pop wallet now to pay gas...");
          let nftTxn = await connectedContract.makeAnEpicNFT();
          setIsLoading(true);
          console.log("Mining...please wait.");
          await nftTxn.wait();
    
          console.log(
            `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
          );
          setIsLoading(false);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }else{
      alert(`I'm terribly sorry the total number of NFTs minted has reached the upper limit. Could you please see my other NFTs at the following links. ${OPENSEA_LINK}`);
    }
  };

  // renderNotConnectedContainer メソッドを定義します。
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderUser = (
    <p></p>
  );
  
  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">Mint your own special NFT💫</p>
          {/*条件付きレンダリングを追加しました
          // すでに接続されている場合は、
          // Connect to Walletを表示しないようにします。*/}
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            /* ユーザーが Mint NFT ボタンを押した時に、askContractToMintNft 関数を呼び出します　*/
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
          {currentAccount && (
            <p className="sub-text">NFT {totalMintCount} / {MAX_TOTAL_MINT_COUNT} minted so far</p>
          )}
          {currentAccount && (
            <a
            className="App-link"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="cta-button connect-wallet-button">
            MY OTHER FANCY NFTs
          </button>
          </a>
          )}
          {isLoading ? <LoadingSpinner /> : renderUser}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};
export default App;