import React, { useRef } from 'react';

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
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0 relative z-30">
      <div className="relative w-60">
        <input
          type="text"
          placeholder="Hledat v seznamu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {storageKey && (
        <div className="relative" ref={menuRef}>
          <button 
            className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Table options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 py-1 text-xs border border-gray-200">
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                onClick={exportToCSV}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportovat do CSV
              </button>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                onClick={handleReset}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Obnovit výchozí zobrazení
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableToolbar;
