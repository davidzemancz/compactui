import React, { useState, useEffect, useMemo, useRef } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableToolbar from './TableToolbar';
import { CTableProps, SortDirection, SelectionMode, RowData } from './types';
import { formatCellValue } from './utils';

/**
 * CTable Component
 * 
 * A comprehensive data table component with the following features:
 * - Sorting by column
 * - Filtering and searching
 * - Single and multi-row selection
 * - Column reordering via drag and drop
 * - Column resizing
 * - Persistent layout settings using localStorage
 * - CSV export
 * - Support for different data types with appropriate formatting
 */
const CTable: React.FC<CTableProps> = ({ 
  columns, 
  data,
  selectionMode: initialSelectionMode = 'single',
  selectedIds: externalSelectedIds,
  onSelectionChange,
  onLinkClicked,
  storageKey,
  allowSelectionModeChange = false
}) => {
  // Track the current selection mode
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(initialSelectionMode);
  
  // Internal state for uncontrolled mode
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = externalSelectedIds !== undefined;
  
  // Use the appropriate selectedIds based on controlled/uncontrolled mode
  const selectedIds = isControlled ? externalSelectedIds : internalSelectedIds;
  
  // Track the last selected row for shift-click functionality
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  
  // Store the current sort configuration
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>(() => {
    // Try to load sort configuration from localStorage if storageKey is provided
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
  
  // Store current search term for filtering
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Control menu open state
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Track column order, loading from localStorage if available
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
    // Default to the order columns are defined
    return columns.map(col => col.key);
  });
  
  // Track column widths, loading from localStorage if available
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
    /**
     * Handler to close the menu when clicking outside of it
     */
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
  
  // Save sort configuration to localStorage when it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-sort`, JSON.stringify(sortConfig));
    }
  }, [sortConfig, storageKey]);
  
  // Save column order to localStorage when it changes
  useEffect(() => {
    if (storageKey && columnOrder.length > 0) {
      localStorage.setItem(`${storageKey}-order`, JSON.stringify(columnOrder));
    }
  }, [columnOrder, storageKey]);
  
  // Save column widths to localStorage when they change
  useEffect(() => {
    if (storageKey && Object.keys(columnWidths).length > 0) {
      localStorage.setItem(`${storageKey}-widths`, JSON.stringify(columnWidths));
    }
  }, [columnWidths, storageKey]);
  
  /**
   * Reset all table state to defaults
   */
  const handleReset = () => {
    // Reset sort configuration
    setSortConfig({ key: '', direction: null });
    
    // Reset column order
    const defaultOrder = columns.map(col => col.key);
    setColumnOrder(defaultOrder);
    
    // Reset column widths to initial values
    const defaultWidths: Record<string, number> = {};
    columns.forEach(col => {
      if (col.width) {
        defaultWidths[col.key] = col.width;
      }
    });
    setColumnWidths(defaultWidths);
    
    // Clear search term
    setSearchTerm('');
    
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
  
  /**
   * Handle column sorting
   * @param key - Key of the column to sort by
   */
  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column) return;

    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        // Cycle through: asc -> desc -> none
        const direction = prevConfig.direction === 'asc' ? 'desc' : 
                          prevConfig.direction === 'desc' ? null : 'asc';
        return { key, direction };
      }
      return { key, direction: 'asc' };
    });
  };

  /**
   * Handle row selection with support for shift-click multi-select
   * @param id - ID of the row being selected
   * @param selected - Optional explicit selection state (true/false)
   * @param event - Optional mouse event for shift-click detection
   */
  const handleSelectRow = (id: string, selected?: boolean, event?: React.MouseEvent) => {
    let newSelectedIds: string[];
    
    if (selectionMode === 'single') {
      // In single mode, always select the clicked item (deselect others)
      newSelectedIds = [id];
      setLastSelectedId(id);
    } else if (selectionMode === 'multi') {
      // Handle multi-selection with Shift key support
      if (event?.shiftKey && lastSelectedId !== null) {
        // Find the indices of the last selected item and the current item
        const lastIndex = filteredAndSortedData.findIndex(row => row.id === lastSelectedId);
        const currentIndex = filteredAndSortedData.findIndex(row => row.id === id);
        
        if (lastIndex !== -1 && currentIndex !== -1) {
          // Determine the range to select
          const startIndex = Math.min(lastIndex, currentIndex);
          const endIndex = Math.max(lastIndex, currentIndex);
          
          // Get IDs of all rows in the range
          const rangeIds = filteredAndSortedData
            .slice(startIndex, endIndex + 1)
            .map(row => row.id);
          
          // Combine existing selection with the range, ensuring no duplicates
          const uniqueIds = new Set([...selectedIds, ...rangeIds]);
          newSelectedIds = Array.from(uniqueIds);
        } else {
          // Fallback if indices can't be found
          newSelectedIds = selected ? [...selectedIds, id] : selectedIds.filter(selId => selId !== id);
        }
      } else {
        // Normal multi-selection behavior without Shift key
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
        
        // Update last selected ID for future shift-clicks
        setLastSelectedId(id);
      }
    } else {
      // Fallback for unknown selection mode
      newSelectedIds = [...selectedIds];
    }
    
    // Only update internal state if we're in uncontrolled mode
    if (!isControlled) {
      setInternalSelectedIds(newSelectedIds);
    }
    
    // Always call the onSelectionChange callback if provided
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  /**
   * Handle select all checkbox
   * @param selected - Whether to select or deselect all rows
   */
  const handleSelectAll = (selected: boolean) => {
    const newSelectedIds = selected 
      ? filteredAndSortedData.map(row => String(row.id)) 
      : [];
    
    // Only update internal state if we're in uncontrolled mode
    if (!isControlled) {
      setInternalSelectedIds(newSelectedIds);
    }
    
    // Always call the onSelectionChange callback if provided
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  /**
   * Handle column reordering via drag and drop
   * @param dragIndex - Index of the column being dragged
   * @param hoverIndex - Index where the column is being dropped
   */
  const handleColumnReorder = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...columnOrder];
    const draggedItem = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedItem);
    setColumnOrder(newOrder);
  };

  /**
   * Handle column width adjustment
   * @param columnKey - Key of the column being resized
   * @param width - New width in pixels
   */
  const handleColumnResize = (columnKey: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: width
    }));
  };

  /**
   * Filtered and sorted data based on current search term and sort configuration
   */
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
            // Parse date strings if needed
            const parseDate = (dateStr: string): Date => {
              if (dateStr instanceof Date) return dateStr;
              
              // Handle ISO date strings with or without time
              if (typeof dateStr === 'string') {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) return date;
                
                // If standard parsing fails, try custom format
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
              }
              
              return new Date(0); // Fallback
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

  /**
   * Export table data to CSV file
   */
  const exportToCSV = () => {
    setMenuOpen(false);
    
    // Get columns in the correct order
    const orderedColumns = [...columns].sort((a, b) => 
      columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key)
    );
    
    // Create header row
    const headerRow = orderedColumns.map(col => `"${col.header}"`).join(',');
    
    // Create data rows
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
        
        // Escape quotes in CSV
        return `"${formattedValue.replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');
    
    // Combine header and data
    const csvContent = `${headerRow}\n${dataRows}`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set download attributes
    link.setAttribute('href', url);
    link.setAttribute('download', `export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  /**
   * Handle selection mode change (single/multi)
   * @param newMode - New selection mode to set
   */
  const handleSelectionModeChange = (newMode: SelectionMode) => {
    // If changing from multi to single, keep only the first selected item
    if (newMode === 'single' && selectedIds.length > 1) {
      const newSelectedIds = [selectedIds[0]];
      
      // Only update internal state if we're in uncontrolled mode
      if (!isControlled) {
        setInternalSelectedIds(newSelectedIds);
      }
      
      // Notify parent component of selection change
      if (onSelectionChange) {
        onSelectionChange(newSelectedIds);
      }
    }
    
    // Update selection mode
    setSelectionMode(newMode);
  };
  
  // Update selection mode if prop changes
  useEffect(() => {
    setSelectionMode(initialSelectionMode);
  }, [initialSelectionMode]);

  return (
    <div className="bg-white rounded shadow-md overflow-hidden w-full h-full flex flex-col text-xs">
      {/* Toolbar with search, selection controls, and menu */}
      <TableToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        storageKey={storageKey}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        exportToCSV={exportToCSV}
        handleReset={handleReset}
        allowSelectionModeChange={allowSelectionModeChange}
        selectionMode={selectionMode}
        onSelectionModeChange={handleSelectionModeChange}
        selectedCount={selectedIds.length}
        totalCount={data.length}
        filteredCount={filteredAndSortedData.length}
      />
      
      {/* Table container with horizontal and vertical scrolling */}
      <div className="overflow-x-auto overflow-y-auto flex-1 relative">
        <table className="min-w-max w-auto text-xs" role="grid">
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
      
      {/* Empty state message */}
      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-4 text-gray-500 italic bg-gray-50">
          Nebyla nalezena žádná data
        </div>
      )}
    </div>
  );
};

export default CTable;
