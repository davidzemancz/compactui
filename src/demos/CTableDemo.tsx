import React, { useState, useMemo } from 'react';
import { Column, SelectionMode, RowData } from '../components/CTable/types';
import CTable from '../components/CTable/CTable';

/**
 * User data interface for demo purposes
 */
interface User extends RowData {
  name: string;
  email: string;
  role: string;
  active: boolean;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Helper function to generate random user data for the demo
 * @param count - Number of users to generate
 * @returns Array of user objects with randomized data
 */
const generateUsers = (count: number): User[] => {
  const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer', 'Tester'];
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'David', 'Emma', 'Frank'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = (i + 1).toString();
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const active = Math.random() > 0.3;
    const salary = Math.round(50000 + Math.random() * 50000 * 100) / 100;
    
    // Generate random dates
    const now = new Date();
    const createdDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const updatedDate = new Date(createdDate.getTime() + Math.random() * (now.getTime() - createdDate.getTime()));
    
    const createdAt = createdDate.toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = updatedDate.toISOString().slice(0, 19).replace('T', ' ');
    
    return { id, name, email, role, active, salary, createdAt, updatedAt };
  });
};

/**
 * CTable Component Demo
 * 
 * Demonstrates the features of the CTable component:
 * - Data display with different column types
 * - Sorting
 * - Selection (single and multi)
 * - Clickable links
 * - Filtering
 */
const CTableDemo: React.FC = () => {
  // Define columns configuration for the table
  const columns: Column[] = [
    { key: 'id', header: 'ID', dataType: 'int', width: 60 },
    { key: 'name', header: 'Name', dataType: 'string', width: 150 },
    { key: 'email', header: 'Email', dataType: 'link', width: 220 },
    { key: 'role', header: 'Role', dataType: 'string', width: 120 },
    { key: 'active', header: 'Status', dataType: 'bool', width: 80 },
    { key: 'salary', header: 'Salary', dataType: 'decimal', width: 100 },
    { key: 'createdAt', header: 'Created', dataType: 'datetime', dateFormat: 'dd.MM.yyyy HH:mm' },
    { key: 'updatedAt', header: 'Updated', dataType: 'datetime', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
  ];

  // Generate users once and memoize the result for better performance
  const users = useMemo(() => generateUsers(100), []);

  // State for selection mode and selected IDs
  const [selectedMode, setSelectedMode] = useState<SelectionMode>('single');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /**
   * Handle clicks on link cells
   * In a real application, this might navigate to a detail page or open a modal
   */
  const handleLinkClick = (rowId: string, columnKey: string, value: any) => {
    alert(`Link clicked: Row ID: ${rowId}, Column: ${columnKey}, Value: ${value}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xs font-bold mb-4">CTable Component</h1>

      {/* Demonstration controls */}
      <div className="p-4 bg-white rounded-lg shadow-md mb-6">
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-gray-700">Selection Mode:</span>
            <select 
              className="text-xs border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as SelectionMode)}
              aria-label="Selection mode"
            >
              <option value="single">Single Selection</option>
              <option value="multi">Multi Selection</option>
            </select>
          </div>
        </div>
        
        {/* The CTable component demo */}
        <div className="h-96 overflow-auto">
          <CTable 
            columns={columns} 
            data={users}
            selectionMode={selectedMode}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onLinkClicked={handleLinkClick}
            storageKey="demo-table"
            allowSelectionModeChange={true}
          />
        </div>
      </div>
      
      {/* Component description and features */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Overview</h2>
        <p className="text-xs text-gray-700 mb-4">
          A powerful and flexible data table component with built-in sorting, selection, and column customization capabilities.
          The table supports multiple data types, persistent layout settings, and responsive design.
        </p>
        
        <h3 className="text-xs font-semibold mb-2">Features</h3>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700 mb-4">
          <li>Multiple data types with appropriate formatting and alignment</li>
          <li>Column sorting (click headers to sort)</li>
          <li>Column reordering (drag and drop headers)</li>
          <li>Column resizing (drag column dividers)</li>
          <li>Single and multi-row selection</li>
          <li>Shift-click for range selection in multi-selection mode</li>
          <li>Clickable links with custom action handlers</li>
          <li>Search filtering across all columns</li>
          <li>Layout persistence via localStorage</li>
          <li>CSV export functionality</li>
          <li>Responsive design with proper scrolling</li>
        </ul>
      </div>
      
      {/* Selected items display */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Selected Items</h2>
        <div className="bg-white rounded-lg shadow-md p-4 text-xs">
          {selectedIds.length > 0 ? (
            <div>
              <p className="mb-2">Selected IDs: {selectedIds.join(', ')}</p>
              <p className="text-xs text-gray-500">
                {selectedMode === 'multi' && 'Pro tip: Hold Shift while clicking to select ranges of rows.'}
              </p>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-500 italic">No items selected</p>
          )}
        </div>
      </div>
      
      {/* Code examples */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Usage Examples</h2>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Basic Usage</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`import { CTable } from 'compactui';

function MyTableComponent() {
  const columns = [
    { key: 'id', header: 'ID', dataType: 'int' },
    { key: 'name', header: 'Name', dataType: 'string' },
    { key: 'email', header: 'Email', dataType: 'string' }
  ];

  const data = [
    { id: '1', name: 'John Smith', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' }
  ];

  return <CTable columns={columns} data={data} />;
}`}
            </pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Controlled Selection</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`import { CTable } from 'compactui';
import { useState } from 'react';

function SelectableTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const columns = [
    { key: 'id', header: 'ID', dataType: 'int' },
    { key: 'name', header: 'Name', dataType: 'string' }
  ];

  const data = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Jane Doe' }
  ];

  return (
    <div>
      <CTable 
        columns={columns} 
        data={data}
        selectionMode="multi"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      <p>Selected: {selectedIds.join(', ')}</p>
    </div>
  );
}`}
            </pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Custom Link Handling</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`import { CTable } from 'compactui';

function TableWithLinks() {
  const columns = [
    { key: 'id', header: 'ID', dataType: 'int' },
    { key: 'name', header: 'Name', dataType: 'string' },
    { key: 'profile', header: 'Profile', dataType: 'link' }
  ];

  const data = [
    { id: '1', name: 'John Smith', profile: '/users/1' },
    { id: '2', name: 'Jane Doe', profile: '/users/2' }
  ];

  const handleLinkClick = (rowId, columnKey, value) => {
    // Navigate to the profile page or open in a modal
    console.log(\`Opening profile: \${value}\`);
  };

  return (
    <CTable 
      columns={columns} 
      data={data}
      onLinkClicked={handleLinkClick}
    />
  );
}`}
            </pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Persistent Settings</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`import { CTable } from 'compactui';

function PersistentTable() {
  const columns = [
    { key: 'id', header: 'ID', dataType: 'int', width: 80 },
    { key: 'name', header: 'Name', dataType: 'string', width: 150 },
    { key: 'email', header: 'Email', dataType: 'string', width: 200 }
  ];

  const data = [/* ...data... */];

  return (
    <CTable 
      columns={columns} 
      data={data}
      storageKey="my-persistent-table"
    />
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTableDemo;
