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

export default function ResultsDisplay({ results }: { results: Results }) {
  if (!results) return null;

  const isProfit = results.netProfit >= 0;
  const profitColor = isProfit ? 'text-green-600' : 'text-red-600';
  const profitSign = isProfit ? '+' : '-';

  return (
    <div className="mt-6 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Trade Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Gross Result</h3>
          <p className={`text-3xl mt-2 ${results.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {results.grossProfit >= 0 ? '+' : ''}${Math.abs(results.grossProfit).toFixed(2)}
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Taxes</h3>
          <p className="text-3xl mt-2 text-red-500">${results.totalTaxes.toFixed(2)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Net Result</h3>
          <p className={`text-3xl mt-2 font-bold ${profitColor}`}>
            {profitSign}${Math.abs(results.netProfit).toFixed(2)}
          </p>
          <p className={`text-sm mt-1 ${profitColor}`}>
            {isProfit ? 'Profit' : 'Loss'} after taxes
          </p>
        </div>
      </div>
      
      {results.taxBreakdown && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Tax Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(results.taxBreakdown).map(([taxType, amount]) => (
              <div key={taxType} className="flex justify-between items-center">
                <span className="text-gray-600">{taxType}</span>
                <span className="font-medium text-red-500">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={`mt-6 p-4 rounded-lg ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className={`font-medium ${profitColor}`}>
          {isProfit ? (
            <>🎉 You made a net profit of <span className="font-bold">${results.netProfit.toFixed(2)}</span> after taxes!</>
          ) : (
            <>⚠️ You had a net loss of <span className="font-bold">${Math.abs(results.netProfit).toFixed(2)}</span> after taxes.</>
          )}
        </p>
      </div>
    </div>
  );
}