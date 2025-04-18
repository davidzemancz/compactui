import React, { useState, useMemo, useCallback, useEffect } from 'react';
import CFilter from '../components/CFilter/CFilter';
import CTable from '../components/CTable/CTable';
import CToolBar, { ToolBarItemOrSeparator } from '../components/CToolBar/CToolBar';
import CForm from '../components/CForm/CForm';
import { FilterValues, FilterField } from '../components/CFilter/types';
import { Column } from '../components/CTable/types';
import { FormField } from '../components/CForm/types';
import { 
  AddIcon, 
  EditIcon, 
  DeleteIcon, 
  RefreshIcon, 
  SaveIcon, 
  CloseIcon 
} from '../components/CIcons';
import { generateUsers, getUserRoleOptions, User } from '../utils/sampleData';

// Our CRUD Actions enum
enum CrudAction {
  None = 'none',
  Create = 'create',
  Edit = 'edit',
  View = 'view'
}

const CCrudDemo: React.FC = () => {
  // Generate initial sample data
  const initialUsers = useMemo(() => generateUsers(50), []);
  
  // State for users data
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});
  
  // State for CRUD operations
  const [crudAction, setCrudAction] = useState<CrudAction>(CrudAction.None);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  // Add a state to track the user being edited for re-selection after save
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  
  // Form fields definition
  const [formFields, setFormFields] = useState<FormField[]>([]);
  
  // Prepare form fields when current user or action changes
  useEffect(() => {
    if (crudAction === CrudAction.None) {
      setFormFields([]);
      return;
    }
    
    // Default values for new user
    const userValues = currentUser || {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: '',
      email: '',
      role: 'User',
      active: true,
      joined: new Date().toISOString().slice(0, 10),
      lastLogin: new Date().toISOString().slice(0, 10)
    };
    
    // Create form fields based on the current user
    setFormFields([
      {
        id: 'name',
        name: 'Jméno',
        type: 'text',
        value: userValues.name,
        onChange: (value) => handleFieldChange('name', value),
        required: true,
        help: 'Celé jméno uživatele',
        group: 'Základní informace'
      },
      {
        id: 'email',
        name: 'Email',
        type: 'text',
        value: userValues.email,
        onChange: (value) => handleFieldChange('email', value),
        required: true,
        help: 'Kontaktní email',
        group: 'Základní informace'
      },
      {
        id: 'role',
        name: 'Role',
        type: 'select',
        value: userValues.role,
        onChange: (value) => handleFieldChange('role', value),
        options: getUserRoleOptions(),
        help: 'Oprávnění uživatele',
        group: 'Oprávnění'
      },
      {
        id: 'active',
        name: 'Aktivní',
        type: 'boolean',
        value: userValues.active,
        onChange: (value) => handleFieldChange('active', value),
        help: 'Stav účtu uživatele',
        group: 'Oprávnění'
      },
      {
        id: 'joined',
        name: 'Datum registrace',
        type: 'date',
        value: userValues.joined,
        onChange: (value) => handleFieldChange('joined', value),
        help: 'Datum vytvoření účtu',
        group: 'Časové údaje',
        disabled: crudAction === CrudAction.Edit // Can't change join date in edit
      },
      {
        id: 'lastLogin',
        name: 'Poslední přihlášení',
        type: 'date',
        value: userValues.lastLogin,
        onChange: (value) => handleFieldChange('lastLogin', value),
        help: 'Datum posledního přihlášení',
        group: 'Časové údaje',
        disabled: crudAction === CrudAction.Edit // Can't change last login in edit
      }
    ]);
  }, [currentUser, crudAction, users]);
  
  // Handle form field changes
  const handleFieldChange = (fieldId: string, value: any) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      return { ...prev, [fieldId]: value };
    });
    
    // Validate email format in real-time
    if (fieldId === 'email') {
      const emailField = formFields.find(field => field.id === 'email');
      if (emailField) {
        const updatedField = { ...emailField };
        
        if (!value) {
          updatedField.state = 'error';
          updatedField.stateMessage = 'Email je povinný';
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          updatedField.state = 'error';
          updatedField.stateMessage = 'Neplatný formát emailu';
        } else {
          updatedField.state = 'success';
          updatedField.stateMessage = 'Email je platný';
        }
        
        setFormFields(prev => 
          prev.map(field => field.id === 'email' ? updatedField : field)
        );
      }
    }
  };
  
  // Table column definitions
  const columns: Column[] = useMemo(() => [
    { key: 'id', header: 'ID', dataType: 'int' },
    { key: 'name', header: 'Jméno', dataType: 'string' },
    { key: 'email', header: 'Email', dataType: 'link', linkText: 'Odeslat email' },
    { key: 'role', header: 'Role', dataType: 'string' },
    { key: 'active', header: 'Aktivní', dataType: 'bool' },
    { key: 'joined', header: 'Registrace', dataType: 'datetime', dateFormat: 'yyyy-MM-dd' },
    { key: 'lastLogin', header: 'Poslední přihlášení', dataType: 'datetime', dateFormat: 'yyyy-MM-dd' }
  ], []);
  
  // Filter field definitions
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
  
  // Apply filters to users
  useEffect(() => {
    if (Object.keys(appliedFilters).length === 0) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => {
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
    
    setFilteredUsers(filtered);
  }, [users, appliedFilters]);
  
  // Table link click handler
  const handleLinkClick = useCallback((rowId: any, columnKey: string, value: any) => {
    if (columnKey === 'email') {
      window.location.href = `mailto:${value}`;
    }
  }, []);
  
  // Create toolbar items with memoization
  const toolbarItems: ToolBarItemOrSeparator[] = useMemo(() => [
    {
      id: 'add',
      label: 'Přidat',
      tooltip: 'Přidat nového uživatele',
      icon: <AddIcon />,
      onClick: () => handleToolbarAction('add'),
      disabled: crudAction !== CrudAction.None
    },
    {
      id: 'edit',
      label: 'Upravit',
      tooltip: 'Upravit vybraného uživatele',
      icon: <EditIcon />,
      onClick: () => handleToolbarAction('edit'),
      disabled: selectedUsers.length !== 1 || crudAction !== CrudAction.None
    },
    {
      id: 'delete',
      label: 'Odstranit',
      tooltip: 'Odstranit vybrané uživatele',
      icon: <DeleteIcon />,
      onClick: () => handleToolbarAction('delete'),
      disabled: selectedUsers.length === 0 || crudAction !== CrudAction.None
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
      onClick: () => handleToolbarAction('refresh'),
      disabled: crudAction !== CrudAction.None
    }
  ], [selectedUsers, crudAction]);
  
  // Form action buttons
  const formToolbarItems: ToolBarItemOrSeparator[] = useMemo(() => [
    {
      id: 'save',
      label: 'Uložit',
      tooltip: 'Uložit změny',
      icon: <SaveIcon />,
      onClick: () => handleFormSubmit(),
      disabled: formLoading
    },
    {
      id: 'cancel',
      label: 'Zrušit',
      tooltip: 'Zrušit změny',
      icon: <CloseIcon />,
      onClick: () => handleFormCancel(),
      disabled: formLoading
    }
  ], [formLoading]);
  
  // Toolbar action handlers
  const handleToolbarAction = useCallback((action: string) => {
    switch (action) {
      case 'add':
        setCrudAction(CrudAction.Create);
        setCurrentUser({
          id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
          name: '',
          email: '',
          role: 'User',
          active: true,
          joined: new Date().toISOString().slice(0, 10),
          lastLogin: new Date().toISOString().slice(0, 10)
        });
        // Clear the editing user ID when adding a new user
        setEditingUserId(null);
        break;
        
      case 'edit':
        if (selectedUsers.length === 1) {
          const user = users.find(u => u.id === selectedUsers[0]);
          if (user) {
            setCrudAction(CrudAction.Edit);
            setCurrentUser({ ...user });
            // Save the ID of the user being edited for re-selection
            setEditingUserId(user.id);
          }
        }
        break;
        
      case 'delete':
        if (selectedUsers.length > 0) {
          if (window.confirm(`Opravdu chcete odstranit ${selectedUsers.length} uživatelů?`)) {
            const updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
            setUsers(updatedUsers);
            setSelectedUsers([]);
          }
        }
        break;
        
      case 'refresh':
        setUsers([...initialUsers]);
        break;
        
      default:
        break;
    }
  }, [selectedUsers, users, initialUsers]);
  
  // Form submission handler
  const handleFormSubmit = () => {
    if (!currentUser) return;
    
    // Check if email field has error state
    const emailField = formFields.find(field => field.id === 'email');
    if (emailField && emailField.state === 'error') {
      alert('Formulář obsahuje chyby. Prosím opravte je před odesláním.');
      return;
    }
    
    setFormLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (crudAction === CrudAction.Create) {
        // Add new user
        setUsers(prev => [...prev, currentUser]);
        // Select the newly created user
        setSelectedUsers([currentUser.id]);
      } else if (crudAction === CrudAction.Edit) {
        // Update existing user
        setUsers(prev => 
          prev.map(user => user.id === currentUser.id ? currentUser : user)
        );
        // Re-select the edited user if we have an ID
        if (editingUserId) {
          setSelectedUsers([editingUserId]);
        }
      }
      
      // Reset state
      setFormLoading(false);
      setCrudAction(CrudAction.None);
      setCurrentUser(null);
    }, 800);
  };
  
  // Form cancel handler
  const handleFormCancel = () => {
    setCrudAction(CrudAction.None);
    setCurrentUser(null);
  };
  
  // Handle form submission via CForm
  const handleFormSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit();
  };
  
  return (
    <div className="space-y-4 h-full flex flex-col">
      <h1 className="text-xs font-bold mb-4">CRUD Demo</h1>
      
      {crudAction === CrudAction.None ? (
        // Main UI - Table with filters and toolbar
        <>
          {/* Filter section */}
          <div className="overflow-hidden shrink-0">
            <CFilter
              fields={filterFields}
              onFilterApply={setAppliedFilters}
              required={filteredUsers.length === 0 && users.length > 0}
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
                selectionMode="multi"
                onSelectionChange={setSelectedUsers}
                onLinkClicked={handleLinkClick}
                storageKey="crud-users-table"
                allowSelectionModeChange={true}
              />
            </div>
          </div>
          
          {/* Status bar */}
          <div className="bg-white p-2 rounded shadow text-xs text-gray-500">
            Celkem uživatelů: {users.length} | Zobrazeno: {filteredUsers.length} | Vybráno: {selectedUsers.length}
          </div>
        </>
      ) : (
        // Form UI - For creating or editing users
        <div className="flex-1 flex flex-col">
          <div className="mb-2">
            <CToolBar items={formToolbarItems} />
          </div>
          
          <div className="flex-1 overflow-auto">
            <CForm
              fields={formFields}
              onSubmit={handleFormSubmitEvent}
              loading={formLoading}
              submitLabel="Uložit"
              cancelLabel="Zrušit"
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CCrudDemo;
