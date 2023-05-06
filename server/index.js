const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require('./crypto');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {};

app.post("/addBalance", (req, res) => {
  const { account, balance } = req.body;
  console.log("🚀 ~ file: index.js:14 ~ app.post ~ balance:", balance)
  console.log("🚀 ~ file: index.js:14 ~ app.post ~ account:", account)
  balances[account] = balance;
  res.send({ balance: balances[account] });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  console.log("🚀 ~ file: index.js:20 ~ app.get ~ address:", address)
  console.log("🚀 ~ file: index.js:22 ~ app.get ~ balances:", balances)
  const balance = balances[address] || 0;
  console.log("🚀 ~ file: index.js:21 ~ app.get ~ balance:", balance)
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { recipient, address, amount } = message;

  const publicKey = crypto.generatePublicKeyFromSignature(message, signature);
  console.log("🚀 ~ file: index.js:34 ~ app.post ~ publicKey:", publicKey)
  const sender = crypto.getAddressFromPublickey(publicKey);
  console.log("🚀 ~ file: index.js:36 ~ app.post ~ sender:", sender)

  if (sender !== address) {
    res.status(400).send({ message: "Invalid signature!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
