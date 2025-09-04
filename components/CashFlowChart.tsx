
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProjectedCashFlow } from '../types';

interface CashFlowChartProps {
  data: ProjectedCashFlow[];
}

const formatCurrencyForChart = (value: number) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value.toFixed(0)}`;
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(value) + ' Cr';
      
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{`Year ${label}`}</p>
        <p className="text-indigo-600">{`Projected FCF: ${formatCurrency(payload[0].value)}`}</p>
        <p className="text-teal-600">{`Present Value: ${formatCurrency(payload[1].value)}`}</p>
      </div>
    );
  }

  return null;
};

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="year" tickFormatter={(tick) => `Year ${tick}`} />
        <YAxis tickFormatter={formatCurrencyForChart} />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} />
        <Legend />
        <Bar dataKey="projectedFCF" fill="#4f46e5" name="Projected FCF" />
        <Bar dataKey="presentValue" fill="#14b8a6" name="Present Value of FCF" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashFlowChart;
