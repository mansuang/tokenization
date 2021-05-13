import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";
import detectEthereumProvider from '@metamask/detect-provider';

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "0x23...", tokenSaleAddress: null, userToken: "--" };

  componentDidMount = async () => {
    try {
      const provider = await detectEthereumProvider();

      if (! provider) {
        console.log('Please install MetaMask!');
        alert('Please install metamask!');
      }
      if (provider !== window.ethereum) {
        alert('Do you have multiple wallets installed?');
      }

      console.log( window.ethereum );
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set this.web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.listenAccountChange();
      // window.ethereum.on('accountsChanged', this.updateUserTokens);
      this.setState({ loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address}, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    console.log(this.accounts[0]);
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    console.log(userTokens);
    this.setState({userTokens: userTokens});

  }


  listenAccountChange = () => {
    window.ethereum.on('accountsChanged',  async (switchedAccounts) => {
      console.log('account changed to '+switchedAccounts[0]);
      if( this.accounts[0] != switchedAccounts[0])
      {
        this.accounts = switchedAccounts;
      }
      this.updateUserTokens();
    });

    window.ethereum.on('chainChanged',  async (switchedAccounts) => {
      window.location.reload();
    }); 

  }

  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei("1","wei")})
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });

  }

  handleKycWhitelisting =  async() => {
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({
      from: this.accounts[0] 
    });

    alert("KYC for "+this.state.kycAddress+" is completed");

  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>StarDucks Cappucino Token Sale</h1>
        <p>Get your Tokens today</p>
        <h2>Kyc Whitelisting</h2>
        <p>
          Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
          <button type="button" onClick={this.handleKycWhitelisting} >Add to Whitelist</button>
        </p>
        <h2>Buy Tokens</h2>
        <p>
          If you want to buy tokens, wend Wei to this address: {this.state.tokenSaleAddress}
        </p>
        <div>You currently have: {this.state.userTokens} CAPPU Tokens</div>
        <button type="button" onClick={this.handleBuyTokens}>Buy more tokens</button>
      </div>
    );
  }
}


export default App;
