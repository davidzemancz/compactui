import React, { useState, useMemo } from 'react';
import CFilter from '../components/CFilter/CFilter';
import CTable from '../components/CTable/CTable';
import CToolBar, { ToolBarItemOrSeparator } from '../components/CToolBar/CToolBar';
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

// Renamed from CFilteredTable to CFilteredTableDemo
const CFilteredTableDemo: React.FC = () => {
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

    // Create toolbar items
    const toolbarItems: ToolBarItemOrSeparator[] = [
        {
            id: 'add',
            label: 'Přidat',
            tooltip: 'Přidat nový záznam',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            onClick: () => alert('Add button clicked')
        },
        {
            id: 'edit',
            label: 'Upravit',
            tooltip: 'Upravit vybraný záznam',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            ),
            onClick: () => alert('Edit button clicked'),
            disabled: selectedUsers.length !== 1
        },
        {
            id: 'delete',
            label: 'Odstranit',
            tooltip: 'Odstranit vybrané záznamy',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            onClick: () => alert('Delete button clicked'),
            disabled: selectedUsers.length === 0
        },
        {
            id: 'separator1',
            type: 'separator'
        },
        {
            id: 'refresh',
            label: 'Obnovit',
            tooltip: 'Obnovit data',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            onClick: () => alert('Refresh button clicked')
        }
    ];

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Filter section - Remove horizontal scrolling */}
            <div className="overflow-hidden shrink-0">
                <CFilter
                    fields={filterFields}
                    onFilterApply={setAppliedFilters}
                    required={filteredUsers.length === 0 && allUsers.length > 0}
                    className="p-3"
                />
            </div>

            {/* Table section with toolbar */}
            <div className="flex-1 min-h-0 bg-white rounded shadow overflow-hidden flex flex-col">
                <CToolBar items={toolbarItems} />
                
                <div className="overflow-x-auto overflow-y-auto flex-1">
                    <CTable
                        columns={columns}
                        data={filteredUsers}
                        selectionMode="single"
                        onSelectionChange={setSelectedUsers}
                        onLinkClicked={handleLinkClick}
                        storageKey="filtered-users-table"
                        allowSelectionModeChange={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default CFilteredTableDemo;
