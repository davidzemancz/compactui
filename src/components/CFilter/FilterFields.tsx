import React from 'react';
import { FilterFieldProps } from './types';
import CTextInput from '../CTextInput';
import CNumberField from '../CNumberField/CNumberField';
import CDateField from '../CDateField/CDateField';
import CDateRangeField from '../CDateRangeField/CDateRangeField';
import CSelectField from '../CSelectField/CSelectField';
import CBooleanField from '../CBooleanField/CBooleanField';

export const TextField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <CTextInput
      value={value || ''}
      onChange={(newValue) => onChange(field.id, newValue)}
      placeholder={field.placeholder}
      className="w-full"
    />
  );
};

export const NumberField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <CNumberField
      value={value}
      onChange={(newValue) => onChange(field.id, newValue)}
      placeholder={field.placeholder}
    />
  );
};

export const DateField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <CDateField
      value={value}
      onChange={(newValue) => onChange(field.id, newValue)}
    />
  );
};

export const DateRangeField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <CDateRangeField
      value={value}
      onChange={(newValue) => onChange(field.id, newValue)}
    />
  );
};

export const SelectField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <CSelectField
      value={value}
      onChange={(newValue) => onChange(field.id, newValue)}
      options={field.options || []}
      placeholder="- Vyberte -"
    />
  );
};

export const BooleanField: React.FC<FilterFieldProps> = ({ field, value, onChange }) => {
  return (
    <CBooleanField
      value={value}
      onChange={(newValue) => onChange(field.id, newValue)}
    />
  );
};
