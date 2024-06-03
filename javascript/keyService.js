const { network, ECPair } = require('./config');

const createKeyPair = (privateKeyHex) => {
    const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
    return ECPair.fromPrivateKey(privateKeyBuffer, { network });
};

module.exports = { createKeyPair };