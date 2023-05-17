/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import MetaMask from './MetaMask';
import Wallet from './Wallet';
import Transfer from './Transfer';
import './App.scss';

function App() {
  const [sender, setSender] = useState({
    address: '',
    balance: 0,
    privateKey: '',
    username: '',
  });

  return (
    <div className="app">
      <MetaMask sender={sender} setSender={setSender} />
      <Wallet sender={sender} setSender={setSender} />
      <Transfer sender={sender} setSender={setSender} />
    </div>
  );
}

export default App;
