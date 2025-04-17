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
            className={isSelected ? 'selected' : ''}
            onClick={() => selectionMode === 'single' && onSelectRow(rowId)}
          >
            <td 
              className="checkbox-cell"
              onClick={(e) => {
                e.stopPropagation();
                onSelectRow(rowId, !isSelected);
              }}
            >
              <label className="ctable-checkbox" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectRow(rowId, e.target.checked);
                  }}
                />
                <span className="checkmark"></span>
              </label>
            </td>
            {orderedColumns.map((column) => (
              <td 
                key={`${rowId}-${column.key}`}
                style={{ textAlign: getAlignmentType(column.dataType) as any }}
                title={column.dataType === 'link' ? String(row[column.key] || '') : String(row[column.key] || '')}
              >
                {formatCellValue(
                  row[column.key], 
                  column.dataType, 
                  column.dateFormat, 
                  column.linkText,
                  column.dataType === 'link' && onLinkClicked 
                    ? (value) => onLinkClicked(rowId, column.key, value) 
                    : undefined
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
