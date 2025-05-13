interface PriceVolumeSelectorProps {
  currencies: string[];
  volume: number;
  currency: string;
  setCurrency: (currency: string) => void;
  setVolume: (volume: number) => void;
  className?: string;
}

export default function PriceVolumeSelector({
  currencies,
  volume,
  currency,
  setCurrency,
  setVolume,
  className = "",
}: PriceVolumeSelectorProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {currencies && currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr.toUpperCase()}
              </option>
            ))}
          </select>
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(Math.max(1, Number(e.target.value)))}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

      </div>
    </div>
  );
}