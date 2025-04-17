import React from 'react';
import { Column, SelectionMode } from './types';
import { formatCellValue, getAlignmentType } from './utils';

interface TableBodyProps {
  columns: Column[];
  data: any[];
  selectionMode: SelectionMode;
  selectedIds: any[];
  onSelectRow: (id: any, selected?: boolean) => void;
  columnOrder: string[];
  onLinkClicked?: (rowId: any, columnKey: string, value: any) => void;
}

const TableBody: React.FC<TableBodyProps> = ({ 
  columns, data, selectionMode, selectedIds, onSelectRow, columnOrder, onLinkClicked
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
            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''} ${data.indexOf(row) % 2 === 0 ? 'bg-gray-50/30' : ''}`}
            onClick={() => selectionMode === 'single' && onSelectRow(rowId)}
          >
            <td 
              className="w-10 p-2"
              onClick={(e) => {
                e.stopPropagation();
                onSelectRow(rowId, !isSelected);
              }}
            >
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectRow(rowId, e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </td>
            {orderedColumns.map((column) => (
              <td 
                key={`${rowId}-${column.key}`}
                className="p-2 whitespace-nowrap"
                style={{ textAlign: getAlignmentType(column.dataType) as any }}
                title={column.dataType === 'link' ? String(row[column.key] || '') : String(row[column.key] || '')}
              >
                {column.dataType === 'bool' ? (
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={Boolean(row[column.key])}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 opacity-60 cursor-not-allowed"
                    />
                  </div>
                ) : column.dataType === 'link' ? (
                  <a 
                    href="#" 
                    className="text-blue-500 hover:underline hover:text-blue-600 active:text-blue-700"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onLinkClicked) onLinkClicked(rowId, column.key, row[column.key]);
                    }}
                  >
                    {column.linkText || row[column.key]}
                  </a>
                ) : formatCellValue(
                  row[column.key], 
                  column.dataType, 
                  column.dateFormat
                )}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
