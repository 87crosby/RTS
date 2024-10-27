import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function StockLookup() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/api/stock/${symbol}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPrice(response.data.openPrice);
      setError('');
    } catch (err) {
      setError('Failed to fetch stock price');
      setPrice(null);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Stock Price Lookup</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="symbol" className="form-label">Stock Symbol</label>
          <input
            id="symbol"
            type="text"
            className="form-control"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol (e.g., AAPL)"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Get Price
        </button>
      </form>
      {price !== null && (
        <div className="mt-3">
          <h4>Opening Price: ${price}</h4>
        </div>
      )}
    </div>
  );
}

export default StockLookup;
