import { useState } from 'react';

export default function TransactionForm({ transactions, setTransactions }) {
  const [asset, setAsset] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  const addTransaction = () => {
    const newTransaction = {
      asset,
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      sellPrice: parseFloat(sellPrice),
    };
    setTransactions([...transactions, newTransaction]);
    // Reset form
    setAmount('');
    setBuyPrice('');
    setSellPrice('');
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Add Transactions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <select
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="BTC">Bitcoin</option>
          <option value="ETH">Ethereum</option>
          {/* Add more crypto assets */}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Buy Price (USD)"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Sell Price (USD)"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <button
        onClick={addTransaction}
        disabled={!amount || !buyPrice || !sellPrice}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Transaction
      </button>
      
      {transactions.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium">Your Transactions:</h3>
          <ul className="list-disc pl-5">
            {transactions.map((tx, index) => (
              <li key={index}>
                {tx.amount} {tx.asset} - Bought at ${tx.buyPrice}, Sold at ${tx.sellPrice}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}