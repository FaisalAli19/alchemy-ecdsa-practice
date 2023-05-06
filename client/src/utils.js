import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { hexToBytes, toHex } from 'ethereum-cryptography/utils';

export const ACCOUNTS = new Map();
export const ACCOUNTS_ADDRESS = [];

export const generateNewAccount = () => {
  const privateKey = secp.utils.randomPrivateKey();
  console.log("🚀 ~ file: utils.js:10 ~ generateNewAccount ~ secp:", secp)
  const publicKey = secp.getPublicKey(privateKey);
  const address = toHex(keccak256(publicKey.slice(1).slice(-20)));
  const account = "0x" + address.toString();
  ACCOUNTS.set(account, { privateKey: toHex(privateKey), publicKey: toHex(publicKey) });
  ACCOUNTS_ADDRESS.push(account);
};

const getPrivateKey = (address) => {
  if (!address) {
    return null;
  }
  return hexToBytes(ACCOUNTS.get(address).privateKey);
};

const getPublicKey = (address) => {
  if (!address) {
    return null;
  }
  return hexToBytes(ACCOUNTS.get(address).publicKey);
};

export const getHexPublicKey = (address) => {
  if (!address) {
    return null;
  }
  return toHex(getPublicKey(account));
};

const hashMessage = (message) => {
  return keccak256(Uint8Array.from(message));
};

export const signMessage = async (account, message) => {
  const privateKey = getPrivateKey(account);
  const messageHash = hashMessage(message);
  const [signature, recoveryBit] = await secp.sign(messageHash, privateKey, {
    recovered: true,
  });
  const signatureWithRecoveryBit = new Uint8Array([recoveryBit, ...signature]);
  return toHex(signatureWithRecoveryBit);
};

