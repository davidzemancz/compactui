import React from 'react';
import { ColumnDataType } from './types';

/**
 * Formats a Date object according to the specified format string
 * @param date - The Date object to format
 * @param format - Format string with placeholders: dd, MM, yyyy, HH, mm, ss
 * @returns A formatted date string
 */
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

/**
 * Formats cell value based on the specified data type
 * @param value - The cell value to format
 * @param dataType - The data type of the cell
 * @param dateFormat - Optional format string for datetime values
 * @returns Formatted cell value as a React node
 */
export const formatCellValue = (
  value: any, 
  dataType?: ColumnDataType, 
  dateFormat?: string
): React.ReactNode => {
  // Handle null/undefined values
  if (value === undefined || value === null) return '';
  
  switch (dataType) {
    case 'bool':
      return value ? 'Ano' : 'Ne';
    case 'int':
      // Ensure the value is displayed as an integer
      return Number.isInteger(Number(value)) ? Number(value).toString() : value;
    case 'decimal':
      // Format numeric values with 2 decimal places
      return typeof value === 'number' || !isNaN(Number(value)) 
        ? Number(value).toFixed(2) 
        : value;
    case 'datetime':
      try {
        // Try to parse the value as a date
        let date: Date;
        if (value instanceof Date) {
          date = value;
        } else if (typeof value === 'string') {
          date = new Date(value);
        } else {
          return value;
        }
        
        // If the date is invalid, return the original value
        if (isNaN(date.getTime())) return value;
        
        // Format the date according to the specified format or default
        return formatDate(date, dateFormat || 'dd.MM.yyyy HH:mm');
      } catch (error) {
        console.warn('Failed to format datetime value:', error);
        return value;
      }
    default:
      // For string and link types, return as string
      return String(value);
  }
};

/**
 * Determines the text alignment for a column based on its data type
 * @param dataType - The data type of the column
 * @returns The appropriate text alignment: 'left', 'right', or 'center'
 */
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
