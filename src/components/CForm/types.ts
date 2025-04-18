import { ReactNode } from 'react';

export type FieldType = 'text' | 'number' | 'select' | 'date' | 'daterange' | 'boolean' | 'custom';

export type FieldState = 'default' | 'error' | 'success' | 'warning' | 'loading';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormField {
  id: string;
  name: string;
  type: FieldType;
  value: any;
  onChange: (value: any) => void;
  state?: FieldState;
  stateMessage?: string;
  help?: string | ReactNode;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  customField?: ReactNode;
}

export interface CFormProps {
  fields: FormField[];
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
}
