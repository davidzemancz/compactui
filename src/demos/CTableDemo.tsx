import React from 'react';
import { CTable, Column } from '../components/CTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  salary: number;
}

const CTableDemo: React.FC = () => {
  // Sample columns configuration
  const columns: Column[] = [
    { key: 'id', header: 'ID', dataType: 'int' },
    { key: 'name', header: 'Name', dataType: 'string' },
    { key: 'email', header: 'Email', dataType: 'string' },
    { key: 'role', header: 'Role', dataType: 'string' },
    { key: 'active', header: 'Status', dataType: 'bool' },
    { key: 'salary', header: 'Salary', dataType: 'decimal' }
  ];

  // Sample data
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true, salary: 75000.50 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', active: true, salary: 65250.75 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', active: false, salary: 62000 },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', active: true, salary: 85500.25 },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', active: false, salary: 61750.80 }
  ];

  return (
    <div>
      <h2>CTable</h2>
      <CTable columns={columns} data={users} />
    </div>
  );
};

export default CTableDemo;
