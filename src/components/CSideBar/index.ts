import CSideBar from './CSideBar';

// Remove the problematic import
// Instead, define the interface inline or create the types file if needed
export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  // Add any other properties that SidebarItem should have
}

export default CSideBar;
