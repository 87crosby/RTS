import React, { useState } from 'react';
import { getStockPrice } from '../api';
import { useAuth } from '../context/AuthContext';

function StockLookup() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPrice(null);

    const result = await getStockPrice(symbol, token);

    if (result.success) {
      setPrice(result.data.openPrice);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
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
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Fetching Price...' : 'Get Price'}
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
