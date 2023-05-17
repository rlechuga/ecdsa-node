const secp = require('ethereum-cryptography/secp256k1')
const { utf8ToBytes } = require('ethereum-cryptography/utils')
const { keccak256 } = require('ethereum-cryptography/keccak')

function hashMessage (message) {
  const messageInBytes = utf8ToBytes(message)
  return keccak256(messageInBytes)
}

async function verify (signature, message, publicKey) {
  const hash = hashMessage(message)
  secp.verify(signature, hash, publicKey)
}

module.exports = { verify }
