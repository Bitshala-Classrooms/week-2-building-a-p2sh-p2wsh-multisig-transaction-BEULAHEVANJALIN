const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const ECPairFactory = require('ecpair').ECPairFactory;

const config = {
    network: bitcoin.networks.bitcoin,
    ECPair: ECPairFactory(ecc)
};

module.exports = config;