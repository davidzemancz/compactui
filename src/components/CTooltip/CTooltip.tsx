import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface CTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

const CTooltip: React.FC<CTooltipProps> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 5,
        left: rect.left + rect.width / 2
      });
    }
  };

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (show) {
      updatePosition();
    }
  }, [show]);

  // Add resize and scroll listeners
  useEffect(() => {
    if (show) {
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [show]);

  // Clone child element to add event handlers
  const child = React.cloneElement(React.Children.only(children), {
    ref: triggerRef,
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
  });

  return (
    <>
      {child}
      {show && ReactDOM.createPortal(
        <div 
          className="fixed z-[9999] transform -translate-x-1/2 -translate-y-full px-3 py-1.5 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none min-w-[120px] text-center"
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px`,
            marginBottom: '8px'
          }}
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CTooltip;
