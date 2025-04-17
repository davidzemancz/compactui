import React, { useState, useMemo } from 'react';

// Types
export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool';
export type SortDirection = 'asc' | 'desc' | null;
export type SelectionMode = 'none' | 'single' | 'checkbox';

export interface Column {
  key: string;
  header: string;
  dataType?: ColumnDataType;
  sortable?: boolean;
}

export interface CTableProps {
  columns: Column[];
  data: any[];
  selectionMode?: SelectionMode;
  onSelectionChange?: (selectedIds: any[]) => void;
  idField?: string;
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
  selectionMode: SelectionMode;
  selectedIds: any[];
  data: any[];
  idField: string;
  onSelectAll: (selected: boolean) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  columns, 
  sortConfig, 
  onSort, 
  selectionMode, 
  selectedIds, 
  data, 
  idField, 
  onSelectAll 
}) => {
  const getSortIndicator = (columnKey: string): string => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  
  return (
    <thead>
      <tr>
        {selectionMode === 'checkbox' && (
          <th style={{ width: '40px', textAlign: 'center' }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </th>
        )}
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
  selectionMode: SelectionMode;
  selectedIds: any[];
  idField: string;
  onSelectRow: (id: any, selected?: boolean) => void;
}

const TableBody: React.FC<TableBodyProps> = ({ 
  columns, 
  data, 
  selectionMode, 
  selectedIds, 
  idField, 
  onSelectRow 
}) => {
  return (
    <tbody>
      {data.map((row) => {
        const rowId = row[idField];
        const isSelected = selectedIds.includes(rowId);
        
        return (
          <tr 
            key={rowId}
            style={{ 
              backgroundColor: isSelected && selectionMode === 'single' ? '#e6f7ff' : undefined,
              cursor: selectionMode !== 'none' ? 'pointer' : undefined
            }}
            onClick={() => selectionMode === 'single' && onSelectRow(rowId)}
          >
            {selectionMode === 'checkbox' && (
              <td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onSelectRow(rowId, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
            )}
            {columns.map((column) => (
              <td 
                key={`${rowId}-${column.key}`}
                style={getAlignmentByDataType(column.dataType)}
              >
                {formatCellValue(row[column.key], column.dataType)}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

// Main component
export const CTable: React.FC<CTableProps> = ({ 
  columns, 
  data,
  selectionMode = 'none',
  onSelectionChange,
  idField = 'id'
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: '', direction: null });
  
  const [selectedIds, setSelectedIds] = useState<any[]>([]);

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

  const handleSelectRow = (id: any, selected?: boolean) => {
    if (selectionMode === 'single') {
      const newSelectedIds = [id];
      setSelectedIds(newSelectedIds);
      onSelectionChange?.(newSelectedIds);
    } else if (selectionMode === 'checkbox') {
      let newSelectedIds: any[];
      
      if (selected === undefined) {
        // Toggle selection
        newSelectedIds = selectedIds.includes(id) 
          ? selectedIds.filter(selId => selId !== id)
          : [...selectedIds, id];
      } else {
        // Explicit selection state
        newSelectedIds = selected
          ? [...selectedIds.filter(selId => selId !== id), id]
          : selectedIds.filter(selId => selId !== id);
      }
      
      setSelectedIds(newSelectedIds);
      onSelectionChange?.(newSelectedIds);
    }
  };

  const handleSelectAll = (selected: boolean) => {
    const newSelectedIds = selected ? sortedData.map(row => row[idField]) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  return (
    <div>
      <table >
        <TableHeader 
          columns={columns} 
          sortConfig={sortConfig} 
          onSort={handleSort}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          data={sortedData}
          idField={idField}
          onSelectAll={handleSelectAll}
        />
        <TableBody 
          columns={columns} 
          data={sortedData}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          idField={idField}
          onSelectRow={handleSelectRow}
        />
      </table>
    </div>
  );
};

export default CTable;
