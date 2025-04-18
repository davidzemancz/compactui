export type FilterFieldType = 'text' | 'date' | 'daterange' | 'select' | 'number' | 'boolean';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: SelectOption[];
  defaultValue?: any;
}

export interface FilterValues {
  [key: string]: any;
}

export interface CFilterProps {
  fields: FilterField[];
  onFilterApply: (values: FilterValues) => void;
  className?: string;
  applyOnChange?: boolean;
  required?: boolean;
}

export interface FilterFieldProps {
  field: FilterField;
  value: any;
  onChange: (id: string, value: any) => void;
}
