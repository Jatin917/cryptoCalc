import { useState, useEffect } from 'react';

interface TradeTimeSelectorProps {
  buyingTime: string;
  sellingTime: string;
  onBuyTimeChange: (buyingTime: string) => void;
  onSellTimeChange: (sellingTime: string) => void;
  minInterval?: number;
}

export default function TradeTimeSelector({
  buyingTime,
  sellingTime,
  onBuyTimeChange,
  onSellTimeChange,
  minInterval = 15,
}: TradeTimeSelectorProps) {
  const now = new Date();
  now.setSeconds(0, 0);

  const safeBuyingTime = buyingTime || now.toISOString();
  const safeSellingTime = sellingTime || now.toISOString();

  const [showPicker, setShowPicker] = useState<'buy' | 'sell' | null>(null);
  const [localDate, setLocalDate] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!buyingTime) onBuyTimeChange(now.toISOString());
    if (!sellingTime) onSellTimeChange(now.toISOString());
  }, []);

const updateLocalDateTime = (isoString: string) => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return;
  
  // Get local date components without timezone conversion
  const localDateStr = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
  
  setLocalDate(localDateStr);
  
  setLocalTime(
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(/^24/, '00')
  );
};

  const handleDateTimeChange = (type: 'buy' | 'sell') => {
    setError("");

    if (!localDate || !localTime) {
      setError("Please select both date and time");
      return;
    }

    const [hours, minutes] = localTime.split(':').map(Number);
    const date = new Date(localDate);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0, 0);

    const now = new Date();
    now.setSeconds(0, 0);

    if (date > now) {
      setError("Cannot select future time");
      return;
    }

    if (date < new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)) {
      setError("Cannot select time older than 1 year");
      return;
    }

    const updatedISO = date.toISOString();
    if (type === 'buy') {
      onBuyTimeChange(updatedISO);
    } else {
      onSellTimeChange(updatedISO);
    }

    setShowPicker(null);
  };

  const formatDisplayTime = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}`;
  };

  return (
    <div className="mb-6 max-w-xl mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <button
            type="button"
            onClick={() => {
              updateLocalDateTime(safeBuyingTime);
              setShowPicker('buy');
              setError("");
            }}
            className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 hover:bg-gray-50"
          >
            <span className="block text-sm font-medium text-gray-700 mb-1">Buying Time</span>
            {formatDisplayTime(safeBuyingTime)}
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              updateLocalDateTime(safeSellingTime);
              setShowPicker('sell');
              setError("");
            }}
            className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 hover:bg-gray-50"
          >
            <span className="block text-sm font-medium text-gray-700 mb-1">Selling Time</span>
            {formatDisplayTime(safeSellingTime)}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select {showPicker === 'buy' ? 'Buying' : 'Selling'} Time
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Date</label>
                <input
                  type="date"
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Time (24h)</label>
                <input
                  type="time"
                  value={localTime}
                  onChange={(e) => setLocalTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  step={minInterval * 60}
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  now.setSeconds(0, 0);
                  updateLocalDateTime(now.toISOString());
                }}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
              >
                Set to Now
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPicker(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDateTimeChange(showPicker)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}