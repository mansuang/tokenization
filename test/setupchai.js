"use strict";
var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
// const { assert } = require("console");
const { receiveMessageOnPort } = require("worker_threads");
chai.use(chaiAsPromised);


module.exports = chai;