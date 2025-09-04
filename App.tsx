import React, { useState, useCallback } from 'react';
import { DCFInputs, DCFResults } from './types';
import InputGroup from './components/InputGroup';
import NumberInput from './components/NumberInput';
import ResultsCard from './components/ResultsCard';
import { IndianRupee, Briefcase, BarChart2, TrendingUp, Percent, Hash, PiggyBank, PieChart } from 'lucide-react';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<DCFInputs>({
    companyName: 'Example Ltd.',
    currentFCF: 1000,
    growthRate: 15,
    projectionYears: 5,
    wacc: 12,
    terminalGrowthRate: 5,
    debt: 5000,
    cash: 2000,
    sharesOutstanding: 100,
  });

  const [results, setResults] = useState<DCFResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof DCFInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setResults(null); // Reset results on input change
    setError(null);
  };

  const calculateDCF = useCallback(() => {
    setError(null);
    const {
      currentFCF,
      growthRate: g,
      projectionYears,
      wacc: r,
      terminalGrowthRate: tg,
      debt,
      cash,
      sharesOutstanding
    } = inputs;

    if (r <= tg) {
      setError("WACC must be greater than the Terminal Growth Rate to calculate Terminal Value.");
      return;
    }
    
    if (sharesOutstanding <= 0) {
      setError("Shares Outstanding must be a positive number.");
      return;
    }

    const growthRate = g / 100;
    const wacc = r / 100;
    const terminalGrowthRate = tg / 100;

    let projectedCashFlows = [];
    let sumPvCashFlows = 0;

    for (let i = 1; i <= projectionYears; i++) {
      const projectedFCF = currentFCF * Math.pow(1 + growthRate, i);
      const presentValue = projectedFCF / Math.pow(1 + wacc, i);
      sumPvCashFlows += presentValue;
      projectedCashFlows.push({ year: i, projectedFCF, presentValue });
    }

    const lastProjectedFCF = currentFCF * Math.pow(1 + growthRate, projectionYears);
    const terminalValue = (lastProjectedFCF * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
    const pvTerminalValue = terminalValue / Math.pow(1 + wacc, projectionYears);

    const enterpriseValue = sumPvCashFlows + pvTerminalValue;
    const equityValue = enterpriseValue - debt + cash;
    const intrinsicValuePerShare = equityValue / sharesOutstanding;

    setResults({
      enterpriseValue,
      equityValue,
      intrinsicValuePerShare,
      projectedCashFlows,
      pvTerminalValue,
      sumPvCashFlows
    });
  }, [inputs]);

  const handleReset = () => {
    setInputs({
      companyName: '',
      currentFCF: 0,
      growthRate: 0,
      projectionYears: 5,
      wacc: 0,
      terminalGrowthRate: 0,
      debt: 0,
      cash: 0,
      sharesOutstanding: 0,
    });
    setResults(null);
    setError(null);
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
            Discounted Cash Flow (DCF) Calculator
          </h1>
          <p className="text-lg text-gray-600 mt-2">For Indian Companies (Valuation in ₹ Crores)</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Financial Inputs</h2>

            <div className="space-y-6">
              <InputGroup title="Company & Cash Flow">
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={inputs.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Company Name"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium placeholder:text-gray-400"
                  />
                </div>
                <NumberInput
                  label="Current Year Free Cash Flow (FCF in Cr)"
                  value={inputs.currentFCF}
                  onChange={(val) => handleInputChange('currentFCF', val)}
                  icon={<IndianRupee className="h-5 w-5 text-gray-400" />}
                  tooltip="The cash a company generates after accounting for cash outflows to support operations and maintain its capital assets."
                />
              </InputGroup>
              
              <InputGroup title="Growth & Projections">
                <NumberInput
                    label="FCF Growth Rate (%)"
                    value={inputs.growthRate}
                    onChange={(val) => handleInputChange('growthRate', val)}
                    icon={<TrendingUp className="h-5 w-5 text-gray-400" />}
                    tooltip="The expected annual growth rate of the Free Cash Flow during the projection period."
                />
                <NumberInput
                    label="Projection Period (Years)"
                    value={inputs.projectionYears}
                    onChange={(val) => handleInputChange('projectionYears', val)}
                    icon={<BarChart2 className="h-5 w-5 text-gray-400" />}
                    tooltip="Number of years to forecast future cash flows."
                />
              </InputGroup>

              <InputGroup title="Discount & Terminal Value">
                 <NumberInput
                    label="Weighted Average Cost of Capital (WACC %)"
                    value={inputs.wacc}
                    onChange={(val) => handleInputChange('wacc', val)}
                    icon={<Percent className="h-5 w-5 text-gray-400" />}
                    tooltip="The average rate of return a company is expected to provide to all its security holders. Used as the discount rate."
                />
                <NumberInput
                    label="Perpetual Growth Rate (%)"
                    value={inputs.terminalGrowthRate}
                    onChange={(val) => handleInputChange('terminalGrowthRate', val)}
                    icon={<TrendingUp className="h-5 w-5 text-gray-400" />}
                    tooltip="The constant rate at which the company's FCF is expected to grow forever after the projection period. Often tied to long-term inflation or GDP growth."
                />
              </InputGroup>

              <InputGroup title="Balance Sheet Items">
                <NumberInput
                    label="Total Debt (in Cr)"
                    value={inputs.debt}
                    onChange={(val) => handleInputChange('debt', val)}
                    icon={<IndianRupee className="h-5 w-5 text-gray-400" />}
                    tooltip="The company's total outstanding debt."
                />
                <NumberInput
                    label="Cash & Equivalents (in Cr)"
                    value={inputs.cash}
                    onChange={(val) => handleInputChange('cash', val)}
                    icon={<PiggyBank className="h-5 w-5 text-gray-400" />}
                    tooltip="The company's cash and other liquid assets."
                />
                <NumberInput
                    label="Shares Outstanding (in Cr)"
                    value={inputs.sharesOutstanding}
                    onChange={(val) => handleInputChange('sharesOutstanding', val)}
                    icon={<Hash className="h-5 w-5 text-gray-400" />}
                    tooltip="Total number of a company's shares currently held by all its shareholders."
                />
              </InputGroup>
            </div>

            <div className="mt-8 flex items-center space-x-4">
              <button
                onClick={calculateDCF}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
              >
                Calculate Intrinsic Value
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-3">
             {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
             )}
            {results ? (
              <ResultsCard results={results} companyName={inputs.companyName} />
            ) : (
                <div className="h-full flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
                    <PieChart className="w-24 h-24 text-gray-300 mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-600">Awaiting Calculation</h3>
                    <p className="text-gray-500 mt-2 max-w-sm">Enter your financial data in the panel on the left and click 'Calculate' to see the valuation results and cash flow analysis.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;