/**
 * Defines the data types supported by the table columns
 * 'string' - Standard text content
 * 'int' - Integer number (displayed right-aligned)
 * 'decimal' - Decimal number (displayed with 2 decimal places and right-aligned)
 * 'bool' - Boolean value (displayed as a checkbox)
 * 'datetime' - Date and time value (formatted according to dateFormat)
 * 'link' - Clickable link
 */
export type ColumnDataType = 'string' | 'int' | 'decimal' | 'bool' | 'datetime' | 'link';

/**
 * Sort direction for column sorting
 * 'asc' - Ascending order (A to Z, 0 to 9)
 * 'desc' - Descending order (Z to A, 9 to 0)
 * null - No sorting
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Row selection modes
 * 'single' - Only one row can be selected at a time (radio button)
 * 'multi' - Multiple rows can be selected simultaneously (checkboxes)
 */
export type SelectionMode = 'single' | 'multi';

/**
 * Column definition interface
 */
export interface Column {
  /** Unique identifier for the column and the corresponding data field */
  key: string;
  /** Display name for the column in the table header */
  header: string;
  /** Data type of the column content (defaults to 'string' if not provided) */
  dataType?: ColumnDataType;
  /** 
   * Format string for datetime values
   * Supported placeholders: dd, MM, yyyy, HH, mm, ss
   * Default: 'dd.MM.yyyy HH:mm'
   */
  dateFormat?: string;
  /** Initial width of the column in pixels (can be resized by the user) */
  width?: number;
}

/**
 * Row data interface with required ID field
 */
export interface RowData {
  /** Unique identifier for the row */
  id: string;
  /** Any additional fields corresponding to column keys */
  [key: string]: any;
}

/**
 * CTable component props
 */
export interface CTableProps {
  /** Array of column definitions */
  columns: Column[];
  /** Array of data rows (each row must have an id field) */
  data: RowData[];
  /** Selection mode for the table ('single' or 'multi', defaults to 'single') */
  selectionMode?: SelectionMode;
  /** 
   * Currently selected row IDs (for controlled component mode)
   * If provided, the component operates in controlled mode
   */
  selectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback when a link cell is clicked */
  onLinkClicked?: (rowId: string, columnKey: string, value: any) => void;
  /** 
   * Unique key for storing table state in localStorage
   * If provided, column order, widths, and sort settings will persist
   */
  storageKey?: string;
  /** Whether to allow the user to toggle between selection modes */
  allowSelectionModeChange?: boolean;
}
