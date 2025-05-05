import React, { useRef, useEffect } from 'react';
import { Column, SortDirection, SelectionMode, RowData } from './types';
import { getAlignmentType } from './utils';

/**
 * Props for the TableHeader component
 */
interface TableHeaderProps {
  /** Array of column definitions */
  columns: Column[];
  /** Current sort configuration */
  sortConfig: { key: string; direction: SortDirection };
  /** Callback when a column header is clicked for sorting */
  onSort: (key: string) => void;
  /** Current selection mode */
  selectionMode: SelectionMode;
  /** Array of currently selected row IDs */
  selectedIds: string[];
  /** Array of filtered and sorted data rows */
  data: RowData[];
  /** Callback when the select-all checkbox is toggled */
  onSelectAll: (selected: boolean) => void;
  /** Current column display order */
  columnOrder: string[];
  /** Callback when columns are reordered via drag and drop */
  onColumnReorder: (dragIndex: number, hoverIndex: number) => void;
  /** Current column widths in pixels */
  columnWidths: Record<string, number>;
  /** Callback when a column is resized */
  onColumnResize: (columnKey: string, width: number) => void;
}

/**
 * Table header component with sort, selection, reordering, and resize capabilities
 */
const TableHeader: React.FC<TableHeaderProps> = (props) => {
  const { 
    columns, sortConfig, onSort, selectionMode, 
    selectedIds, data, onSelectAll, columnOrder, 
    onColumnReorder, columnWidths, onColumnResize 
  } = props;
  
  // Reference to the select-all checkbox for handling indeterminate state
  const checkboxRef = useRef<HTMLInputElement>(null);
  
  // References for drag-and-drop column reordering
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  // Determine checkbox state for select-all
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;
  
  // Apply indeterminate state to the checkbox when some but not all rows are selected
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected, selectedIds, data]);
  
  /**
   * Get the sort indicator arrow for a column
   * @param columnKey - The key of the column to check
   * @returns An arrow indicator or empty string
   */
  const getSortIndicator = (columnKey: string): string => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };
  
  /**
   * Handle the start of a column drag operation
   */
  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };
  
  /**
   * Handle dragging over a potential drop target
   */
  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };
  
  /**
   * Handle dropping a column to reorder it
   */
  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';
    
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      onColumnReorder(dragItem.current, dragOverItem.current);
    }
  };
  
  /**
   * Handle the start of a column resize operation
   */
  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startWidth = columnWidths[columnKey] || 100;
    
    // Flag to track if we're currently resizing
    let isResizing = true;
    
    /**
     * Handle mouse movement during resize
     */
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing) return;
      // Minimum width of 10px to ensure column remains visible
      const newWidth = Math.max(10, startWidth + (moveEvent.clientX - startX));
      onColumnResize(columnKey, newWidth);
    };
    
    /**
     * Handle mouse up to end resize operation
     */
    const handleMouseUp = () => {
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
        {selectionMode === 'multi' && (
          <th className="w-10 p-2 bg-gray-50 sticky top-0 z-20">
            <div className="flex items-center justify-center">
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                aria-label="Select all rows"
              />
            </div>
          </th>
        )}
        {selectionMode === 'single' && (
          <th className="w-10 p-2 bg-gray-50 sticky top-0 z-20">
            {/* Empty header cell for radio buttons column */}
          </th>
        )}
        {orderedColumns.map((column, index) => (
          <th 
            key={column.key} 
            className="p-2 bg-gray-50 text-gray-700 font-medium border-b border-gray-300 sticky top-0 relative hover:bg-gray-100 cursor-pointer transition-colors z-20"
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
            aria-sort={
              sortConfig.key === column.key 
                ? sortConfig.direction === 'asc' 
                  ? 'ascending' 
                  : 'descending' 
                : undefined
            }
          >
            <div className="overflow-hidden text-ellipsis whitespace-nowrap relative z-20">
              {column.header}
              {getSortIndicator(column.key)}
            </div>
            <div
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-500 z-25"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => handleResizeStart(e, column.key)}
              title={`Resize column ${column.header}`}
            />
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
