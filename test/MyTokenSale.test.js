const MyTokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;

const expect = chai.expect;

// const should = chai.should;

contract("Token Sale Test", async (accounts) => {

    const [deploymentAccount, recipient, anotherAccount] = accounts;

    it('should not have any token in my deployerAccount', async() => {
        let instance = await Token.deployed();
        return expect( instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens should be in the TokenSale Smart Contract by default", async() => {
        let instance = await Token.deployed();
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(MyTokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be possible to buy tokens", async() => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deploymentAccount);
        await tokenSaleInstance.sendTransaction({from: deploymentAccount, value: web3.utils.toWei("1","wei")});

        // expect().to.eventually.be.fulfilled;

        return expect(tokenInstance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
    });

});