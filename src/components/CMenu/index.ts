import CMenu from './CMenu';

// Remove the problematic import
// Instead, define the interface inline or create the types file if needed
export interface MenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  // Add any other properties that MenuItem should have
}

// Remove the redundant export statement since MenuItem is already exported above
export default CMenu;
