interface CountrySelectorProps {
  countries: string[];
  selectedCountry: string;
  onSelect: (country: string) => void;
  label?: string;
  className?: string;
}

export default function CountrySelector({
  countries,
  selectedCountry,
  onSelect,
  label = "Select your country",
  className = ""
}: CountrySelectorProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={selectedCountry}
          onChange={(e) => onSelect(e.target.value)}
          className="text-black block w-full px-4 py-3 pr-8 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
        >
          <option value="">Select a country</option>
          {countries && countries.map((country) => (
            <option 
              key={country} 
              value={country}
              className="text-gray-900"
            >
              {country}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}