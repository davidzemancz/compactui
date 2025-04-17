import React, { useState, useMemo, useRef, useEffect } from 'react';

// Types
export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool';
export type SortDirection = 'asc' | 'desc' | null;
export type SelectionMode = 'single' | 'checkbox';

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
}

// Utility functions
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

// Header component
interface TableHeaderProps {
  columns: Column[];
  sortConfig: { key: string; direction: SortDirection };
  onSort: (key: string) => void;
  selectionMode: SelectionMode;
  selectedIds: any[];
  data: any[];
  onSelectAll: (selected: boolean) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  columns, 
  sortConfig, 
  onSort, 
  selectionMode, 
  selectedIds, 
  data, 
  onSelectAll 
}) => {
  const getSortIndicator = (columnKey: string): string => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;
  
  const checkboxRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);
  
  return (
    <thead>
      <tr>
        {selectionMode === 'checkbox' && (
          <th className="ctable-checkbox-header">
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </th>
        )}
        {columns.map((column) => (
          <th 
            key={column.key}
            className={`ctable-header ${column.sortable ? 'ctable-sortable' : ''}`}
            data-align={getAlignmentType(column.dataType)}
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

// Helper function to get alignment type for className
const getAlignmentType = (dataType?: ColumnDataType): string => {
  switch (dataType) {
    case 'int':
    case 'decimal':
      return 'right';
    case 'bool':
      return 'center';
    default:
      return 'left';
  }
};

// Body component
interface TableBodyProps {
  columns: Column[];
  data: any[];
  selectionMode: SelectionMode;
  selectedIds: any[];
  onSelectRow: (id: any, selected?: boolean) => void;
}

const TableBody: React.FC<TableBodyProps> = ({ 
  columns, 
  data, 
  selectionMode, 
  selectedIds, 
  onSelectRow 
}) => {
  return (
    <tbody>
      {data.map((row) => {
        const rowId = row.id;
        const isSelected = selectedIds.includes(rowId);
        
        return (
          <tr 
            key={rowId}
            className={`ctable-row ${isSelected && selectionMode === 'single' ? 'ctable-row-selected' : ''}`}
            onClick={() => selectionMode === 'single' && onSelectRow(rowId)}
          >
            {selectionMode === 'checkbox' && (
              <td 
                className="ctable-checkbox-cell"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRow(rowId, !isSelected);
                }}
              >
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
                className="ctable-cell"
                data-align={getAlignmentType(column.dataType)}
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
  selectionMode = 'single',
  onSelectionChange
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: '', direction: null });
  
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sorting handlers
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

  // Selection handlers  
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
    const newSelectedIds = selected ? filteredAndSortedData.map(row => row.id) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  // Compute filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    // First filter the data based on search term
    let filteredData = [...data];
    
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      
      filteredData = filteredData.filter(row => {
        // Search through all column values for this row
        return columns.some(column => {
          const value = row[column.key];
          if (value == null) return false;
          return String(value).toLowerCase().includes(lowerSearchTerm);
        });
      });
    }
    
    // Then sort the filtered data
    if (!sortConfig.direction) return filteredData;

    const sortableItems = [...filteredData];
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
  }, [data, searchTerm, sortConfig, columns]);

  return (
    <div className="ctable-wrapper">
      <div className="ctable-search">
        <input
          type="text"
          className="ctable-search-input"
          placeholder="Vyhledat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="ctable">
        <TableHeader 
          columns={columns} 
          sortConfig={sortConfig} 
          onSort={handleSort}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          data={filteredAndSortedData}
          onSelectAll={handleSelectAll}
        />
        <TableBody 
          columns={columns} 
          data={filteredAndSortedData}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
        />
      </table>
      {filteredAndSortedData.length === 0 && (
        <div className="ctable-no-data">
          Nebyla nalezena žádná data
        </div>
      )}
    </div>
  );
};

export default CTable;
