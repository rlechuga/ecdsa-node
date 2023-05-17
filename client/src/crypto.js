/* eslint-disable linebreak-style */
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

function hashMessage(message) {
  const messageInBytes = utf8ToBytes(message);
  return keccak256(messageInBytes);
}

/*
 ** usage: const [sig, recoveryBit] = await signMessage('hello world');
 */
async function signMessage(msg, privateKey) {
  const bytes = hashMessage(msg);
  const signature = secp.secp256k1.sign(bytes, privateKey);
  signature.r = signature.r.toString();
  signature.s = signature.s.toString();
  return signature;
}

async function recoverAddress(privateKey) {
  return toHex(secp.secp256k1.getPublicKey(privateKey));
}

export default {
  signMessage,
  recoverAddress,
};
