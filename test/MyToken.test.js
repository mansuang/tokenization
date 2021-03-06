const Token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;

const expect = chai.expect;
// const should = chai.should;

contract("Token Test", async (accounts) => {

    const [deploymentAccount, recipient, anotherAccount] = accounts;

    beforeEach( async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);

    });

    it("all tokens should be in my account", async ()=>{
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        // console.log(totalSupply);
        // console.log(await instance.balanceOf(recipient));
        // let balance = await instance.balanceOf(accounts[0]);
        // assert.equal(balance.valueOf(), totalSupply.valueOf(), "The balance was not the same");
        return expect( instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        // expect(2).to.eventually..equal(1);
    });


    it("is possible to send tokens between account", async() => {
        const sendTokens = new BN("1");
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        let initialRecipientBalance = await instance.balanceOf(recipient);

        expect( instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        // let tx = await instance.transfer(recipient, sendTokens);
        // expect(tx).to.eventually.be.fulfilled;
        // assert.isFulfilled(await instance.transfer(recipient, sendTokens));
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(sendTokens));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(initialRecipientBalance.add(sendTokens));

    });



    it("is not possible to send more tokens than available in total", async ()=>{
        let instance = this.myToken;
        let balanceOfDeployer = await instance.balanceOf(deploymentAccount);

        expect(instance.transfer(recipient, balanceOfDeployer+1)).to.eventually.be.rejected;

        expect( instance.balanceOf(deploymentAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
        return expect( instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

});