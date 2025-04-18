export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool' | 'datetime' | 'link';
export type SortDirection = 'asc' | 'desc' | null;
export type SelectionMode = 'single' | 'multi';

export interface Column {
  key: string;
  header: string;
  dataType?: ColumnDataType;
  dateFormat?: string;
  width?: number;
  // Remove linkText property as we'll always display the actual value
}

export interface CTableProps {
  columns: Column[];
  data: any[];
  selectionMode?: SelectionMode;
  selectedIds?: any[]; // Added prop for controlled selection
  onSelectionChange?: (selectedIds: any[]) => void;
  onLinkClicked?: (rowId: any, columnKey: string, value: any) => void;
  storageKey?: string;
  allowSelectionModeChange?: boolean;
}
