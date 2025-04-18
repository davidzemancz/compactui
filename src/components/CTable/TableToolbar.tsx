import React, { useState } from 'react';
import CTextInput from '../CTextInput/CTextInput';
import CMenu from '../CMenu/CMenu';
import CTooltip from '../CTooltip/CTooltip';
import { SelectionMode } from './types';
import { CheckboxIcon, RadioButtonIcon } from '../CIcons/index';

interface TableToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  storageKey?: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  exportToCSV: () => void;
  handleReset: () => void;
  allowSelectionModeChange?: boolean;
  selectionMode: SelectionMode;
  onSelectionModeChange: (mode: SelectionMode) => void;
  // Add new props for counts
  selectedCount: number;
  totalCount: number;
  filteredCount: number;
}

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
  // Use the new props
  selectedCount,
  totalCount,
  filteredCount
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const menuItems = [
    {
      label: 'Exportovat do CSV',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      onClick: exportToCSV
    },
    {
      label: 'Obnovit výchozí zobrazení',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      onClick: handleReset
    }
  ];

  return (
    <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0 relative z-30">
      <div className="flex items-center gap-3">
        <CTextInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Hledat v seznamu..."
          className="w-60"
        />
        
        {/* Add the counts display */}
        <div className="text-gray-600 text-xs">
          Vybráno <span className="font-medium">{selectedCount}</span>/{filteredCount}
          {totalCount !== filteredCount && (
            <span className="ml-1">(z celkových {totalCount})</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {allowSelectionModeChange && (
          <CTooltip content={selectionMode === 'single' ? 'Hromadný výběr' : 'Zrušit hromadný výběr'}>
            <button
              onClick={() => onSelectionModeChange(selectionMode === 'single' ? 'multi' : 'single')}
              className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              aria-label={selectionMode === 'single' ? 'Hromadný výběr' : 'Zrušit hromadný výběr'}
            >
              {selectionMode === 'single' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="16" height="16" rx="2" />
                  <path d="M9 11l3 3l6-6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </CTooltip>
        )}
        
        {storageKey && (
          <CMenu
            isOpen={menuOpen}
            setIsOpen={setMenuOpen}
            items={menuItems}
            triggerAriaLabel="Table options"
          />
        )}
      </div>
    </div>
  );
};

export default TableToolbar;
