const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { hexToBytes, toHex } = require('ethereum-cryptography/utils');

const generateMessageHash = (message) => {
  const messageBytes = Uint8Array.from(message);
  const messageHash = keccak256(messageBytes);
  return messageHash;
};

const getAddressFromPublickey = (key) => {
  const address = toHex(keccak256(key.slice(1).slice(-20)));
  return '0x' + address.toString();
};

const generatePublicKeyFromSignature = (message, signature) => {
  const messageHash = generateMessageHash(message);
  const signatureBytes = hexToBytes(signature);
  const recoveryBit = signatureBytes[0];
  const signatureBytesWithoutRecoveryBit = signatureBytes.slice(1);
  const publicKey = secp.recoverPublicKey(
    messageHash,
    signatureBytesWithoutRecoveryBit,
    recoveryBit
  );
  return publicKey;
};

module.exports = {
  generateMessageHash,
  getAddressFromPublickey,
  generatePublicKeyFromSignature,
}