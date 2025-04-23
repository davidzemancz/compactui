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

  // Mouse event handlers for showing/hiding tooltip
  const handleMouseEnter = () => {
    setShow(true);
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  // Use a different approach for cloning with ref
  const childWithRef = React.isValidElement(children)
    ? React.cloneElement(children, {
        // Add mouse enter/leave events to the child
        onMouseEnter: (e: React.MouseEvent<Element>) => {
          handleMouseEnter();
          // Call the original onMouseEnter if it exists
          if (children.props.onMouseEnter) {
            children.props.onMouseEnter(e);
          }
        },
        onMouseLeave: (e: React.MouseEvent<Element>) => {
          handleMouseLeave();
          // Call the original onMouseLeave if it exists
          if (children.props.onMouseLeave) {
            children.props.onMouseLeave(e);
          }
        },
        // Use proper ref property name based on element type
        ...(typeof children.type !== 'string' ? {
          innerRef: (node: HTMLElement | null) => {
            triggerRef.current = node;
            // Forward ref if needed
            const originalRef = (children as any).ref;
            if (typeof originalRef === 'function') originalRef(node);
          }
        } : {
          // For DOM elements, use the ref attribute
          ref: triggerRef
        })
      } as React.HTMLAttributes<HTMLElement> & Record<string, any>)
    : children;

  return (
    <>
      {childWithRef}
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
