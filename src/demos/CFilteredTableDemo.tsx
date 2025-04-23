import React, { useState, useMemo, useCallback } from 'react';
import CFilter from '../components/CFilter/CFilter';
import CTable from '../components/CTable/CTable';
import CToolBar, { ToolBarItemOrSeparator } from '../components/CToolBar/CToolBar';
import { FilterValues, FilterField } from '../components/CFilter/types';
import { Column } from '../components/CTable/types';
import { AddIcon, EditIcon, DeleteIcon, RefreshIcon } from '../components/CIcons';
import { generateUsers, getUserRoleOptions } from '../utils/sampleData';

const CFilteredTableDemo: React.FC = () => {
    // Generate sample data only once
    const allUsers = useMemo(() => generateUsers(100), []);

    // State for applied filters
    const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});

    // State for user selection
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    // Filter field definitions with reusable role options
    const filterFields: FilterField[] = useMemo(() => [
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
            options: getUserRoleOptions()
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
    ], []);

    // Table column definitions (memoized to prevent unnecessary rerenders)
    const columns: Column[] = useMemo(() => [
        { key: 'id', header: 'ID', dataType: 'int' },
        { key: 'name', header: 'Jméno', dataType: 'string' },
        { key: 'email', header: 'Email', dataType: 'link', linkText: 'Poslat email' },
        { key: 'role', header: 'Role', dataType: 'string' },
        { key: 'active', header: 'Aktivní', dataType: 'bool' },
        { key: 'joined', header: 'Registrace', dataType: 'datetime', dateFormat: 'yyyy-MM-dd' },
        { key: 'lastLogin', header: 'Poslední přihlášení', dataType: 'datetime', dateFormat: 'yyyy-MM-dd' }
    ], []);

    // Handler for when a table link is clicked (memoized with useCallback)
    const handleLinkClick = useCallback((value: any) => {
        console.log('Link clicked:', value);
        alert(`Otevírání emailu pro: ${value}`);
    }, []);

    // Apply filters to the data (optimized implementation)
    const filteredUsers = useMemo(() => {
        if (Object.keys(appliedFilters).length === 0) {
            return allUsers; // Return all data if no filters applied
        }

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
                        if (!Array.isArray(value)) return true;

                        const userJoinDate = new Date(user.joined);
                        const [startDate, endDate] = value;

                        const isAfterStart = !startDate || userJoinDate >= new Date(startDate);
                        const isBeforeEnd = !endDate || userJoinDate <= new Date(endDate);

                        return isAfterStart && isBeforeEnd;
                    default:
                        return true;
                }
            });
        });
    }, [allUsers, appliedFilters]);

    // Create toolbar items with memoization
    const toolbarItems: ToolBarItemOrSeparator[] = useMemo(() => [
        {
            id: 'add',
            label: 'Přidat',
            tooltip: 'Přidat nový záznam',
            icon: <AddIcon />,
            onClick: () => handleToolbarAction('add')
        },
        {
            id: 'edit',
            label: 'Upravit',
            tooltip: 'Upravit vybraný záznam',
            icon: <EditIcon />,
            onClick: () => handleToolbarAction('edit'),
            disabled: selectedUsers.length !== 1
        },
        {
            id: 'delete',
            label: 'Odstranit',
            tooltip: 'Odstranit vybrané záznamy',
            icon: <DeleteIcon />,
            onClick: () => handleToolbarAction('delete'),
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
            icon: <RefreshIcon />,
            onClick: () => handleToolbarAction('refresh')
        }
    ], [selectedUsers]);

    // Centralized toolbar action handler
    const handleToolbarAction = useCallback((action: string) => {
        switch (action) {
            case 'add':
                alert('Adding new user');
                break;
            case 'edit':
                if (selectedUsers.length === 1) {
                    const user = filteredUsers.find(u => u.id === selectedUsers[0]);
                    alert(`Editing user: ${user?.name}`);
                }
                break;
            case 'delete':
                if (selectedUsers.length > 0) {
                    alert(`Deleting ${selectedUsers.length} users`);
                }
                break;
            case 'refresh':
                alert('Refreshing data');
                break;
            default:
                break;
        }
    }, [selectedUsers, filteredUsers]);

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Filter section */}
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
