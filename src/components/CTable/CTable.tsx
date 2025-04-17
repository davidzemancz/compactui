import React, { useState, useEffect, useMemo } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { CTableProps, Column, SortDirection } from './types';
import './CTable.css';

const CTable: React.FC<CTableProps> = ({ 
  columns, 
  data,
  selectionMode = 'single',
  onSelectionChange,
  storageKey
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
    } else if (selectionMode === 'checkbox') {
      if (selected === undefined) {
        // Toggle selection
        newSelectedIds = selectedIds.includes(id) 
          ? selectedIds.filter(selId => selId !== id)
          : [...selectedIds, id];
      } else {
        // Explicit selection state
        if (selected) {
          // Add to selection if not already selected
          newSelectedIds = selectedIds.includes(id) 
            ? [...selectedIds] // Return a new array to trigger state update
            : [...selectedIds, id];
        } else {
          // Remove from selection
          newSelectedIds = selectedIds.filter(selId => selId !== id);
        }
      }
    } else {
      // Fallback for unknown selection mode
      newSelectedIds = [...selectedIds];
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
      <div className="ctable-toolbar compact">
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
        <table className="ctable compact">
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
