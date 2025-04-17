import React, { useRef, useEffect } from 'react';

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface CMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: MenuItem[];
  triggerIcon?: React.ReactNode;
  triggerAriaLabel?: string;
  className?: string;
  menuClassName?: string;
  buttonClassName?: string;
}

const CMenu: React.FC<CMenuProps> = ({
  isOpen,
  setIsOpen,
  items,
  triggerIcon,
  triggerAriaLabel = "Menu options",
  className = "",
  menuClassName = "",
  buttonClassName = ""
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button 
        className={`p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors ${buttonClassName}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={triggerAriaLabel}
      >
        {triggerIcon || (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        )}
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 py-1 text-xs border border-gray-200 ${menuClassName}`}>
          {items.map((item, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CMenu;
