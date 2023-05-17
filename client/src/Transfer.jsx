/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import server from './server';
import { formatWalletAddress } from '../../helpers/format';
import crypto from './crypto';

// eslint-disable-next-line react/prop-types
function Transfer({ sender, setSender }) {
  const [sendAmount, setSendAmount] = useState('');
  const initialRecipientState = {
    address: '',
    balance: 0,
    privateKey: '',
    username: '',
  };
  const [recipient, setRecipient] = useState(initialRecipientState);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = JSON.stringify({
      recipient: recipient.address,
      amount: parseInt(sendAmount, 10),
    });

    const signature = await crypto.signMessage(message, sender.privateKey);

    try {
      const {
        data: { senderBalance, recipientBalance },
      } = await server.post('send', {
        signature,
        message,
        publicKey: sender.address,
      });
      setSender({ ...sender, balance: senderBalance });
      setRecipient({ ...recipient, balance: recipientBalance });
    } catch (ex) {
      // eslint-disable-next-line no-alert
      alert('Please check your wallet');
      console.log(ex);
    }
  }

  async function onChange(evt) {
    const privateKey = evt.target.value.toLowerCase();
    try {
      const address = await crypto.recoverAddress(privateKey);
      setRecipient({ ...recipient, privateKey, address });
      if (address) {
        const {
          data: { balance, username },
        } = await server.get(`balance/${address}`);
        setRecipient({
          ...recipient, address, balance, privateKey, username,
        });
      }
    } catch (e) {
      setRecipient({ ...initialRecipientState, privateKey });
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient privateKey
        <input
          placeholder="Type recipient's private key"
          value={recipient.privateKey}
          onChange={onChange}
        />
      </label>

      <div className="display">
        Recipient:
        {' '}
        {recipient.username || 'none'}
      </div>

      <div className="display">
        Wallet Address:
        {' '}
        {recipient.address ? formatWalletAddress(recipient.address) : 'none'}
      </div>

      <div className="display">
        Recipient Balance:
        {' '}
        {recipient.balance || '?'}
      </div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
