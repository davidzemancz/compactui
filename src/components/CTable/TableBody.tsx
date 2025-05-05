import React from 'react';
import { Column, SelectionMode, RowData } from './types';
import { formatCellValue, getAlignmentType } from './utils';

/**
 * Props for the TableBody component
 */
interface TableBodyProps {
  /** Array of column definitions */
  columns: Column[];
  /** Array of data rows to display */
  data: RowData[];
  /** Current selection mode */
  selectionMode: SelectionMode;
  /** Array of currently selected row IDs */
  selectedIds: string[];
  /** Callback when a row is selected or deselected */
  onSelectRow: (id: string, selected?: boolean, event?: React.MouseEvent) => void;
  /** Current column display order */
  columnOrder: string[];
  /** Callback when a link cell is clicked */
  onLinkClicked?: (rowId: string, columnKey: string, value: any) => void;
}

/**
 * Table body component that renders all data rows
 */
const TableBody: React.FC<TableBodyProps> = ({ 
  columns, data, selectionMode, selectedIds, onSelectRow, columnOrder, onLinkClicked
}) => {
  // Sort columns according to the current column order
  const orderedColumns = [...columns].sort((a, b) => 
    columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key)
  );
  
  return (
    <tbody>
      {data.map((row, rowIndex) => {
        const rowId = String(row.id); // Ensure ID is a string
        const isSelected = selectedIds.includes(rowId);
        
        return (
          <tr 
            key={rowId}
            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-blue-50' : ''
            } ${rowIndex % 2 === 0 ? 'bg-gray-50/30' : ''}`}
            onClick={(e) => selectionMode === 'single' && onSelectRow(rowId, true, e)}
            aria-selected={isSelected}
            role="row"
          >
            {/* Selection cell for multi-selection mode (checkbox) */}
            {selectionMode === 'multi' && (
              <td 
                className="w-10 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRow(rowId, !isSelected, e);
                }}
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectRow(rowId, e.target.checked, e.nativeEvent as unknown as React.MouseEvent);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select row ${rowId}`}
                  />
                </div>
              </td>
            )}
            
            {/* Selection cell for single-selection mode (radio button) */}
            {selectionMode === 'single' && (
              <td 
                className="w-10 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRow(rowId, true, e);
                }}
              >
                <div className="flex items-center justify-center">
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        onSelectRow(rowId, true, e.nativeEvent as unknown as React.MouseEvent);
                      }
                    }}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                    name="table-row-selection"
                    aria-label={`Select row ${rowId}`}
                  />
                </div>
              </td>
            )}
            
            {/* Render cells for each column */}
            {orderedColumns.map((column) => {
              const cellValue = row[column.key];
              const cellContent = 
                column.dataType === 'bool' ? (
                  // Boolean checkbox (readonly)
                  <div className="flex justify-center relative" style={{ zIndex: 1 }}>
                    <input
                      type="checkbox"
                      checked={Boolean(cellValue)}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 opacity-60 cursor-default"
                      aria-label={`${column.header}: ${Boolean(cellValue) ? 'Yes' : 'No'}`}
                      tabIndex={-1}
                    />
                  </div>
                ) : column.dataType === 'link' ? (
                  // Clickable link
                  <a 
                    href="#" 
                    className="text-blue-500 hover:underline hover:text-blue-600 active:text-blue-700"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Always select the row first before link action
                      if (selectionMode === 'single') {
                        // For single selection mode, just select this row
                        onSelectRow(rowId);
                      } else if (selectionMode === 'multi' && !isSelected) {
                        // For multi-selection, only add to selection if not already selected
                        onSelectRow(rowId, true);
                      }
                      
                      // After ensuring selection, trigger the link clicked callback
                      if (onLinkClicked) {
                        onLinkClicked(rowId, column.key, cellValue);
                      }
                    }}
                    aria-label={`${column.header}: ${cellValue || ''}`}
                  >
                    {cellValue}
                  </a>
                ) : (
                  // Regular formatted cell content
                  formatCellValue(cellValue, column.dataType, column.dateFormat)
                );
              
              return (
                <td 
                  key={`${rowId}-${column.key}`}
                  className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ 
                    textAlign: getAlignmentType(column.dataType) as any,
                    maxWidth: '300px' // Limit cell width for better layout
                  }}
                  title={String(cellValue || '')}
                  role="cell"
                >
                  {cellContent}
                </td>
              );
            })}
          </tr>
        );
      })}
      
      {/* Show placeholder row when there's no data */}
      {data.length === 0 && (
        <tr>
          <td 
            colSpan={columns.length + 1} 
            className="py-4 text-center text-gray-500 italic"
          >
            Nebyla nalezena žádná data
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default TableBody;
