const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
const {network} = require('./config');
const {createKeyPair} = require('./keyService');

const witnessScript = Buffer.from(process.env.REDEEM_SCRIPT_HEX, 'hex');
const p2wsh = bitcoin.payments.p2wsh({redeem: {output: witnessScript, network}, network});
const p2sh = bitcoin.payments.p2sh({redeem: {output: p2wsh.output, network}, network});

const createTransaction = () => {
    const psbt = new bitcoin.Psbt({network}); // new partially signed Bitcoin transaction (PSBT)
    psbt.setLocktime(0);
    try {
        psbt.addInput({
            hash: process.env.TX_HASH,
            index: parseInt(process.env.TX_INDEX, 10),
            sequence: parseInt(process.env.SEQUENCE, 16),
            witnessUtxo: {
                script: p2sh.redeem.output,
                value: parseInt(process.env.VALUE, 10)
            },
            redeemScript: Buffer.from(process.env.REDEEM_SCRIPT_HEX, 'hex'),
            witnessScript: witnessScript
        });
    } catch (error) {
        console.error('Error adding input:', error);
        throw new Error('Error adding input: ' + error.message);
    }

    try {
        psbt.addOutput({
            address: process.env.ADDRESS,
            value: parseInt(process.env.VALUE, 10)
        });
    } catch (error) {
        console.error('Error adding output:', error);
        throw new Error('Error adding output: ' + error.message);
    }

    const keyPairs = [
        createKeyPair(process.env.PRIVATE_KEY1, 'hex'),
        createKeyPair(process.env.PRIVATE_KEY2, 'hex')
    ];

    keyPairs.forEach(key => {
        psbt.signInput(0, key);
    });

    psbt.finalizeAllInputs();
    const transaction = psbt.extractTransaction();
    console.log('Transaction Hex:', transaction.toHex());
    fs.writeFileSync('../out.txt', transaction.toHex());
};

module.exports = {createTransaction};