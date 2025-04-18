import React, { useEffect, useRef } from 'react';

export interface CDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string | number;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  position?: 'left' | 'right';
}

const CDrawer: React.FC<CDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = '400px',
  closeOnClickOutside = true,
  closeOnEsc = true,
  position = 'right',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);

  // Prevent scroll on body when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Calculate width style
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  // Get position classes based on position prop
  const positionClasses = position === 'left' 
    ? 'left-0 transform -translate-x-full' 
    : 'right-0 transform translate-x-full';

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`}
        onClick={closeOnClickOutside ? onClose : undefined}
      />
      
      {/* Drawer */}
      <div 
        className={`absolute inset-y-0 ${positionClasses} duration-300 transition-transform ${isOpen ? 'transform-none' : ''}`}
        style={{ width: widthStyle }}
        ref={drawerRef}
      >
        <div className="h-full bg-white flex flex-col shadow-xl">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-xs font-medium text-gray-700">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none rounded-full p-1 hover:bg-gray-100 transition-colors"
              aria-label="Close drawer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDrawer;
