import React, { useState, useMemo, useRef, useEffect } from 'react';

// Types
export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool' | 'datetime';
export type SortDirection = 'asc' | 'desc' | null;
export type SelectionMode = 'single' | 'checkbox';

export interface Column {
  key: string;
  header: string;
  dataType?: ColumnDataType;
  sortable?: boolean;
  dateFormat?: string; // Format for datetime columns
}

export interface CTableProps {
  columns: Column[];
  data: any[];
  selectionMode?: SelectionMode;
  onSelectionChange?: (selectedIds: any[]) => void;
}

// Utility functions
const formatCellValue = (value: any, dataType?: ColumnDataType, dateFormat?: string): React.ReactNode => {
  if (value === undefined || value === null) return '';
  
  switch (dataType) {
    case 'bool':
      return (
        <input 
          type="checkbox" 
          checked={Boolean(value)} 
          readOnly 
          style={{ cursor: 'default' }}
        />
      );
    case 'int':
      return Number.isInteger(value) ? value.toString() : value;
    case 'decimal':
      return typeof value === 'number' ? value.toFixed(2) : value;
    case 'datetime':
      try {
        // Parse the datetime string
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return value; // Return original value if parsing fails
        }
        
        // Format the date according to provided format or default format
        const format = dateFormat || 'dd.MM.yyyy HH:mm';
        return formatDate(date, format);
      } catch (error) {
        return value; // Return original value if formatting fails
      }
    case 'string':
    default:
      return value.toString();
  }
};

// Helper function to format date according to format string
const formatDate = (date: Date, format: string): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year.toString())
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
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
  columnOrder: string[];
  onColumnReorder: (dragIndex: number, hoverIndex: number) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  columns, 
  sortConfig, 
  onSort, 
  selectionMode, 
  selectedIds, 
  data, 
  onSelectAll,
  columnOrder,
  onColumnReorder
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
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.currentTarget.style.opacity = '0.4';
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.style.backgroundColor = '#f5f5f5';
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.style.backgroundColor = '';
  };
  
  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';
    
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      onColumnReorder(dragItem.current, dragOverItem.current);
    }
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.style.opacity = '1';
    dragItem.current = null;
    dragOverItem.current = null;
  };
  
  // Get columns in the order defined by columnOrder
  const orderedColumns = [...columns].sort((a, b) => {
    return columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key);
  });
  
  return (
    <thead>
      <tr>
        {selectionMode === 'checkbox' && (
          <th>
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </th>
        )}
        {orderedColumns.map((column, index) => (
          <th 
            key={column.key} 
            style={{ 
              cursor: column.sortable ? 'pointer' : 'default',
              textAlign: getAlignmentType(column.dataType) as any,
              userSelect: 'none'
            }}
            onClick={() => onSort(column.key)}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
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
  columnOrder: string[];
}

const TableBody: React.FC<TableBodyProps> = ({ 
  columns, 
  data, 
  selectionMode, 
  selectedIds, 
  onSelectRow,
  columnOrder
}) => {
  // Get columns in the order defined by columnOrder
  const orderedColumns = [...columns].sort((a, b) => {
    return columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key);
  });
  
  return (
    <tbody>
      {data.map((row) => {
        const rowId = row.id;
        const isSelected = selectedIds.includes(rowId);
        
        return (
          <tr 
            key={rowId}
            style={{ 
              backgroundColor: isSelected && selectionMode === 'single' ? '#e6f7ff' : undefined,
            }}
            onClick={() => selectionMode === 'single' && onSelectRow(rowId)}
          >
            {selectionMode === 'checkbox' && (
              <td 
                style={{ textAlign: 'center', cursor: 'pointer' }}
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
            {orderedColumns.map((column) => (
              <td 
                key={`${rowId}-${column.key}`}
                style={{ textAlign: getAlignmentType(column.dataType) as any }}
              >
                {formatCellValue(row[column.key], column.dataType, column.dateFormat)}
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

  // State to track column order
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  
  // Initialize column order when columns change
  useEffect(() => {
    setColumnOrder(columns.map(col => col.key));
  }, [columns]);
  
  // Handle column reordering
  const handleColumnReorder = (dragIndex: number, hoverIndex: number) => {
    const draggedColKey = columnOrder[dragIndex];
    const newColumnOrder = [...columnOrder];
    
    // Remove dragged item
    newColumnOrder.splice(dragIndex, 1);
    // Add it at the new position
    newColumnOrder.splice(hoverIndex, 0, draggedColKey);
    
    setColumnOrder(newColumnOrder);
  };

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
        case 'datetime':
          try {
            // Expect input format: 'yyyy-MM-dd HH:mm:ss'
            // Parse dates manually for consistent results
            const parseDate = (dateStr: string): Date => {
              const [datePart = '', timePart = ''] = dateStr.split(' ');
              const [year = '0', month = '0', day = '0'] = datePart.split('-');
              const [hours = '0', minutes = '0', seconds = '0'] = timePart.split(':');
              
              return new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1, // Month is 0-indexed in JS Date
                parseInt(day, 10),
                parseInt(hours, 10),
                parseInt(minutes, 10),
                parseInt(seconds, 10)
              );
            };
            
            const dateA = parseDate(String(aValue));
            const dateB = parseDate(String(bValue));
            
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              comparison = dateA.getTime() - dateB.getTime();
            } else {
              comparison = String(aValue).localeCompare(String(bValue));
            }
          } catch (error) {
            // Fallback to string comparison if date parsing fails
            comparison = String(aValue).localeCompare(String(bValue));
          }
          break;
        default:
          comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, searchTerm, sortConfig, columns]);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Vyhledat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '200px' }}
        />
      </div>
      
      <table style={{ borderCollapse: 'collapse' }}>
        <TableHeader 
          columns={columns} 
          sortConfig={sortConfig} 
          onSort={handleSort}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          data={filteredAndSortedData}
          onSelectAll={handleSelectAll}
          columnOrder={columnOrder}
          onColumnReorder={handleColumnReorder}
        />
        <TableBody 
          columns={columns} 
          data={filteredAndSortedData}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
          columnOrder={columnOrder}
        />
      </table>
      
      {filteredAndSortedData.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Nebyla nalezena žádná data
        </div>
      )}
    </div>
  );
};

export default CTable;
