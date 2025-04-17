import React, { useState, useMemo } from 'react';
import { Column, SelectionMode } from '../components/CTable/types'; // Import types from the right path
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

  const [selectedMode, setSelectedMode] = useState<SelectionMode>('single'); // Change to 'single' or 'multi' as needed
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleLinkClick = (rowId: any, columnKey: string, value: any) => {
    alert(`Link clicked: Row ID: ${rowId}, Column: ${columnKey}, Value: ${value}`);
    // In a real app, you would likely navigate or perform some action
  };

  return (
    <div className="space-y-3">
      <div className="bg-white rounded shadow p-3">
        <h1 className="text-lg font-semibold mb-2 text-gray-800">Data Table Component</h1>
        
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
  );
};

export default CTableDemo;
