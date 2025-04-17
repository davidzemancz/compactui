import React, { useState, useEffect, useMemo, useRef } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableToolbar from './TableToolbar';
import { CTableProps, Column, SortDirection } from './types';
import { formatCellValue } from './utils';

const CTable: React.FC<CTableProps> = ({ 
  columns, 
  data,
  selectionMode = 'single',
  onSelectionChange,
  onLinkClicked,
  storageKey
}) => {
  // Initialize sort config with data from localStorage if available
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>(() => {
    if (storageKey) {
      const savedSort = localStorage.getItem(`${storageKey}-sort`);
      if (savedSort) {
        try {
          const parsed = JSON.parse(savedSort);
          // Verify the column exists
          const column = columns.find(col => col.key === parsed.key);
          if (column && 
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
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
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
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);
  
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
    
    // Close the menu
    setMenuOpen(false);
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
    if (!column) return;

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
      // In single mode, always select the clicked item (deselect others)
      newSelectedIds = [id];
    } else if (selectionMode === 'multi') {
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

  // Function to export data to CSV - organized and simplified
  const exportToCSV = () => {
    setMenuOpen(false);
    
    const orderedColumns = columns.sort((a, b) => 
      columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key)
    );
    
    const headerRow = orderedColumns.map(col => `"${col.header}"`).join(',');
    
    const dataRows = filteredAndSortedData.map(row => {
      return orderedColumns.map(column => {
        const value = row[column.key];
        let formattedValue = '';
        
        if (value === null || value === undefined) {
          formattedValue = '';
        } else if (column.dataType === 'bool') {
          formattedValue = value ? 'Ano' : 'Ne';
        } else if (column.dataType === 'link') {
          formattedValue = String(value);
        } else {
          const formatted = formatCellValue(value, column.dataType, column.dateFormat);
          formattedValue = String(formatted);
        }
        
        return `"${formattedValue.replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');
    
    const csvContent = `${headerRow}\n${dataRows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up by releasing the object URL
  };

  return (
    <div className="bg-white rounded shadow-md overflow-hidden w-full h-full flex flex-col text-xs">
      <TableToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        storageKey={storageKey}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        exportToCSV={exportToCSV}
        handleReset={handleReset}
      />
      
      <div className="overflow-x-auto overflow-y-auto flex-1 relative">
        <table className="min-w-max w-auto text-xs">
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
            onLinkClicked={onLinkClicked}
          />
        </table>
      </div>
      
      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-4 text-gray-500 italic bg-gray-50">
          Nebyla nalezena žádná data
        </div>
      )}
    </div>
  );
};

export default CTable;
