import { useState } from "react";
import server from "./server";

import { signMessage, ACCOUNTS_ADDRESS } from './utils';

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!address) {
      alert("Please select an address");
      return;
    }

    if (!recipient) {
      alert("Please select a recipient");
      return;
    }

    if (!sendAmount || isNaN(sendAmount) || sendAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (address === recipient) {
      alert("You cannot send to yourself");
      return;
    }

    const message = {
      amount: parseInt(sendAmount),
      recipient,
      address
    }

    const signature = await signMessage(address, message);

    const transaction = {
      message,
      signature,
    };
    
    console.log("🚀 ~ file: Transfer.jsx:43 ~ transfer ~ transaction:", transaction)

    try {
      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
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
        ></input>
      </label>

      <label>
        Recipient
        <select onChange={setValue(setRecipient)} value={recipient}>
          <option value="">Select Recipient</option>
          {ACCOUNTS_ADDRESS.map((a, i) => (
            <option key={i} value={a}>
              {a.slice(0, 12) + '...' + a.slice(-4)}
            </option>
          ))}
        </select>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
