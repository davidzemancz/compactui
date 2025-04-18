import React, { useState, useMemo } from 'react';
import { Column, SelectionMode } from '../components/CTable/types';
import CTable from '../components/CTable/CTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to generate random user data
const generateUsers = (count: number): User[] => {
  const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer', 'Tester'];
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'David', 'Emma', 'Frank'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
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

const CTableDemo: React.FC = () => {
  // Sample columns configuration
  const columns: Column[] = [
    { key: 'id', header: 'ID', dataType: 'int' },
    { key: 'name', header: 'Name', dataType: 'string' },
    { key: 'email', header: 'Email', dataType: 'link', linkText: 'Send Email' },
    { key: 'role', header: 'Role', dataType: 'string' },
    { key: 'active', header: 'Status', dataType: 'bool' },
    { key: 'salary', header: 'Salary', dataType: 'decimal' },
    { key: 'createdAt', header: 'Created', dataType: 'datetime' },
    { key: 'updatedAt', header: 'Updated', dataType: 'datetime', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
  ];

  // Generate users once and memoize the result
  const users = useMemo(() => generateUsers(100), []);

  const [selectedMode, setSelectedMode] = useState<SelectionMode>('single');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleLinkClick = (rowId: any, columnKey: string, value: any) => {
    alert(`Link clicked: Row ID: ${rowId}, Column: ${columnKey}, Value: ${value}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xs font-bold mb-4">CTable Component</h1>

      {/* Component Demo */}
      <div className="p-4 bg-white rounded-lg shadow-md mb-6">
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-gray-700">Selection Mode:</span>
            <select 
              className="text-xs border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as SelectionMode)}
            >
              <option value="single">Single Selection</option>
              <option value="multi">Multi Selection</option>
            </select>
          </div>
        </div>
        
        <div className="h-96 overflow-auto">
          <CTable 
            columns={columns} 
            data={users}
            selectionMode={selectedMode}
            onSelectionChange={setSelectedIds}
            onLinkClicked={handleLinkClick}
            storageKey="demo-table"
          />
        </div>
      </div>
      
      {/* Description and Features */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Overview</h2>
        <p className="text-xs text-gray-700 mb-4">
          A powerful and flexible data table component with built-in sorting, selection, and column customization capabilities.
        </p>
        
        <h3 className="text-xs font-semibold mb-2">Features</h3>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700 mb-4">
          <li>Multiple data types with appropriate formatting</li>
          <li>Column sorting and reordering</li>
          <li>Single and multi-row selection</li>
          <li>Clickable links and custom actions</li>
          <li>Configurable column definitions</li>
          <li>Layout persistence via localStorage</li>
          <li>Responsive design with horizontal scrolling</li>
        </ul>
      </div>
      
      {/* Selected Items Display */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Selected Items</h2>
        <div className="bg-white rounded-lg shadow-md p-4 text-xs">
          {selectedIds.length > 0 ? (
            <div>
              <p>Selected IDs: {selectedIds.join(', ')}</p>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-500 italic">No items selected</p>
          )}
        </div>
      </div>
      
      {/* Code Examples */}
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
    { id: 1, name: 'John Smith', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
  ];

  return <CTable columns={columns} data={data} />;
}`}
            </pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Selection Mode</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`import { CTable } from 'compactui';
import { useState } from 'react';

function SelectableTable() {
  const [selectedRows, setSelectedRows] = useState([]);
  
  const columns = [
    { key: 'id', header: 'ID', dataType: 'int' },
    { key: 'name', header: 'Name', dataType: 'string' }
  ];

  const data = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Jane Doe' }
  ];

  return (
    <div>
      <CTable 
        columns={columns} 
        data={data}
        selectionMode="multi"
        onSelectionChange={setSelectedRows}
      />
      <p>Selected: {selectedRows.join(', ')}</p>
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
    { key: 'profile', header: 'Profile', dataType: 'link', linkText: 'View' }
  ];

  const data = [
    { id: 1, name: 'John Smith', profile: '/users/1' },
    { id: 2, name: 'Jane Doe', profile: '/users/2' }
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
      </div>
    </div>
  );
};

export default CTableDemo;
