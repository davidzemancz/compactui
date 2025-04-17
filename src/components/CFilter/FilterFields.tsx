import React from 'react';
import { FilterFieldProps, SelectOption } from './types';

export const TextField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <input
      type="text"
      value={value || ''}
      placeholder={field.placeholder}
      onChange={(e) => onChange(field.id, e.target.value)}
      className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
};

export const NumberField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <input
      type="number"
      value={value || ''}
      placeholder={field.placeholder}
      onChange={(e) => onChange(field.id, e.target.value ? Number(e.target.value) : null)}
      className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
};

export const DateField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
};

export const DateRangeField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  const [startDate, endDate] = Array.isArray(value) ? value : [null, null];
  
  return (
    <div className="flex space-x-2 w-full">
      <input
        type="date"
        value={startDate || ''}
        onChange={(e) => onChange(field.id, [e.target.value, endDate])}
        className="border border-gray-300 rounded px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Od"
      />
      <input
        type="date"
        value={endDate || ''}
        onChange={(e) => onChange(field.id, [startDate, e.target.value])}
        className="border border-gray-300 rounded px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Do"
      />
    </div>
  );
};

export const SelectField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="">- Vyberte -</option>
      {field.options?.map((option: SelectOption) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const BooleanField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <select
      value={value === null ? '' : value ? 'true' : 'false'}
      onChange={(e) => {
        const val = e.target.value === '' ? null : e.target.value === 'true';
        onChange(field.id, val);
      }}
      className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="">- Všechny -</option>
      <option value="true">Ano</option>
      <option value="false">Ne</option>
    </select>
  );
};
