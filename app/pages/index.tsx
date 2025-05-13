import { useState } from 'react';
import CountrySelector from '../components/countrySelector';
import ResultsDisplay from '../components/resultDisplay';

export default function Home() {
  const [country, setCountry] = useState('');
  const [results, setResults] = useState(null);

  const calculateProfit = async () => {
    // Call API route to calculate profit after taxes
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country }),
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crypto Profit Calculator</h1>
  
      <CountrySelector selectedCountry={country} onSelect={setCountry} />
  
      <button
        onClick={calculateProfit}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        disabled={!country}
      >
        Calculate Profit After Taxes
      </button>
  
      {results && <ResultsDisplay results={results} />}
    </div>
  );
  
}