require('dotenv').config();
const {createTransaction} = require('./transactionBuilder');

function main() {
    createTransaction();
}

main();