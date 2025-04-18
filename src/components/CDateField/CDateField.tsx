import React from 'react';

export interface CDateFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

const CDateField: React.FC<CDateFieldProps> = ({ 
  value, 
  onChange, 
  className = "" 
}) => {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className={`border border-gray-300 rounded px-2 py-1 w-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    />
  );
};

export default CDateField;
