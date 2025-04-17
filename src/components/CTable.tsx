import React, { useState, useMemo, useRef, useEffect } from 'react';
import './CTable.css';

// Types
export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool' | 'datetime';
export type SortDirection = 'asc' | 'desc' | null;
export type SelectionMode = 'single' | 'checkbox';

export interface Column {
  key: string;
  header: string;
  dataType?: ColumnDataType;
  sortable?: boolean;
  dateFormat?: string;
  width?: number;
}

export interface CTableProps {
  columns: Column[];
  data: any[];
  selectionMode?: SelectionMode;
  onSelectionChange?: (selectedIds: any[]) => void;
  storageKey?: string; // Add storage key for persisting state
  compact?: boolean; // Add compact prop option
}

// Utility functions
const formatCellValue = (value: any, dataType?: ColumnDataType, dateFormat?: string): React.ReactNode => {
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
    default:
      return value.toString();
  }
};

const formatDate = (date: Date, format: string): string => {
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

const getAlignmentType = (dataType?: ColumnDataType): string => {
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
  columnWidths: Record<string, number>;
  onColumnResize: (columnKey: string, width: number) => void;
}

const TableHeader: React.FC<TableHeaderProps> = (props) => {
  const { 
    columns, sortConfig, onSort, selectionMode, 
    selectedIds, data, onSelectAll, columnOrder, 
    onColumnReorder, columnWidths, onColumnResize 
  } = props;
  
  const checkboxRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;
  
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);
  
  const getSortIndicator = (columnKey: string): string => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };
  
  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';
    
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      onColumnReorder(dragItem.current, dragOverItem.current);
    }
  };
  
  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startWidth = columnWidths[columnKey] || 100;
    
    // Flag to track if we're currently resizing
    let isResizing = true;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing) return;
      // Remove minimum width constraint, allow any width
      const newWidth = Math.max(10, startWidth + (moveEvent.clientX - startX));
      onColumnResize(columnKey, newWidth);
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Prevent the click event if we've been resizing
      if (isResizing) {
        isResizing = false;
        
        // Create a handler to block the next click event on this column
        const blockNextClick = (clickEvent: MouseEvent) => {
          clickEvent.stopPropagation();
          // Remove this handler after it's executed once
          document.removeEventListener('click', blockNextClick, true);
        };
        
        // Add the handler to capture the next click event
        document.addEventListener('click', blockNextClick, true);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Get columns in the order defined by columnOrder
  const orderedColumns = [...columns].sort((a, b) => 
    columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key)
  );
  
  return (
    <thead>
      <tr>
        {selectionMode === 'checkbox' && (
          <th className="checkbox-cell">
            <label className="ctable-checkbox">
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
              <span className="checkmark"></span>
            </label>
          </th>
        )}
        {orderedColumns.map((column, index) => (
          <th 
            key={column.key} 
            className={column.sortable ? 'sortable' : ''}
            style={{ 
              textAlign: getAlignmentType(column.dataType) as any,
              width: columnWidths[column.key] ? `${columnWidths[column.key]}px` : undefined,
              maxWidth: columnWidths[column.key] ? `${columnWidths[column.key]}px` : undefined,
            }}
            onClick={() => onSort(column.key)}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => e.currentTarget.style.backgroundColor = '#e8f0fe'}
            onDragLeave={(e) => e.currentTarget.style.backgroundColor = ''}
            onDrop={handleDrop}
            onDragEnd={(e) => {
              e.currentTarget.style.opacity = '1';
              dragItem.current = null;
              dragOverItem.current = null;
            }}
          >
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {column.header}
              {getSortIndicator(column.key)}
            </div>
            <div
              className="resize-handle"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => handleResizeStart(e, column.key)}
            />
          </th>
        ))}
      </tr>
    </thead>
  );
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
  columns, data, selectionMode, selectedIds, onSelectRow, columnOrder 
}) => {
  const orderedColumns = [...columns].sort((a, b) => 
    columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key)
  );
  
  return (
    <tbody>
      {data.map((row) => {
        const rowId = row.id;
        const isSelected = selectedIds.includes(rowId);
        
        return (
          <tr 
            key={rowId}
            className={isSelected ? 'selected' : ''}
            onClick={() => selectionMode === 'single' && onSelectRow(rowId)}
          >
            {selectionMode === 'checkbox' && (
              <td 
                className="checkbox-cell"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRow(rowId, !isSelected);
                }}
              >
                <label className="ctable-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectRow(rowId, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="checkmark"></span>
                </label>
              </td>
            )}
            {orderedColumns.map((column) => (
              <td 
                key={`${rowId}-${column.key}`}
                style={{ textAlign: getAlignmentType(column.dataType) as any }}
                title={String(row[column.key] || '')}
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
  onSelectionChange,
  storageKey,
  compact = true  // Default to compact mode
}) => {
  // Initialize sort config with data from localStorage if available
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>(() => {
    if (storageKey) {
      const savedSort = localStorage.getItem(`${storageKey}-sort`);
      if (savedSort) {
        try {
          const parsed = JSON.parse(savedSort);
          // Verify the column exists and is sortable
          const column = columns.find(col => col.key === parsed.key);
          if (column?.sortable && 
             (parsed.direction === 'asc' || parsed.direction === 'desc' || parsed.direction === null)) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse saved sort configuration', e);
        }
      }
    }
    return { key: '', direction: null };
  });
  
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Initialize state with data from localStorage if available
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    if (storageKey) {
      const savedOrder = localStorage.getItem(`${storageKey}-order`);
      if (savedOrder) {
        try {
          const parsed = JSON.parse(savedOrder);
          // Verify all columns exist in the saved order
          const allColumnsIncluded = columns.every(col => parsed.includes(col.key));
          if (allColumnsIncluded && parsed.length === columns.length) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse saved column order', e);
        }
      }
    }
    return columns.map(col => col.key);
  });
  
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    // Try to load from localStorage first
    if (storageKey) {
      const savedWidths = localStorage.getItem(`${storageKey}-widths`);
      if (savedWidths) {
        try {
          const parsed = JSON.parse(savedWidths);
          // Merge saved widths with default widths
          const mergedWidths: Record<string, number> = {};
          columns.forEach(col => {
            if (col.width) {
              mergedWidths[col.key] = col.width;
            }
            if (parsed[col.key]) {
              mergedWidths[col.key] = parsed[col.key];
            }
          });
          return mergedWidths;
        } catch (e) {
          console.warn('Failed to parse saved column widths', e);
        }
      }
    }
    
    // Initialize with default widths from column props
    const initialWidths: Record<string, number> = {};
    columns.forEach(col => {
      if (col.width) {
        initialWidths[col.key] = col.width;
      }
    });
    return initialWidths;
  });
  
  // Save to localStorage when state changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-sort`, JSON.stringify(sortConfig));
    }
  }, [sortConfig, storageKey]);
  
  useEffect(() => {
    if (storageKey && columnOrder.length > 0) {
      localStorage.setItem(`${storageKey}-order`, JSON.stringify(columnOrder));
    }
  }, [columnOrder, storageKey]);
  
  useEffect(() => {
    if (storageKey && Object.keys(columnWidths).length > 0) {
      localStorage.setItem(`${storageKey}-widths`, JSON.stringify(columnWidths));
    }
  }, [columnWidths, storageKey]);
  
  // Reset state to defaults
  const handleReset = () => {
    // Reset sort configuration
    setSortConfig({ key: '', direction: null });
    
    // Reset column order
    const defaultOrder = columns.map(col => col.key);
    setColumnOrder(defaultOrder);
    
    // Reset column widths
    const defaultWidths: Record<string, number> = {};
    columns.forEach(col => {
      if (col.width) {
        defaultWidths[col.key] = col.width;
      }
    });
    setColumnWidths(defaultWidths);
    
    // Clear localStorage if applicable
    if (storageKey) {
      localStorage.removeItem(`${storageKey}-sort`);
      localStorage.removeItem(`${storageKey}-order`);
      localStorage.removeItem(`${storageKey}-widths`);
    }
  };
  
  // Ensure column order is updated when columns change
  useEffect(() => {
    // Check if we need to update the column order
    const allColumnsInOrder = columns.every(col => columnOrder.includes(col.key));
    const noExtraColumns = columnOrder.every(key => columns.some(col => col.key === key));
    
    if (!allColumnsInOrder || !noExtraColumns) {
      setColumnOrder(columns.map(col => col.key));
    }
    
    // Update column widths if new columns are provided with width
    const newWidths = { ...columnWidths };
    let widthsUpdated = false;
    
    columns.forEach(col => {
      if (col.width && !columnWidths[col.key]) {
        newWidths[col.key] = col.width;
        widthsUpdated = true;
      }
    });
    
    if (widthsUpdated) {
      setColumnWidths(newWidths);
    }
  }, [columns]);
  
  // Sorting handler
  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        const direction = prevConfig.direction === 'asc' ? 'desc' : 
                          prevConfig.direction === 'desc' ? null : 'asc';
        return { key, direction };
      }
      return { key, direction: 'asc' };
    });
  };

  // Selection handlers
  const handleSelectRow = (id: any, selected?: boolean) => {
    let newSelectedIds: any[];
    
    if (selectionMode === 'single') {
      newSelectedIds = [id];
    } else {
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
    }
    
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const handleSelectAll = (selected: boolean) => {
    const newSelectedIds = selected ? filteredAndSortedData.map(row => row.id) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  // Column reordering
  const handleColumnReorder = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...columnOrder];
    const draggedItem = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedItem);
    setColumnOrder(newOrder);
  };

  // Column width adjustment
  const handleColumnResize = (columnKey: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: width
    }));
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    // Filter data by search term
    let result = [...data];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(row => 
        columns.some(column => {
          const value = row[column.key];
          return value != null && String(value).toLowerCase().includes(term);
        })
      );
    }
    
    // Sort data if needed
    if (!sortConfig.direction) return result;

    const column = columns.find(col => col.key === sortConfig.key);
    
    return result.sort((a, b) => {
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
            const parseDate = (dateStr: string): Date => {
              const [datePart = '', timePart = ''] = dateStr.split(' ');
              const [year = '0', month = '0', day = '0'] = datePart.split('-');
              const [hours = '0', minutes = '0', seconds = '0'] = timePart.split(':');
              
              return new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1,
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
          } catch {
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
    <div className="ctable-container">
      <div className="ctable-toolbar">
        <div className="ctable-search">
          <input
            type="text"
            placeholder="Hledat v seznamu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {storageKey && (
          <button 
            className="ctable-reset-button"
            onClick={handleReset}
          >
            Obnovit výchozí zobrazení
          </button>
        )}
      </div>
      
      <div className="ctable-wrapper">
        <table className={`ctable ${compact ? 'compact' : ''}`}>
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
            columnWidths={columnWidths}
            onColumnResize={handleColumnResize}
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
      </div>
      
      {filteredAndSortedData.length === 0 && (
        <div className="empty-message">
          Nebyla nalezena žádná data
        </div>
      )}
    </div>
  );
};

export default CTable;
