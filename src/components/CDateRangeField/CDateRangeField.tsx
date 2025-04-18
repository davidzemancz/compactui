import React from 'react';

export interface CDateRangeFieldProps {
  value: [string | null, string | null] | null;
  onChange: (value: [string | null, string | null]) => void;
  className?: string;
}

const CDateRangeField: React.FC<CDateRangeFieldProps> = ({ 
  value, 
  onChange, 
  className = "" 
}) => {
  const [startDate, endDate] = Array.isArray(value) ? value : [null, null];
  
  return (
    <div className={`flex space-x-2 w-full ${className}`}>
      <input
        type="date"
        value={startDate || ''}
        onChange={(e) => onChange([e.target.value || null, endDate])}
        className="border border-gray-300 rounded px-2 py-1 w-1/2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="date"
        value={endDate || ''}
        onChange={(e) => onChange([startDate, e.target.value || null])}
        className="border border-gray-300 rounded px-2 py-1 w-1/2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

export default CDateRangeField;
