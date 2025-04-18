import React from 'react';
import { SelectOption } from '../CFilter/types';

export interface CSelectFieldProps {
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

const CSelectField: React.FC<CSelectFieldProps> = ({ 
  value, 
  onChange, 
  options,
  placeholder = "Select",
  className = "" 
}) => {
  return (
    <select
      value={value === null ? '' : String(value)}
      onChange={(e) => onChange(e.target.value || null)}
      className={`border border-gray-300 rounded px-2 py-1 w-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CSelectField;
