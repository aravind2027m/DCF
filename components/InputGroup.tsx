
import React from 'react';

interface InputGroupProps {
  title: string;
  children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ title, children }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-600 border-b pb-2">{title}</h3>
      <div className="space-y-3 pl-2">
        {children}
      </div>
    </div>
  );
};

export default InputGroup;
