
import React from 'react';
import { DCFResults } from '../types';
import CashFlowChart from './CashFlowChart';
import { Target, Building, PiggyBank as EquityIcon, LineChart } from 'lucide-react';

interface ResultsCardProps {
  results: DCFResults;
  companyName: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

const ValueDisplay: React.FC<{ icon: React.ReactNode; label: string; value: string; isPrimary?: boolean }> = ({ icon, label, value, isPrimary = false }) => (
    <div className={`p-4 rounded-lg flex items-center ${isPrimary ? 'bg-blue-50' : 'bg-gray-50'}`}>
        <div className={`mr-4 p-3 rounded-full ${isPrimary ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`font-bold ${isPrimary ? 'text-2xl text-blue-700' : 'text-xl text-gray-800'}`}>{value}</p>
        </div>
    </div>
);

const ResultsCard: React.FC<ResultsCardProps> = ({ results, companyName }) => {
  const { 
    intrinsicValuePerShare, 
    equityValue, 
    enterpriseValue, 
    projectedCashFlows,
    sumPvCashFlows,
    pvTerminalValue
  } = results;
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-1">Valuation for {companyName}</h2>
      <p className="text-gray-500 mb-6">All values are in Crores (₹)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ValueDisplay 
          icon={<Target size={24} />}
          label="Intrinsic Value Per Share"
          value={formatCurrency(intrinsicValuePerShare)}
          isPrimary={true}
        />
        <ValueDisplay 
          icon={<EquityIcon size={24} />}
          label="Total Equity Value"
          value={formatCurrency(equityValue)}
          isPrimary={true}
        />
        <ValueDisplay 
          icon={<Building size={24} />}
          label="Enterprise Value"
          value={formatCurrency(enterpriseValue)}
        />
         <ValueDisplay 
          icon={<LineChart size={24} />}
          label="PV of Terminal Value"
          value={formatCurrency(pvTerminalValue)}
        />
      </div>
      
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Discounted Cash Flow Analysis</h3>
        <p className="text-sm text-gray-600 mb-4">
          The chart below visualizes the projected Free Cash Flow (FCF) for each year and its corresponding Present Value (PV) after discounting. The sum of these present values, plus the present value of the terminal value, determines the Enterprise Value.
        </p>
        <div className="h-80 w-full bg-gray-50 p-4 rounded-lg">
          <CashFlowChart data={projectedCashFlows} />
        </div>
        <div className="mt-4 text-sm text-center text-gray-500">
          Sum of PV of FCFs: <span className="font-semibold">{formatCurrency(sumPvCashFlows)} Cr</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
