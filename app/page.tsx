"use client";
import './globals.css'
import { useEffect, useState } from 'react';
import CountrySelector from './components/countrySelector';
import ResultsDisplay from './components/resultDisplay';
import taxRuleData from './libs/taxRule.json';
import currencyData from './libs/supportedCurrency.json';
import TradeTimeSelector from './components/timeSelector';
import PriceVolumeSelector from './components/priceVolumeSelector';

interface Results {
  grossProfit: number;
  netProfit: number;
  totalTaxes: number;
  isLongTerm: boolean;
  taxRate: number;
  taxBreakdown: {
    [taxType: string]: number;
  };
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  holdingPeriod: number;
  country: string;
}

export default function Home() {
  const [country, setCountry] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [toTime, setToTime] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [volume, setVolume] = useState<number>(1);
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('btc');
  const [isLoading, setIsLoading] = useState(false);

  function getUnixTimeFromIST(istDateTime: string): number {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(new Date(istDateTime).getTime() + istOffset);
    return istDate.getTime();
  }

  const calculateHoldingPeriod = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.abs(endTime - startTime) / (30 * 24 * 60 * 60 * 1000);
  };

  const calculateProfit = () => {
    if (!country) {
      alert("Please select a country");
      return;
    }

    const grossProfit = (sellPrice - buyPrice) * volume;

    if (grossProfit < 0) {
      setResults({
        grossProfit,
        netProfit: grossProfit,
        totalTaxes: 0,
        isLongTerm: false,
        taxRate: 0,
        taxBreakdown: {},
        buyPrice,
        sellPrice,
        quantity: volume,
        holdingPeriod: calculateHoldingPeriod(fromTime, toTime),
        country,
      });
      return;
    }

    const holdingPeriodMonths = calculateHoldingPeriod(fromTime, toTime);
    const isLongTerm = holdingPeriodMonths >= taxRuleData[country].longTermThresholdMonths;
    const taxRate = isLongTerm
      ? taxRuleData[country].longTermRate
      : taxRuleData[country].shortTermRate ?? taxRuleData[country].flatTaxRate;

    const totalTaxes = grossProfit * taxRate;
    const netProfit = grossProfit - totalTaxes;

    setResults({
      grossProfit,
      netProfit,
      totalTaxes,
      isLongTerm,
      taxRate,
      taxBreakdown: {
        [isLongTerm ? "Long-Term Capital Gains" : "Short-Term Capital Gains"]: totalTaxes,
      },
      buyPrice,
      sellPrice,
      quantity: volume,
      holdingPeriod: holdingPeriodMonths,
      country,
    });
  };

  const getBuyingAndSellingPrice = async () => {
    if (!country) {
      alert("Please select a country first");
      return;
    }

    if (!fromTime || !toTime) {
      alert("Please select both buying and selling times");
      return;
    }

    const toTimeInUnix = getUnixTimeFromIST(toTime);
    const fromTimeInUnix = getUnixTimeFromIST(fromTime);

    if (toTimeInUnix - fromTimeInUnix < 0) {
      alert("Selling time must be after buying time");
      return;
    }

    setIsLoading(true);
    try {
      const [buyingPriceRes, sellingPriceRes] = await Promise.all([
        fetch(`/api/binance?time=${fromTimeInUnix}`),
        fetch(`/api/binance?time=${to}`),
      ]);

      const [buyingPrice, sellingPrice] = await Promise.all([
        buyingPriceRes.json(),
        sellingPriceRes.json(),
      ]);

      setBuyPrice(Number(buyingPrice[0][1]));
      setSellPrice(Number(sellingPrice[0][1]));
      calculateProfit()
    } catch (err) {
      console.error("Error fetching price data:", err);
      alert("Failed to fetch price data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (buyPrice > 0 && sellPrice > 0) {
      calculateProfit();
    }
  }, [buyPrice, sellPrice, volume, country]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Crypto Tax Calculator</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <CountrySelector
            countries={Object.keys(taxRuleData)}
            selectedCountry={country}
            onSelect={setCountry}
          />

          <TradeTimeSelector
            buyingTime={fromTime}
            sellingTime={toTime}
            onBuyTimeChange={setFromTime}
            onSellTimeChange={setToTime}
          />

          <PriceVolumeSelector
            currencies={currencyData}
            volume={volume}
            currency={currency}
            setCurrency={setCurrency}
            setVolume={setVolume}
          />

          <button
            onClick={getBuyingAndSellingPrice}
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Calculating..." : "Calculate Profit After Taxes"}
          </button>
        </div>

        {results && <ResultsDisplay results={results} />}
      </div>
    </main>
  );
}