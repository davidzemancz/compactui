import React, { useState, useMemo } from 'react';
import CFilter from '../components/CFilter/CFilter';
import CTable from '../components/CTable/CTable';
import { FilterValues, FilterField } from '../components/CFilter/types';
import { Column } from '../components/CTable/types';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
    joined: string;
    lastLogin: string;
}

// Generate sample user data
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

        // Generate random dates
        const now = new Date();
        const joinedDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        const lastLoginDate = new Date(joinedDate.getTime() + Math.random() * (now.getTime() - joinedDate.getTime()));

        const joined = joinedDate.toISOString().slice(0, 10);
        const lastLogin = lastLoginDate.toISOString().slice(0, 10);

        return { id, name, email, role, active, joined, lastLogin };
    });
};

const CFilteredTable: React.FC = () => {
    // Generate sample data
    const allUsers = useMemo(() => generateUsers(100), []);

    // State for applied filters
    const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});

    // Filter field definitions
    const filterFields: FilterField[] = [
        {
            id: 'name',
            label: 'Jméno',
            type: 'text',
            placeholder: 'Hledat podle jména'
        },
        {
            id: 'role',
            label: 'Role',
            type: 'select',
            options: [
                { value: 'Admin', label: 'Administrátor' },
                { value: 'Manager', label: 'Manažer' },
                { value: 'Developer', label: 'Vývojář' },
                { value: 'Designer', label: 'Designér' },
                { value: 'Tester', label: 'Tester' },
                { value: 'User', label: 'Uživatel' }
            ]
        },
        {
            id: 'active',
            label: 'Aktivní',
            type: 'boolean'
        },
        {
            id: 'joined',
            label: 'Datum registrace',
            type: 'daterange'
        }
    ];

    // Table column definitions
    const columns: Column[] = [
        { key: 'id', header: 'ID', dataType: 'int' },
        { key: 'name', header: 'Jméno', dataType: 'string' },
        { key: 'email', header: 'Email', dataType: 'link', linkText: 'Poslat email' },
        { key: 'role', header: 'Role', dataType: 'string' },
        { key: 'active', header: 'Aktivní', dataType: 'bool' },
        { key: 'joined', header: 'Registrace', dataType: 'datetime', dateFormat: 'yyyy-MM-dd' },
        { key: 'lastLogin', header: 'Poslední přihlášení', dataType: 'datetime', dateFormat: 'yyyy-MM-dd' }
    ];

    // Handler for when a table link is clicked
    const handleLinkClick = (rowId: any, columnKey: string, value: any) => {
        alert(`Otevírání emailu pro: ${value}`);
    };

    // Handler for when selection changes
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    // Apply filters to the data
    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            return Object.entries(appliedFilters).every(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    return true; // Skip empty filters
                }

                switch (key) {
                    case 'name':
                        return user.name.toLowerCase().includes(String(value).toLowerCase());
                    case 'role':
                        return user.role === value;
                    case 'active':
                        return user.active === value;
                    case 'joined':
                        {
                            if (!Array.isArray(value)) return true;

                            const userJoinDate = new Date(user.joined);
                            const [startDate, endDate] = value;

                            const isAfterStart = !startDate || userJoinDate >= new Date(startDate);
                            const isBeforeEnd = !endDate || userJoinDate <= new Date(endDate);

                            return isAfterStart && isBeforeEnd;
                        }
                    default:
                        return true;
                }
            });
        });
    }, [allUsers, appliedFilters]);

    return (
        <div className="space-y-6">
            <h1 className="text-xs font-bold mb-4">Filtrovaná tabulka</h1>

            {/* Filter section */}
            <div className="mb-4">
                <CFilter
                    fields={filterFields}
                    onFilterApply={setAppliedFilters}
                    required={filteredUsers.length === 0 && allUsers.length > 0}
                />
            </div>


            {/* Table section */}
            <div className="h-96 bg-white rounded shadow overflow-hidden">
                <CTable
                    columns={columns}
                    data={filteredUsers}
                    selectionMode="multi"
                    onSelectionChange={setSelectedUsers}
                    onLinkClicked={handleLinkClick}
                    storageKey="filtered-users-table"
                />
            </div>


            {/* Usage information */}
            <div className="bg-gray-50 rounded p-4 text-xs text-gray-700 mt-8">
                <h3 className="font-medium mb-2">Použití kombinace CFilter a CTable</h3>
                <p className="mb-2">
                    Tento příklad ukazuje, jak lze propojit komponenty CFilter a CTable pro vytvoření
                    interaktivní filtrované tabulky dat. Filtry se aplikují pomocí tlačítka "Zobrazit"
                    a výsledky jsou okamžitě aktualizovány v tabulce.
                </p>
                <p>
                    Všimněte si, že při filtrování se zachovává výběr řádků a nastavení tabulky je
                    uchováno v localStorage díky vlastnosti <code>storageKey</code>.
                </p>
            </div>
        </div>
    );
};

export default CFilteredTable;
