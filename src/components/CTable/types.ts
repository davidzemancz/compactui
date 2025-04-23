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
  selectedIds?: string[]; // Changed from any[] to string[]
  onSelectionChange?: (selectedIds: string[]) => void; // Also updated to match
  onLinkClicked?: (rowId: string, columnKey: string, value: any) => void;
  storageKey?: string;
  allowSelectionModeChange?: boolean;
}
