import React, { ReactNode } from 'react';
import CTooltip from '../CTooltip/CTooltip';

export interface ToolBarItem {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export interface ToolBarSeparator {
  id: string;
  type: 'separator';
}

export type ToolBarItemOrSeparator = ToolBarItem | ToolBarSeparator;

export interface CToolBarProps {
  items: ToolBarItemOrSeparator[];
  className?: string;
}

// Remove the unused isToolBarItem function
// const isToolBarItem = (item: ToolBarItemOrSeparator): item is ToolBarItem => 
//   (item as ToolBarItem).icon !== undefined;

const isSeparator = (item: ToolBarItemOrSeparator): item is ToolBarSeparator => 
  (item as ToolBarSeparator).type === 'separator';

const CToolBar: React.FC<CToolBarProps> = ({ items, className = '' }) => {
  // Update render function
  const renderToolbarItem = (item: ToolBarItemOrSeparator) => {
    if (isSeparator(item)) {
      return <div key={item.id} className="c-toolbar-separator" />;
    }
    
    // Now TypeScript knows this is a ToolBarItem
    const button = (
      <button
        key={item.id}
        className="c-toolbar-button"
        onClick={item.onClick}
        disabled={item.disabled}
        title={item.tooltip || item.label}
        aria-label={item.label}
      >
        {item.icon}
      </button>
    );
    
    return item.tooltip ? (
      <CTooltip key={item.id} content={item.tooltip}>
        {button}
      </CTooltip>
    ) : button;
  };

  return (
    <div className={`flex items-center gap-1 bg-gray-50 p-2 border-b border-gray-200 rounded-t ${className}`}>
      {items.map((item) => renderToolbarItem(item))}
    </div>
  );
};

export default CToolBar;
