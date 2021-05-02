const Token = artifacts.require("MyToken");

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
// const { assert } = require("console");
const { receiveMessageOnPort } = require("worker_threads");
chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;
// const should = chai.should;

contract("Token Test", async (accounts) => {

    const [deploymentAccount, recipient, anotherAccount] = accounts;

    it("all tokens should be in my account", async ()=>{
        let instance = await Token.deployed();
        let totalSupply = await instance.totalSupply();
        // console.log(totalSupply);
        // console.log(await instance.balanceOf(recipient));
        // let balance = await instance.balanceOf(accounts[0]);
        // assert.equal(balance.valueOf(), totalSupply.valueOf(), "The balance was not the same");
        expect( instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        // expect(2).to.eventually..equal(1);
    });


    it("is not possible to send more tokens than available in total", async ()=>{
        let instance = await Token.deployed();
        let balanceOfDeployer = await instance.balanceOf(deploymentAccount);

        expect(instance.transfer(recipient, balanceOfDeployer+1)).to.eventually.be.rejected;

        expect( instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
        expect( instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("is possible to send tokens between account", async() => {
        const sendTokens = new BN("1");
        let instance = await Token.deployed();
        let totalSupply = await instance.totalSupply();
        let initialRecipientBalance = await instance.balanceOf(recipient);

        expect( instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        // let tx = await instance.transfer(recipient, sendTokens);
        // expect(tx).to.eventually.be.fulfilled;
        // assert.isFulfilled(await instance.transfer(recipient, sendTokens));
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(sendTokens));
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(initialRecipientBalance.add(sendTokens));

    });


});