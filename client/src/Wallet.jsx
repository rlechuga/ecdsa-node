/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import server from './server';
import { formatWalletAddress } from '../../helpers/format';
import crypto from './crypto';

function Wallet({ sender, setSender }) {
  async function onChange(evt) {
    const privateKey = evt.target.value.toLowerCase();
    try {
      // const address = toHex(secp.secp256k1.getPublicKey(privateKey));
      const address = await crypto.recoverAddress(privateKey);
      setSender({ ...sender, privateKey, address });
      if (address) {
        const {
          data: { balance, username },
        } = await server.get(`balance/${address}`);
        setSender({
          ...sender,
          address,
          username,
          balance,
          privateKey,
        });
        return;
      }
    } catch (e) {
      setSender({
        ...sender,
        address: '',
        balance: 0,
        privateKey,
        username: '',
      });
    }
  }
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type: the private key"
          value={sender.privateKey}
          onChange={onChange}
        />
      </label>

      <div className="display">
        Username:
        {' '}
        {sender.username || 'none'}
      </div>

      <div className="display">
        Wallet Address:
        {' '}
        {sender.address ? formatWalletAddress(sender.address) : 'none'}
      </div>

      <div className="balance">
        Balance:
        {' '}
        {sender.balance}
      </div>
    </div>
  );
}

export default Wallet;
