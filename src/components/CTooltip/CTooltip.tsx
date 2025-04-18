import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface CTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

const CTooltip: React.FC<CTooltipProps> = ({ content, children, placement = 'top' }) => {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 'full', right: 'auto', bottom: 'auto', left: '1/2' });
  const [arrowTransform, setArrowTransform] = useState('-translate-x-1/2');
  const [tooltipTransform, setTooltipTransform] = useState('-translate-x-1/2 -translate-y-full');
  const [arrowBorder, setArrowBorder] = useState('border-t-gray-900');

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      switch (placement) {
        case 'right':
          setPosition({
            top: rect.top + rect.height / 2,
            left: rect.right + 10 // Increase spacing a bit more
          });
          setTooltipTransform('-translate-y-1/2');
          setArrowPosition({ top: '1/2', right: 'auto', bottom: 'auto', left: '0' });
          setArrowTransform('-translate-y-1/2 -translate-x-1/2'); // Fix the arrow transform
          setArrowBorder('border-l-transparent border-t-transparent border-b-transparent border-r-gray-900'); // Use explicit borders
          break;
        case 'left':
          setPosition({
            top: rect.top + rect.height / 2,
            left: rect.left - 5
          });
          setTooltipTransform('-translate-x-full -translate-y-1/2');
          setArrowPosition({ top: '1/2', right: '0', bottom: 'auto', left: 'auto' });
          setArrowTransform('-translate-y-1/2 translate-x-full');
          setArrowBorder('border-l-gray-900');
          break;
        case 'bottom':
          setPosition({
            top: rect.bottom + 5,
            left: rect.left + rect.width / 2
          });
          setTooltipTransform('-translate-x-1/2');
          setArrowPosition({ top: '0', right: 'auto', bottom: 'auto', left: '1/2' });
          setArrowTransform('-translate-x-1/2 -translate-y-full');
          setArrowBorder('border-b-gray-900');
          break;
        case 'top':
        default:
          setPosition({
            top: rect.top - 5,
            left: rect.left + rect.width / 2
          });
          setTooltipTransform('-translate-x-1/2 -translate-y-full');
          setArrowPosition({ top: 'full', right: 'auto', bottom: 'auto', left: '1/2' });
          setArrowTransform('-translate-x-1/2');
          setArrowBorder('border-t-gray-900');
          break;
      }
    }
  };

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (show) {
      updatePosition();
    }
  }, [show, placement]);

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
          className={`fixed z-[9999] transform ${tooltipTransform} px-3 py-1.5 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none min-w-[120px] text-center`}
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px`,
            marginBottom: placement === 'top' ? '8px' : '0',
            marginTop: placement === 'bottom' ? '8px' : '0',
            marginLeft: placement === 'right' ? '8px' : '0',
            marginRight: placement === 'left' ? '8px' : '0'
          }}
        >
          {content}
          {/* Updated arrow div with more specific styling based on placement */}
          {placement === 'right' ? (
            <div 
              className="absolute w-0 h-0" 
              style={{
                top: '50%',
                left: '-4px',
                transform: 'translateY(-50%)',
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderRight: '4px solid #1f2937' // dark color matching bg-gray-900
              }}
            ></div>
          ) : (
            <div 
              className={`absolute border-4 border-transparent ${arrowBorder} ${arrowTransform}`}
              style={{
                top: arrowPosition.top === 'auto' ? 'auto' : arrowPosition.top === 'full' ? '100%' : '50%',
                right: arrowPosition.right === 'auto' ? 'auto' : '0',
                bottom: arrowPosition.bottom === 'auto' ? 'auto' : '0',
                left: arrowPosition.left === 'auto' ? 'auto' : arrowPosition.left === 'full' ? '100%' : '50%'
              }}
            ></div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default CTooltip;
