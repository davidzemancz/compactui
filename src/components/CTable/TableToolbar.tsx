import React from 'react';
import CTextInput from '../CTextInput/CTextInput';
import CMenu from '../CMenu/CMenu';

interface TableToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  storageKey?: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  exportToCSV: () => void;
  handleReset: () => void;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  storageKey,
  menuOpen,
  setMenuOpen,
  exportToCSV,
  handleReset
}) => {
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
      <CTextInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Hledat v seznamu..."
        className="w-60"
      />
      
      {storageKey && (
        <CMenu
          isOpen={menuOpen}
          setIsOpen={setMenuOpen}
          items={menuItems}
          triggerAriaLabel="Table options"
        />
      )}
    </div>
  );
};

export default TableToolbar;
