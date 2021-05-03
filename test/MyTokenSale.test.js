const Token = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");

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

});