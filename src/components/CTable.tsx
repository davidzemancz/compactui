import React from 'react';

export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool';

export interface Column {
  key: string;
  header: string;
  dataType?: ColumnDataType;
}

export interface CTableProps {
  columns: Column[];
  data: any[];
}

export const CTable: React.FC<CTableProps> = ({
  columns,
  data,
}) => {
  const formatCellValue = (value: any, dataType?: ColumnDataType) => {
    if (value === undefined || value === null) return '';
    
    switch (dataType) {
      case 'bool':
        return value ? 'True' : 'False';
      case 'int':
        return Number.isInteger(value) ? value.toString() : value;
      case 'decimal':
        return typeof value === 'number' ? value.toFixed(2) : value;
      case 'string':
      default:
        return value.toString();
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={`${rowIndex}-${column.key}`}>
                  {formatCellValue(row[column.key], column.dataType)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CTable;
