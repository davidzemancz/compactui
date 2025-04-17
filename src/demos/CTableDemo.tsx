import React, { useState, useMemo } from 'react';
import { CTable, Column, SelectionMode } from '../components/CTable';

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
    
    // Generate random dates within the last year
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
    { key: 'id', header: 'ID', dataType: 'int', sortable: true },
    { key: 'name', header: 'Name', dataType: 'string', sortable: true },
    { key: 'email', header: 'Email', dataType: 'string', sortable: true },
    { key: 'role', header: 'Role', dataType: 'string', sortable: true },
    { key: 'active', header: 'Status', dataType: 'bool', sortable: true },
    { key: 'salary', header: 'Salary', dataType: 'decimal', sortable: true },
    { key: 'createdAt', header: 'Created', dataType: 'datetime', sortable: true },
    { key: 'updatedAt', header: 'Updated', dataType: 'datetime', sortable: true, dateFormat: 'yyyy-MM-dd HH:mm:ss' }
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
        
        <div style={{ marginTop: '0.5rem', fontSize: '0.9em', color: '#666' }}>
          Pro změnu pořadí sloupců přetáhněte záhlaví sloupce na novou pozici.
        </div>
      </div>
      
      <CTable 
        columns={columns} 
        data={users}
        selectionMode={selectedMode}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default CTableDemo;
