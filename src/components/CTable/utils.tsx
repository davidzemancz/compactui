import React from 'react';
import { ColumnDataType } from './types';

export const formatDate = (date: Date, format: string): string => {
  const parts = {
    dd: date.getDate().toString().padStart(2, '0'),
    MM: (date.getMonth() + 1).toString().padStart(2, '0'),
    yyyy: date.getFullYear().toString(),
    HH: date.getHours().toString().padStart(2, '0'),
    mm: date.getMinutes().toString().padStart(2, '0'),
    ss: date.getSeconds().toString().padStart(2, '0')
  };
  
  return format.replace(/dd|MM|yyyy|HH|mm|ss/g, match => parts[match as keyof typeof parts]);
};

export const formatCellValue = (
  value: any, 
  dataType?: ColumnDataType, 
  dateFormat?: string, 
  linkText?: string,
  onLinkClick?: (value: any) => void
): React.ReactNode => {
  if (value === undefined || value === null) return '';
  
  switch (dataType) {
    case 'bool':
      return (
        <label className="ctable-checkbox readonly-checkbox">
          <input type="checkbox" checked={Boolean(value)} readOnly />
          <span className="checkmark"></span>
        </label>
      );
    case 'int':
      return Number.isInteger(value) ? value.toString() : value;
    case 'decimal':
      return typeof value === 'number' ? value.toFixed(2) : value;
    case 'datetime':
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return formatDate(date, dateFormat || 'dd.MM.yyyy HH:mm');
      } catch {
        return value;
      }
    case 'link':
      return (
        <a 
          href="#" 
          className="ctable-link"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onLinkClick) onLinkClick(value);
          }}
        >
          {linkText || value}
        </a>
      );
    default:
      return value.toString();
  }
};

export const getAlignmentType = (dataType?: ColumnDataType): string => {
  switch (dataType) {
    case 'int':
    case 'decimal':
    case 'datetime':
      return 'right';
    case 'bool':
      return 'center';
    default:
      return 'left';
  }
};
