import React from 'react';
import CTextInput from '../CTextInput/CTextInput';
import CMenu from '../CMenu/CMenu';
import CTooltip from '../CTooltip/CTooltip';
import { SelectionMode } from './types';

/**
 * Props for the TableToolbar component
 */
interface TableToolbarProps {
  /** Current search term value */
  searchTerm: string;
  /** Callback when search term changes */
  setSearchTerm: (term: string) => void;
  /** Unique key for storing table state in localStorage */
  storageKey?: string;
  /** Whether the menu is currently open */
  menuOpen: boolean;
  /** Callback to set menu open state */
  setMenuOpen: (open: boolean) => void;
  /** Callback to export table data to CSV */
  exportToCSV: () => void;
  /** Callback to reset table to default state */
  handleReset: () => void;
  /** Whether to allow toggling between selection modes */
  allowSelectionModeChange?: boolean;
  /** Current selection mode */
  selectionMode: SelectionMode;
  /** Callback when selection mode changes */
  onSelectionModeChange: (mode: SelectionMode) => void;
  /** Number of currently selected rows */
  selectedCount: number;
  /** Total number of rows in the data set */
  totalCount: number;
  /** Number of rows in the filtered data set */
  filteredCount: number;
}

/**
 * Toolbar component for the table with search, selection mode toggle, and menu
 */
const TableToolbar: React.FC<TableToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  storageKey,
  menuOpen,
  setMenuOpen,
  exportToCSV,
  handleReset,
  allowSelectionModeChange = false,
  selectionMode,
  onSelectionModeChange,
  selectedCount,
  totalCount,
  filteredCount
}) => {
  // Menu items configuration
  const menuItems = [
    {
      label: 'Exportovat do CSV',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      onClick: exportToCSV
    },
    {
      label: 'Obnovit výchozí zobrazení',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      onClick: handleReset
    }
  ];

  return (
    <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0 relative z-30">
      <div className="flex items-center gap-3">
        {/* Search input */}
        <CTextInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Hledat v seznamu..."
          className="w-60"
          aria-label="Hledat v seznamu"
        />
        
        {/* Selection count information */}
        <div className="text-gray-600 text-xs">
          Vybráno <span className="font-medium">{selectedCount}</span>/{filteredCount}
          {totalCount !== filteredCount && (
            <span className="ml-1">(z celkových {totalCount})</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Selection mode toggle button */}
        {allowSelectionModeChange && (
          <CTooltip content={selectionMode === 'single' ? 'Hromadný výběr' : 'Zrušit hromadný výběr'}>
            <button
              onClick={() => onSelectionModeChange(selectionMode === 'single' ? 'multi' : 'single')}
              className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              aria-label={selectionMode === 'single' ? 'Hromadný výběr' : 'Zrušit hromadný výběr'}
            >
              {selectionMode === 'single' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="16" height="16" rx="2" />
                  <path d="M9 11l3 3l6-6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </CTooltip>
        )}
        
        {/* Table options menu */}
        {storageKey && (
          <CTooltip content="Možnosti">
            <div>
              <CMenu
                isOpen={menuOpen}
                setIsOpen={setMenuOpen}
                items={menuItems}
                triggerAriaLabel="Možnosti tabulky"
              />
            </div>
          </CTooltip>
        )}
      </div>
    </div>
  );
};

export default TableToolbar;
