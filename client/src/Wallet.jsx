import { useState } from 'react';

import server from './server';
import { generateNewAccount, ACCOUNTS, ACCOUNTS_ADDRESS } from './utils';

function Wallet({ address, setAddress, balance, setBalance }) {
  const [funds, setFunds] = useState(0);

  const handleFunds = (evt) => {
    setFunds(evt.target.value);
  }

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      console.log("🚀 ~ file: Wallet.jsx:19 ~ onChange ~ balance:", balance)
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function generateWallet(evt) {
    evt.preventDefault();
    generateNewAccount();
    console.log("🚀 ~ file: Wallet.jsx:30 ~ generateWallet ~ ACCOUNTS:", ACCOUNTS)
    const newAccount = Array.from(ACCOUNTS)[ACCOUNTS.size - 1];
    let newDeposit = parseInt(funds);
    const addAccount = {
      account: newAccount[0],
      balance: newDeposit,
    }
    setFunds(0);
    try {
      const { data } = await server.post('addBalance', addAccount);
      console.log("🚀 ~ file: Wallet.jsx:34 ~ generateWallet ~ data:", data)
      setAddress(newAccount[0]);
      setBalance(data.balance);
    } catch (error) {
      alert(x)
    }
  }

  return (
    <div className="container">
      <div className="wallet">
        <h1>Your Wallet</h1>

        <label>
          Wallet Address
          <select onChange={onChange} value={address}>
            <option value="">Select Address</option>
            {ACCOUNTS_ADDRESS.map((add, i) => (
              <option key={i} value={add}>
                {add.slice(0, 12) + "..." + add.slice(-4)}
              </option>
            ))}
          </select>
        </label>

        <div className="balance">Balance: {balance}</div>
      </div>

      <form className="transfer" onSubmit={generateWallet}>
        <label>
          Create Account
          <input placeholder="Enter initial deposit" value={funds} onChange={handleFunds}></input>
          <input type="submit" className="button" value="Generate"></input>
        </label>
      </form>
    </div>
  );
}

export default Wallet;
