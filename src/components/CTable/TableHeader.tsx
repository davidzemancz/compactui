import React, { useRef, useEffect } from 'react';
import { Column, SortDirection, SelectionMode } from './types';
import { getAlignmentType } from './utils';

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
  
  // Apply indeterminate state to the checkbox
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected, selectedIds, data]);
  
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
            className="sortable"
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

export default TableHeader;
