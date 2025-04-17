export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool' | 'datetime';
export type SortDirection = 'asc' | 'desc' | null;
export type SelectionMode = 'single' | 'checkbox';

export interface Column {
  key: string;
  header: string;
  dataType?: ColumnDataType;
  sortable?: boolean;
  dateFormat?: string;
  width?: number;
}

export interface CTableProps {
  columns: Column[];
  data: any[];
  selectionMode?: SelectionMode;
  onSelectionChange?: (selectedIds: any[]) => void;
  storageKey?: string;
  compact?: boolean;
}
