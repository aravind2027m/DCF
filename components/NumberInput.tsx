import React from 'react';
import { Info } from 'lucide-react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  tooltip?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, icon, tooltip }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        {label}
        {tooltip && (
          <div className="relative group flex items-center ml-2">
            <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
            <div className="absolute bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
              {tooltip}
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium`}
          step="any"
        />
      </div>
    </div>
  );
};

export default NumberInput;