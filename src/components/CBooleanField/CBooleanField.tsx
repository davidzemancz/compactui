import React from 'react';

export interface CBooleanFieldProps {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  className?: string;
}

const CBooleanField: React.FC<CBooleanFieldProps> = ({ 
  value, 
  onChange, 
  className = "" 
}) => {
  return (
    <select
      value={value === null ? '' : value ? 'true' : 'false'}
      onChange={(e) => {
        const val = e.target.value === '' ? null : e.target.value === 'true';
        onChange(val);
      }}
      className={`border border-gray-300 rounded px-2 py-1 w-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    >
      <option value="">- Všechny -</option>
      <option value="true">Ano</option>
      <option value="false">Ne</option>
    </select>
  );
};

export default CBooleanField;
