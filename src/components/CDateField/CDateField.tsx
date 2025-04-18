import React from 'react';

export interface CDateFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const CDateField: React.FC<CDateFieldProps> = ({ 
  value, 
  onChange, 
  className = "",
  placeholder,
  disabled = false
}) => {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      placeholder={placeholder}
      disabled={disabled}
      className={`border border-gray-300 rounded px-2 py-1 w-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
  );
};

export default CDateField;
