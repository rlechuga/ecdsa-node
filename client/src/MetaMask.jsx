/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import metaMask from './MetaMaskSecureDb';

function MetaMask() {
  const [privateKey, setPrivateKey] = useState('');
  const [username, setUsername] = useState('');

  async function onChange(evt) {
    const user = evt.target.value.toLowerCase();
    if (user) {
      if (metaMask.secureDB[user]) {
        setPrivateKey(metaMask.secureDB[user].privateKey);
      } else {
        setPrivateKey('');
      }
      setUsername(user);
    } else {
      setPrivateKey('');
      setUsername('');
    }
  }
  return (
    <div className="container wallet">
      <h1>MetaMask(simulator)</h1>

      <label>
        Username (Woffy, Ali, Conrad)
        <input
          placeholder="Type: username"
          value={username}
          onChange={onChange}
        />
      </label>

      <div className="display">
        Private Key:
        {' '}
        {privateKey || 'none'}
      </div>
    </div>
  );
}

export default MetaMask;
