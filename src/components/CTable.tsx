import React, { useState, useMemo } from 'react';

// Types
export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool';
export type SortDirection = 'asc' | 'desc' | null;

export interface Column {
  key: string;
  header: string;
  dataType?: ColumnDataType;
  sortable?: boolean;
}

export interface CTableProps {
  columns: Column[];
  data: any[];
}

// Helper functions
const formatCellValue = (value: any, dataType?: ColumnDataType): string => {
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

const getAlignmentByDataType = (dataType?: ColumnDataType): React.CSSProperties => {
  switch (dataType) {
    case 'int':
    case 'decimal':
      return { textAlign: 'right' };
    case 'bool':
      return { textAlign: 'center' };
    default:
      return { textAlign: 'left' };
  }
};

// Sub-components
interface TableHeaderProps {
  columns: Column[];
  sortConfig: {
    key: string;
    direction: SortDirection;
  };
  onSort: (key: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns, sortConfig, onSort }) => {
  const getSortIndicator = (columnKey: string): string => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th 
            key={column.key}
            style={{
              ...getAlignmentByDataType(column.dataType),
              cursor: column.sortable ? 'pointer' : 'default'
            }}
            onClick={() => onSort(column.key)}
          >
            {column.header}
            {getSortIndicator(column.key)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

interface TableBodyProps {
  columns: Column[];
  data: any[];
}

const TableBody: React.FC<TableBodyProps> = ({ columns, data }) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => (
            <td 
              key={`${rowIndex}-${column.key}`}
              style={getAlignmentByDataType(column.dataType)}
            >
              {formatCellValue(row[column.key], column.dataType)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

// Main component
export const CTable: React.FC<CTableProps> = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: '', direction: null });

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        const direction = prevConfig.direction === 'asc' ? 'desc' : 
                          prevConfig.direction === 'desc' ? null : 'asc';
        return { key, direction };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.direction) return [...data];

    const sortableItems = [...data];
    const column = columns.find(col => col.key === sortConfig.key);
    
    return sortableItems.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

      // Sort based on data type
      let comparison = 0;
      switch (column?.dataType) {
        case 'int':
        case 'decimal':
          comparison = Number(aValue) - Number(bValue);
          break;
        case 'bool':
          comparison = (aValue === bValue) ? 0 : aValue ? 1 : -1;
          break;
        default:
          comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, columns]);

  return (
    <div>
      <table>
        <TableHeader 
          columns={columns} 
          sortConfig={sortConfig} 
          onSort={handleSort} 
        />
        <TableBody 
          columns={columns} 
          data={sortedData} 
        />
      </table>
    </div>
  );
};

export default CTable;
