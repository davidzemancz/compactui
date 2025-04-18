export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool' | 'datetime' | 'link';
export type SortDirection = 'asc' | 'desc' | null;
export type SelectionMode = 'single' | 'multi';

export interface Column {
  key: string;
  header: string;
  dataType?: ColumnDataType;
  dateFormat?: string;
  width?: number;
  linkText?: string; // Optional text to display for links (if different from value)
}

export interface CTableProps {
  columns: Column[];
  data: any[];
  selectionMode?: SelectionMode;
  onSelectionChange?: (selectedIds: any[]) => void;
  onLinkClicked?: (rowId: any, columnKey: string, value: any) => void;
  storageKey?: string;
  allowSelectionModeChange?: boolean;
}
