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
      
      <section>
        <h2>Přehled</h2>
        <p>
          CTable je flexibilní a výkonná tabulková komponenta, která podporuje řaditelné sloupce, 
          různé datové typy a režimy výběru řádků. Je navržena pro efektivní zpracování velkých 
          datových sad a poskytuje čisté uživatelské rozhraní.
        </p>
      </section>
      
      <section>
        <h2>Funkce</h2>
        <ul>
          <li><strong>Řazení sloupců</strong> - Kliknutím na záhlaví sloupce můžete řadit (vzestupně, sestupně nebo bez řazení)</li>
          <li><strong>Formátování datových typů</strong> - Automatické formátování na základě datových typů sloupců</li>
          <li><strong>Zarovnání textu</strong> - Automatické zarovnání na základě datových typů (čísla zarovnána vpravo, atd.)</li>
          <li><strong>Výběr řádků</strong> - Podporuje režimy jednoduchého a vícenásobného výběru</li>
          <li><strong>Podpora velkých datových sad</strong> - Efektivně zpracovává tisíce řádků</li>
        </ul>
      </section>
      
      <section>
        <h2>Příklad použití</h2>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// 1. Definujte sloupce
const columns: Column[] = [
  { key: 'id', header: 'ID', dataType: 'int', sortable: true },
  { key: 'name', header: 'Jméno', dataType: 'string', sortable: true },
  { key: 'salary', header: 'Plat', dataType: 'decimal', sortable: true }
];

// 2. Připravte data (musí mít vlastnost 'id' pro výběr)
const data = [
  { id: 1, name: 'Jan Novák', salary: 75000.50 },
  { id: 2, name: 'Jana Nováková', salary: 82500.75 }
];

// 3. Zpracování změn výběru
const handleSelectionChange = (selectedIds: number[]) => {
  console.log('Vybrané ID:', selectedIds);
};

// 4. Vykreslení tabulky
<CTable 
  columns={columns}
  data={data}
  selectionMode="single" // Možnosti: 'single' (výchozí), 'checkbox'
  onSelectionChange={handleSelectionChange}
/>
`}</pre>
      </section>
      
      <section>
        <h2>Referenční API</h2>
        
        <h3>Vlastnosti sloupce</h3>
        <ul>
          <li><code>key</code> (string) - Jedinečný identifikátor sloupce, odpovídá vlastnosti datového objektu</li>
          <li><code>header</code> (string) - Text záhlaví sloupce</li>
          <li><code>dataType</code> (volitelné) - Datový typ pro formátování ('string', 'int', 'decimal', 'bool')</li>
          <li><code>sortable</code> (volitelné) - Zda je sloupec řaditelný (true/false)</li>
        </ul>
        
        <h3>Props komponenty</h3>
        <ul>
          <li><code>columns</code> (Column[]) - Definice sloupců</li>
          <li><code>data</code> (any[]) - Pole dat (objekty musí mít vlastnost 'id')</li>
          <li><code>selectionMode</code> (volitelné) - Režim výběru řádků ('single' (výchozí), 'checkbox')</li>
          <li><code>onSelectionChange</code> (volitelné) - Callback při změně výběru (obdrží pole vybraných id)</li>
        </ul>
      </section>
      
      <section>
        <h2>Demo</h2>
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
          
          {selectedIds.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Vybrané řádky:</strong> {selectedIds.join(', ')}
            </div>
          )}
        </div>
        
        <CTable 
          columns={columns} 
          data={users}
          selectionMode={selectedMode}
          onSelectionChange={handleSelectionChange}
          idField="id"
        />
      </section>
    </div>
  );
};

export default CTableDemo;
