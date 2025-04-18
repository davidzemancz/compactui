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

const CToolBar: React.FC<CToolBarProps> = ({ items, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 bg-gray-50 p-2 border-b border-gray-200 rounded-t ${className}`}>
      {items.map((item) => {
        if (item.type === 'separator') {
          return (
            <div key={item.id} className="h-5 w-px bg-gray-300 mx-1"></div>
          );
        }

        const button = (
          <button
            key={item.id}
            onClick={item.onClick}
            disabled={item.disabled}
            className={`p-1.5 rounded ${
              item.disabled
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors'
            }`}
            aria-label={item.label}
          >
            {item.icon}
          </button>
        );

        return item.tooltip ? (
          <CTooltip key={item.id} content={item.tooltip}>
            {button}
          </CTooltip>
        ) : (
          button
        );
      })}
    </div>
  );
};

export default CToolBar;
