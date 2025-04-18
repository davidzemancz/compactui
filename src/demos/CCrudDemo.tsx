import React, { useState, useMemo, useCallback, useEffect } from 'react';
import CFilter from '../components/CFilter/CFilter';
import CTable from '../components/CTable/CTable';
import CToolBar, { ToolBarItemOrSeparator } from '../components/CToolBar/CToolBar';
import CDrawerForm from '../components/CDrawerForm';
import CDrawer from '../components/CDrawer';
import CForm from '../components/CForm';
import CWizard, { WizardStep } from '../components/CWizard';
import { FilterValues, FilterField } from '../components/CFilter/types';
import { Column } from '../components/CTable/types';
import { FormField } from '../components/CForm/types';
import { 
  AddIcon, 
  EditIcon, 
  DeleteIcon, 
  RefreshIcon
} from '../components/CIcons';
import { generateUsers, getUserRoleOptions, User } from '../utils/sampleData';

// Our CRUD Actions enum
enum CrudAction {
  None = 'none',
  Create = 'create',
  CreateWizard = 'create-wizard',
  Edit = 'edit',
  View = 'view'
}

const CCrudDemo: React.FC = () => {
  // Generate initial sample data
  const initialUsers = useMemo(() => generateUsers(50), []);
  
  // State for users data
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});
  
  // State for selected user IDs - directly provided to CTable
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // State for CRUD operations
  const [crudAction, setCrudAction] = useState<CrudAction>(CrudAction.None);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  // Add a state to track the user being edited for re-selection after save
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  
  // Add a state to control the drawer's visibility
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Add a state to control the wizard drawer's visibility
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // Form fields definition
  const [formFields, setFormFields] = useState<FormField[]>([]);
  
  // Prepare form fields when current user or action changes
  useEffect(() => {
    if (crudAction === CrudAction.None || crudAction === CrudAction.CreateWizard) {
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
    { key: 'name', header: 'Jméno', dataType: 'link' }, // Simplified link column
    { key: 'email', header: 'Email', dataType: 'link' }, // Simplified link column
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
  
  // Table link click handler - updated to handle name column clicks
  const handleLinkClick = useCallback((rowId: any, columnKey: string, value: any) => {
    if (columnKey === 'email') {
      window.location.href = `mailto:${value}`;
    } else if (columnKey === 'name') {
      // When name is clicked, open the edit drawer
      const user = users.find(u => u.id === rowId);
      if (user) {
        setCrudAction(CrudAction.Edit);
        setCurrentUser({ ...user });
        setEditingUserId(user.id);
        setIsDrawerOpen(true);
      }
    }
  }, [users]);
  
  // Create toolbar items with memoization
  const toolbarItems: ToolBarItemOrSeparator[] = useMemo(() => [
    {
      id: 'add',
      label: 'Přidat',
      tooltip: 'Přidat nového uživatele',
      icon: <AddIcon />,
      onClick: () => handleToolbarAction('add')
    },
    {
      id: 'add-wizard',
      label: 'Přidat (Průvodce)',
      tooltip: 'Přidat nového uživatele pomocí průvodce',
      icon: <AddIcon />,
      onClick: () => handleToolbarAction('add-wizard')
    },
    {
      id: 'edit',
      label: 'Upravit',
      tooltip: 'Upravit vybraného uživatele',
      icon: <EditIcon />,
      onClick: () => handleToolbarAction('edit'),
      disabled: selectedIds.length !== 1
    },
    {
      id: 'delete',
      label: 'Odstranit',
      tooltip: 'Odstranit vybrané uživatele',
      icon: <DeleteIcon />,
      onClick: () => handleToolbarAction('delete'),
      disabled: selectedIds.length === 0
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
  ], [selectedIds]);
  
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
        // Open the drawer
        setIsDrawerOpen(true);
        break;
        
      case 'add-wizard':
        setCrudAction(CrudAction.CreateWizard);
        // Initialize a new user with a valid ID
        setCurrentUser({
          id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
          name: '',
          email: '',
          role: 'User',
          active: true,
          joined: new Date().toISOString().slice(0, 10),
          lastLogin: new Date().toISOString().slice(0, 10)
        });
        // Clear the editing user ID
        setEditingUserId(null);
        // Open the wizard drawer
        setIsWizardOpen(true);
        break;
        
      case 'edit':
        if (selectedIds.length === 1) {
          const user = users.find(u => u.id === selectedIds[0]);
          if (user) {
            setCrudAction(CrudAction.Edit);
            setCurrentUser({ ...user });
            // Save the ID of the user being edited for re-selection
            setEditingUserId(user.id);
            // Open the drawer
            setIsDrawerOpen(true);
          }
        }
        break;
        
      case 'delete':
        if (selectedIds.length > 0) {
          if (window.confirm(`Opravdu chcete odstranit ${selectedIds.length} uživatelů?`)) {
            const updatedUsers = users.filter(user => !selectedIds.includes(user.id));
            setUsers(updatedUsers);
            setSelectedIds([]);
          }
        }
        break;
        
      case 'refresh':
        setUsers([...initialUsers]);
        break;
        
      default:
        break;
    }
  }, [selectedIds, users, initialUsers]);
  
  // Form submission handler
  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        setSelectedIds([currentUser.id]);
      } else if (crudAction === CrudAction.Edit) {
        // Update existing user
        setUsers(prev => 
          prev.map(user => user.id === currentUser.id ? currentUser : user)
        );
        // Re-select the edited user if we have an ID
        if (editingUserId) {
          setSelectedIds([editingUserId]);
        }
      }
      
      // Reset state
      setFormLoading(false);
      setCrudAction(CrudAction.None);
      setCurrentUser(null);
      // Close the drawer
      setIsDrawerOpen(false);
    }, 800);
  };
  
  // Form cancel handler
  const handleFormCancel = () => {
    setCrudAction(CrudAction.None);
    setCurrentUser(null);
    // Close the drawer
    setIsDrawerOpen(false);
  };
  
  // Wizard completion handler
  const handleWizardComplete = (userData: User) => {
    setFormLoading(true);
    
    // Ensure we have a valid ID
    const finalUserData = {
      ...userData,
      id: userData.id || (users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1)
    };
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Add the new user
      setUsers(prev => [...prev, finalUserData]);
      // Select the newly created user
      setSelectedIds([finalUserData.id]);
      
      // Reset state
      setFormLoading(false);
      setCrudAction(CrudAction.None);
      setCurrentUser(null);
      // Close the wizard drawer
      setIsWizardOpen(false);
    }, 800);
  };
  
  // Wizard cancel handler
  const handleWizardCancel = () => {
    setCrudAction(CrudAction.None);
    setCurrentUser(null);
    // Close the wizard drawer
    setIsWizardOpen(false);
  };
  
  // Create a common interface for wizard step props
  interface WizardStepProps {
    formData: Partial<User>;
    updateFormData: (data: Partial<User>) => void;
  }

  // Components for wizard steps - standardized with proper typing and using CForm
  const BasicInfoStep: React.FC<WizardStepProps> = ({ formData, updateFormData }) => {
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    
    const validateName = (value: string) => {
      if (!value.trim()) {
        setNameError('Jméno je povinné');
        return false;
      }
      setNameError('');
      return true;
    };
    
    const validateEmail = (value: string) => {
      if (!value.trim()) {
        setEmailError('Email je povinný');
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        setEmailError('Neplatný formát emailu');
        return false;
      }
      setEmailError('');
      return true;
    };

    const handleFieldChange = (id: string, value: any) => {
      if (id === 'name') {
        validateName(value);
      }
      if (id === 'email') {
        validateEmail(value);
      }
      updateFormData({ [id]: value });
    };
    
    const fields: FormField[] = [
      {
        id: 'name',
        name: 'Jméno',
        type: 'text',
        value: formData.name || '',
        onChange: (value) => handleFieldChange('name', value),
        required: true,
        state: nameError ? 'error' : undefined,
        stateMessage: nameError,
        help: 'Celé jméno uživatele'
      },
      {
        id: 'email',
        name: 'Email',
        type: 'text',
        value: formData.email || '',
        onChange: (value) => handleFieldChange('email', value),
        required: true,
        state: emailError ? 'error' : undefined,
        stateMessage: emailError,
        help: 'Kontaktní email'
      }
    ];
    
    return <CForm fields={fields} />;
  };

  const PermissionsStep: React.FC<WizardStepProps> = ({ formData, updateFormData }) => {
    const handleFieldChange = (id: string, value: any) => {
      updateFormData({ [id]: value });
    };
    
    const fields: FormField[] = [
      {
        id: 'role',
        name: 'Role',
        type: 'select',
        value: formData.role || 'User',
        onChange: (value) => handleFieldChange('role', value),
        options: getUserRoleOptions(),
        help: 'Oprávnění uživatele'
      },
      {
        id: 'active',
        name: 'Status účtu',
        type: 'boolean',
        value: formData.active !== undefined ? formData.active : true,
        onChange: (value) => handleFieldChange('active', value),
        help: 'Aktivní stav účtu uživatele'
      }
    ];
    
    return <CForm fields={fields} />;
  };

  const DatesStep: React.FC<WizardStepProps> = ({ formData, updateFormData }) => {
    const today = new Date().toISOString().slice(0, 10);
    
    const handleFieldChange = (id: string, value: any) => {
      updateFormData({ [id]: value });
    };
    
    const fields: FormField[] = [
      {
        id: 'joined',
        name: 'Datum registrace',
        type: 'date',
        value: formData.joined || today,
        onChange: (value) => handleFieldChange('joined', value),
        help: 'Datum vytvoření účtu'
      },
      {
        id: 'lastLogin',
        name: 'Poslední přihlášení',
        type: 'date',
        value: formData.lastLogin || today,
        onChange: (value) => handleFieldChange('lastLogin', value),
        help: 'Datum posledního přihlášení'
      }
    ];
    
    return <CForm fields={fields} />;
  };

  const SummaryStep: React.FC<WizardStepProps> = ({ formData }) => {
    return (
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-gray-700">Shrnutí informací</h3>
        
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-xs font-medium text-gray-500">Jméno:</dt>
            <dd className="text-xs text-gray-700">{formData.name}</dd>
            
            <dt className="text-xs font-medium text-gray-500">Email:</dt>
            <dd className="text-xs text-gray-700">{formData.email}</dd>
            
            <dt className="text-xs font-medium text-gray-500">Role:</dt>
            <dd className="text-xs text-gray-700">{formData.role}</dd>
            
            <dt className="text-xs font-medium text-gray-500">Status:</dt>
            <dd className="text-xs text-gray-700">{formData.active ? 'Aktivní' : 'Neaktivní'}</dd>
            
            <dt className="text-xs font-medium text-gray-500">Datum registrace:</dt>
            <dd className="text-xs text-gray-700">{formData.joined}</dd>
            
            <dt className="text-xs font-medium text-gray-500">Poslední přihlášení:</dt>
            <dd className="text-xs text-gray-700">{formData.lastLogin}</dd>
          </dl>
        </div>
        
        <p className="text-xs text-gray-600">
          Klikněte na "Dokončit" pro vytvoření uživatele nebo se vraťte zpět pro úpravu informací.
        </p>
      </div>
    );
  };
  
  // Wizard step definitions with improved validation
  const wizardSteps: WizardStep[] = [
    {
      id: 'basic-info',
      title: 'Základní informace',
      description: 'Zadejte jméno a email uživatele.',
      component: <BasicInfoStep />,
      validate: (stepData) => {
        if (!stepData.name?.trim()) {
          return { valid: false, message: 'Prosím vyplňte jméno.' };
        }
        if (!stepData.email?.trim()) {
          return { valid: false, message: 'Prosím vyplňte email.' };
        }
        if (!/^\S+@\S+\.\S+$/.test(stepData.email)) {
          return { valid: false, message: 'Prosím zadejte platný email.' };
        }
        return { valid: true };
      }
    },
    {
      id: 'permissions',
      title: 'Oprávnění',
      description: 'Nastavte roli a status účtu.',
      component: <PermissionsStep />,
      validate: (stepData) => {
        if (!stepData.role) {
          return { valid: false, message: 'Prosím vyberte roli.' };
        }
        return { valid: true };
      }
    },
    {
      id: 'dates',
      title: 'Časové údaje',
      description: 'Nastavte datumy registrace a posledního přihlášení.',
      component: <DatesStep />,
      validate: (stepData) => {
        if (!stepData.joined) {
          return { valid: false, message: 'Prosím vyberte datum registrace.' };
        }
        if (!stepData.lastLogin) {
          return { valid: false, message: 'Prosím vyberte datum posledního přihlášení.' };
        }
        return { valid: true };
      }
    },
    {
      id: 'summary',
      title: 'Souhrn',
      description: 'Zkontrolujte zadané informace před vytvořením uživatele.',
      component: <SummaryStep />
    }
  ];
  
  return (
    <div className="h-full flex flex-col">
      {/* Main UI - Table with filters and toolbar - Always visible */}
      <div className="overflow-hidden shrink-0">
        <CFilter
          fields={filterFields}
          onFilterApply={setAppliedFilters}
          required={filteredUsers.length === 0 && users.length > 0}
          className="p-2"
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
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onLinkClicked={handleLinkClick}
            storageKey="crud-users-table"
            allowSelectionModeChange={true}
          />
        </div>
      </div>
      
      {/* Standard Drawer Form for Edit operations */}
      <CDrawerForm
        isOpen={isDrawerOpen}
        onClose={handleFormCancel}
        title={crudAction === CrudAction.Create ? 'Přidat uživatele' : 'Upravit uživatele'}
        fields={formFields}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        submitLabel="Uložit"
        cancelLabel="Zrušit"
        onCancel={handleFormCancel}
      />
      
      {/* Wizard Drawer for Create operations */}
      {isWizardOpen && (
        <CDrawer
          isOpen={isWizardOpen}
          onClose={handleWizardCancel}
          title="Přidat nového uživatele"
          position="right"
        >
          <CWizard
            steps={wizardSteps}
            onComplete={handleWizardComplete}
            onCancel={handleWizardCancel}
            initialData={currentUser || {}}
            loading={formLoading}
            className="border-0 shadow-none"
          />
        </CDrawer>
      )}
    </div>
  );
};

export default CCrudDemo;
