import React, { useState } from 'react';
import CForm from '../components/CForm/CForm';
import { FormField, FieldState } from '../components/CForm/types';

const CFormDemo: React.FC = () => {
  // Sample user data for the form
  const [formData, setFormData] = useState({
    username: 'johndoe',
    email: 'john.doe@example.com',
    role: 'user',
    age: 30,
    active: true,
    dob: '1993-01-15',
    availableDates: ['2023-10-01', '2023-10-15'] as [string | null, string | null]
  });

  // Field state tracking
  const [fieldStates, setFieldStates] = useState<Record<string, { state: FieldState; message?: string }>>({
    email: { state: 'success', message: 'Email is valid' },
    age: { state: 'warning', message: 'Age seems low for this role' }
  });

  // Loading state for the form
  const [loading, setLoading] = useState(false);

  // Handle changes to form fields
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Example validation for email field
    if (field === 'email') {
      if (!value) {
        setFieldStates(prev => ({
          ...prev,
          email: { state: 'error', message: 'Email is required' }
        }));
      } else if (!/^\S+@\S+\.\S+$/.test(value)) {
        setFieldStates(prev => ({
          ...prev,
          email: { state: 'error', message: 'Invalid email format' }
        }));
      } else {
        setFieldStates(prev => ({
          ...prev,
          email: { state: 'success', message: 'Email is valid' }
        }));
      }
    }

    // Example validation for age field
    if (field === 'age') {
      if (value < 18) {
        setFieldStates(prev => ({
          ...prev,
          age: { state: 'error', message: 'Must be at least 18' }
        }));
      } else if (value < 25 && formData.role === 'admin') {
        setFieldStates(prev => ({
          ...prev,
          age: { state: 'warning', message: 'Age seems low for this role' }
        }));
      } else {
        setFieldStates(prev => ({
          ...prev,
          age: { state: 'success', message: 'Age is valid' }
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Form submitted successfully!\n\n' + JSON.stringify(formData, null, 2));
    }, 1500);
  };

  // Handle form cancel
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      // Reset the form data to initial values
      setFormData({
        username: 'johndoe',
        email: 'john.doe@example.com',
        role: 'user',
        age: 30,
        active: true,
        dob: '1993-01-15',
        availableDates: ['2023-10-01', '2023-10-15'] as [string | null, string | null]
      });
    }
  };

  // Form fields configuration
  const fields: FormField[] = [
    {
      id: 'username',
      name: 'Username',
      type: 'text',
      value: formData.username,
      onChange: (value) => handleChange('username', value),
      required: true,
      help: 'Enter your unique username',
      state: fieldStates.username?.state,
      stateMessage: fieldStates.username?.message
    },
    {
      id: 'email',
      name: 'Email Address',
      type: 'text',
      value: formData.email,
      onChange: (value) => handleChange('email', value),
      required: true,
      help: 'We will never share your email',
      state: fieldStates.email?.state,
      stateMessage: fieldStates.email?.message
    },
    {
      id: 'role',
      name: 'Role',
      type: 'select',
      value: formData.role,
      onChange: (value) => handleChange('role', value),
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'Standard User' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' }
      ],
      help: 'Select your access role',
      state: fieldStates.role?.state,
      stateMessage: fieldStates.role?.message
    },
    {
      id: 'age',
      name: 'Age',
      type: 'number',
      value: formData.age,
      onChange: (value) => handleChange('age', value),
      help: 'Must be at least 18 years old',
      state: fieldStates.age?.state,
      stateMessage: fieldStates.age?.message
    },
    {
      id: 'active',
      name: 'Active Status',
      type: 'boolean',
      value: formData.active,
      onChange: (value) => handleChange('active', value),
      help: 'Set account status',
      state: fieldStates.active?.state,
      stateMessage: fieldStates.active?.message
    },
    {
      id: 'dob',
      name: 'Date of Birth',
      type: 'date',
      value: formData.dob,
      onChange: (value) => handleChange('dob', value),
      help: 'Enter your birth date',
      state: fieldStates.dob?.state,
      stateMessage: fieldStates.dob?.message
    },
    {
      id: 'availableDates',
      name: 'Available Period',
      type: 'daterange',
      value: formData.availableDates,
      onChange: (value) => handleChange('availableDates', value),
      help: 'Select your availability period',
      state: fieldStates.availableDates?.state,
      stateMessage: fieldStates.availableDates?.message
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xs font-bold mb-4">CForm Component</h1>

      {/* Component Demo */}
      <div className="mb-6">
        <CForm 
          fields={fields} 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          submitLabel="Save Changes"
          cancelLabel="Reset Form"
        />
      </div>
      
      {/* Description and Features */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Overview</h2>
        <p className="text-xs text-gray-700 mb-4">
          A form component that displays fields in a table-like structure with labels, inputs, state indicators, and help text.
        </p>
        
        <h3 className="text-xs font-semibold mb-2">Features</h3>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700 mb-4">
          <li>Supports multiple input types: text, number, select, date, daterange, boolean</li>
          <li>Displays field state (error, success, warning, loading)</li>
          <li>Includes help text for each field</li>
          <li>Required field indicators</li>
          <li>Form-level loading state</li>
          <li>Submit and cancel actions</li>
          <li>Customizable button labels</li>
          <li>Support for custom field components</li>
        </ul>
      </div>
      
      {/* Current Form Values Display */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Current Form Values</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
      
      {/* Code Examples */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Usage Examples</h2>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Basic Usage</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`import { CForm } from 'compactui';
import { useState } from 'react';

function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  const fields = [
    {
      id: 'name',
      name: 'Full Name',
      type: 'text',
      value: formData.name,
      onChange: (value) => setFormData(prev => ({ ...prev, name: value })),
      required: true,
      help: 'Enter your full name'
    },
    {
      id: 'email',
      name: 'Email',
      type: 'text',
      value: formData.email,
      onChange: (value) => setFormData(prev => ({ ...prev, email: value })),
      help: 'Your contact email'
    },
    {
      id: 'role',
      name: 'Role',
      type: 'select',
      value: formData.role,
      onChange: (value) => setFormData(prev => ({ ...prev, role: value })),
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' }
      ]
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <CForm 
      fields={fields} 
      onSubmit={handleSubmit}
      submitLabel="Save"
    />
  );
}`}
            </pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Form with Validation States</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`// Example of adding validation states to fields
const [fieldStates, setFieldStates] = useState({
  email: { state: 'error', message: 'Invalid email format' },
  password: { state: 'success', message: 'Strong password' }
});

// Then in your field definition:
{
  id: 'email',
  name: 'Email',
  type: 'text',
  value: formData.email,
  onChange: (value) => {
    setFormData(prev => ({ ...prev, email: value }));
    
    // Validate email format
    if (!value) {
      setFieldStates(prev => ({
        ...prev, 
        email: { state: 'error', message: 'Email is required' }
      }));
    } else if (!/\\S+@\\S+\\.\\S+/.test(value)) {
      setFieldStates(prev => ({
        ...prev, 
        email: { state: 'error', message: 'Invalid email format' }
      }));
    } else {
      setFieldStates(prev => ({
        ...prev, 
        email: { state: 'success', message: 'Email is valid' }
      }));
    }
  },
  state: fieldStates.email?.state,
  stateMessage: fieldStates.email?.message
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CFormDemo;
