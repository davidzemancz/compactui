import React from 'react';

export interface CNumberFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
}

const CNumberField: React.FC<CNumberFieldProps> = ({ 
  value, 
  onChange, 
  placeholder,
  className = ""
}) => {
  return (
    <input
      type="number"
      value={value === null ? '' : value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      className={`border border-gray-300 rounded px-2 py-1 w-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    />
  );
};

export default CNumberField;
