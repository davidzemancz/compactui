import React, { useState, ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CTooltip from '../CTooltip/CTooltip';

// Type definitions for sidebar items
export interface SidebarItem {
  id: string;
  label: string;
  to?: string;
  icon?: ReactNode;
  children?: SidebarItem[];
}

interface CSideBarProps {
  items: SidebarItem[];
  title?: string;
  footerItem?: {
    label: string;
    icon: ReactNode;
    href: string;
    title?: string;
  };
}

// NavLink component for sidebar items with routes
const NavLink: React.FC<{to: string, children: React.ReactNode, icon?: ReactNode, isCollapsed?: boolean}> = 
  ({ to, children, icon, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const linkElement = (
    <Link 
      to={to} 
      className={`px-2 py-2 rounded text-xs font-medium flex ${isCollapsed ? 'justify-center' : 'items-center'} ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon && (
        <span className={isCollapsed ? '' : 'mr-2'}>
          {icon}
        </span>
      )}
      {!isCollapsed && children}
    </Link>
  );
  
  if (isCollapsed) {
    return (
      <CTooltip content={String(children)} placement="right">
        {linkElement}
      </CTooltip>
    );
  }
  
  return linkElement;
};

const CSideBar: React.FC<CSideBarProps> = ({ items, title, footerItem }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  
  useEffect(() => {
    const autoExpandParents = () => {
      const newExpandedItems: string[] = [...expandedItems];
      
      const findAndExpandParent = (items: SidebarItem[], path: string) => {
        for (const item of items) {
          if (item.children && !item.to) {
            const hasActiveChild = item.children.some(child => 
              (child.to && child.to === path) || 
              (child.children && findChildWithPath(child.children, path))
            );
            
            if (hasActiveChild && !newExpandedItems.includes(item.id)) {
              newExpandedItems.push(item.id);
            }
            
            if (item.children) {
              findAndExpandParent(item.children, path);
            }
          }
        }
      };
      
      const findChildWithPath = (items: SidebarItem[], path: string): boolean => {
        return items.some(item => 
          (item.to && item.to === path) || 
          (item.children && findChildWithPath(item.children, path))
        );
      };
      
      findAndExpandParent(items, location.pathname);
      
      if (newExpandedItems.length !== expandedItems.length) {
        setExpandedItems(newExpandedItems);
      }
    };
    
    autoExpandParents();
  }, [location.pathname, items, expandedItems]);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleExpand = (itemId: string) => {
    setExpandedItems(prevState => 
      prevState.includes(itemId) 
        ? prevState.filter(id => id !== itemId) 
        : [...prevState, itemId]
    );
  };
  
  const renderNavItem = (item: SidebarItem, level = 0) => {
    const isActive = item.to && location.pathname === item.to;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    
    const itemContent = item.to ? (
      <NavLink 
        to={item.to} 
        isCollapsed={isCollapsed}
        icon={item.icon}
      >
        {item.label}
      </NavLink>
    ) : (
      <div 
        className={`px-2 py-2 rounded text-xs font-medium flex items-center justify-between cursor-pointer
          ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        onClick={() => hasChildren && toggleExpand(item.id)}
      >
        <div className={`flex ${isCollapsed ? 'justify-center w-full' : 'items-center'}`}>
          {item.icon && (
            <span className={isCollapsed ? '' : 'mr-2'}>
              {item.icon}
            </span>
          )}
          {!isCollapsed && <span>{item.label}</span>}
        </div>
        {!isCollapsed && hasChildren && (
          <span className="text-gray-400">
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </span>
        )}
      </div>
    );

    // Wrap non-link items with tooltip when collapsed
    const finalContent = !item.to && isCollapsed ? (
      <CTooltip content={item.label} placement="right">
        {itemContent}
      </CTooltip>
    ) : itemContent;
    
    return (
      <div key={item.id} className={level > 0 ? 'mt-1' : ''}>
        {finalContent}
        
        {hasChildren && isExpanded && (
          <div className={`${isCollapsed ? 'ml-0 mt-1' : 'ml-4 mt-1'}`}>
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <aside className={`${isCollapsed ? 'w-12' : 'w-48'} bg-white shadow-md h-screen sticky top-0 transition-all duration-300 flex flex-col`}>
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        {!isCollapsed && title && <span className="text-blue-600 font-medium text-xs">{title}</span>}
        <button 
          onClick={toggleSidebar} 
          className={`text-gray-500 hover:text-gray-700 focus:outline-none ${isCollapsed ? 'mx-auto' : ''}`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="py-2 flex-1 overflow-y-auto">
        <nav className={`flex flex-col gap-1 ${isCollapsed ? 'px-1' : 'px-2'}`}>
          {items.map(item => renderNavItem(item))}
        </nav>
      </div>
      
      {footerItem && (
        <div className="p-2 border-t border-gray-200 flex justify-center">
          {isCollapsed ? (
            <CTooltip content={footerItem.title || footerItem.label} placement="right">
              <a 
                href={footerItem.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-2"
              >
                {footerItem.icon}
              </a>
            </CTooltip>
          ) : (
            <a 
              href={footerItem.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-2"
              title={footerItem.title || footerItem.label}
            >
              {footerItem.icon}
              {footerItem.label}
            </a>
          )}
        </div>
      )}
    </aside>
  );
};

export default CSideBar;
