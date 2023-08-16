const crypto = require("crypto");
require('dotenv').config();
const privateKeyString = process.env.PRIVATE_KEY;

const privateKey = crypto.createPrivateKey({
  key: privateKeyString,
  format: 'der',
  type: 'pkcs8',
  encoding: 'hex'
});

const publicKey = crypto.createPublicKey(privateKey).export({
  type: 'pkcs1',
  format: 'der'
});

const methodName = 'createTransaction'

const message = {
  "jsonrpc": "2.0",
  "id": "test",
  "method": methodName,
  "params": {
    "from": "eth",
    "to": "usdt20",
    // "rateId": "IIq9AHdPvMCTIgH~56v%A*8EpSEo(Z",
    "address": "0x8088AB972Ad9cf061F0dc98B621DE2969b3c2fE7", //receipant address ( Slash Fireblock )
    "amountFrom": "1.040924431193471924",
    // "refundAddress": "0x8088AB972Ad9cf061F0dc98B621DE2969b3c2fE7"
  }
};

const signature = crypto.sign('sha256', Buffer.from(JSON.stringify(message)), {
  key: privateKey,
  type: 'pkcs8',
  format: 'der'
});

// console.log('Sign is:', signature.toString('hex'));
// console.log();
// console.log('Sign base64 is:', signature.toString('base64'));

// ----------------------------------

const request = require('request');
const options = {
  'method': 'POST',
  'url': 'https://api.changelly.com/v2',
  'headers': {
    'Content-Type': 'application/json',
    'X-Api-Key': crypto.createHash('sha256').update(publicKey).digest('base64'),
    'X-Api-Signature': signature.toString('base64')
  },
  body: JSON.stringify(message)
};

request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});