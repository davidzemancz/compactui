import React, { useState, useMemo } from 'react';
import { CTable, Column, SelectionMode } from '../components/CTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  salary: number;
}

// Helper function to generate random user data
const generateUsers = (count: number): User[] => {
  const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer', 'Tester'];
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  const domains = ['example.com', 'company.co', 'acme.org', 'mail.net', 'work.io'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const active = Math.random() > 0.3; // 70% chance of being active
    const salary = Math.round(50000 + Math.random() * 50000 * 100) / 100; // Random salary between 50k and 100k
    
    return { id, name, email, role, active, salary };
  });
};

const CTableDemo: React.FC = () => {
  // Sample columns configuration
  const columns: Column[] = [
    { key: 'id', header: 'ID', dataType: 'int', sortable: true },
    { key: 'name', header: 'Name', dataType: 'string', sortable: true },
    { key: 'email', header: 'Email', dataType: 'string', sortable: true },
    { key: 'role', header: 'Role', dataType: 'string', sortable: true },
    { key: 'active', header: 'Status', dataType: 'bool', sortable: true },
    { key: 'salary', header: 'Salary', dataType: 'decimal', sortable: true }
  ];

  // Generate users once and memoize the result
  const users = useMemo(() => generateUsers(1000), []);

  const [selectedMode, setSelectedMode] = useState<SelectionMode>('single');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectionChange = (ids: any[]) => {
    setSelectedIds(ids);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMode(event.target.value as SelectionMode);
    setSelectedIds([]);
  };

  return (
    <div>
      <h1>Komponenta CTable</h1>
      
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="selection-mode" style={{ marginRight: '0.5rem' }}>
            Režim výběru:
          </label>
          <select 
            id="selection-mode"
            value={selectedMode}
            onChange={handleModeChange}
          >
            <option value="single">Jednoduchý výběr</option>
            <option value="checkbox">Vícenásobný výběr</option>
          </select>
          
         
        </div>
        
        <CTable 
          columns={columns} 
          data={users}
          selectionMode={selectedMode}
          onSelectionChange={handleSelectionChange}
          searchable={true}
        />
    </div>
  );
};

export default CTableDemo;
