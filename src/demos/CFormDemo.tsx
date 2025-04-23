import React, { useState } from 'react';
import CForm from '../components/CForm/CForm';
import { FormField } from '../components/CForm/types';

const CFormDemo: React.FC = () => {
  // Integrated form data with validation state and field configuration
  const [formData, setFormData] = useState<Record<string, FormField>>({
    username: { 
      id: 'username',
      name: 'Username',
      type: 'text',
      value: 'johndoe',
      onChange: (value) => handleChange('username', value),
      required: true,
      help: 'Enter your unique username',
      group: 'Account Information'
    },
    email: { 
      id: 'email',
      name: 'Email Address',
      type: 'text',
      value: 'john.doe@example.com',
      onChange: (value) => handleChange('email', value),
      required: true,
      help: 'We will never share your email',
      state: 'success',
      stateMessage: 'Email is valid',
      group: 'Account Information'
    },
    role: { 
      id: 'role',
      name: 'Role',
      type: 'select',
      value: 'user',
      onChange: (value) => handleChange('role', value),
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'Standard User' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' }
      ],
      help: 'Select your access role',
      group: 'Permissions'
    },
    age: { 
      id: 'age',
      name: 'Age',
      type: 'number',
      value: 30,
      onChange: (value) => handleChange('age', value),
      help: 'Must be at least 18 years old',
      state: 'warning',
      stateMessage: 'Age seems low for this role',
      group: 'Personal Details'
    },
    dob: { 
      id: 'dob',
      name: 'Date of Birth',
      type: 'date',
      value: '1993-01-15',
      onChange: (value) => handleChange('dob', value),
      help: 'Enter your birth date',
      group: 'Personal Details'
    },
    active: { 
      id: 'active',
      name: 'Active Status',
      type: 'boolean',
      value: true,
      onChange: (value) => handleChange('active', value),
      help: 'Set account status',
      group: 'Permissions'
    },
    availableDates: { 
      id: 'availableDates',
      name: 'Available Period',
      type: 'daterange',
      value: ['2023-10-01', '2023-10-15'] as [string | null, string | null],
      onChange: (value) => handleChange('availableDates', value),
      help: 'Select your availability period',
      group: 'Personal Details'
    }
  });

  // Loading state for the form
  const [loading, setLoading] = useState(false);

  // Handle changes to form fields with integrated validation
  const handleChange = (fieldId: string, value: any) => {
    // Create a copy of the current field
    const updatedField = { 
      ...formData[fieldId],
      value
    };

    // Field-specific validation
    switch (fieldId) {
      case 'email':
        if (!value) {
          updatedField.state = 'error';
          updatedField.stateMessage = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          updatedField.state = 'error';
          updatedField.stateMessage = 'Invalid email format';
        } else {
          updatedField.state = 'success';
          updatedField.stateMessage = 'Email is valid';
        }
        break;

      case 'age':
        if (value < 18) {
          updatedField.state = 'error';
          updatedField.stateMessage = 'Must be at least 18';
        } else if (value < 25 && formData.role.value === 'admin') {
          updatedField.state = 'warning';
          updatedField.stateMessage = 'Age seems low for this role';
        } else {
          updatedField.state = 'success';
          updatedField.stateMessage = 'Age is valid';
        }
        break;

      case 'role':
        // If role changes, we might need to re-validate age
        if (value === 'admin' && formData.age.value < 25) {
          setFormData(prev => ({
            ...prev,
            age: {
              ...prev.age,
              state: 'warning',
              stateMessage: 'Age seems low for this role'
            }
          }));
        } else if (formData.age.value < 18) {
          // Keep error state if age is still invalid
          // No changes needed
        } else {
          // Reset age warning if role is not admin
          setFormData(prev => ({
            ...prev,
            age: {
              ...prev.age,
              state: 'success',
              stateMessage: 'Age is valid'
            }
          }));
        }
        break;

      // Add other field validations as needed
    }

    // Update the form data with the validated field
    setFormData(prev => ({
      ...prev,
      [fieldId]: updatedField
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Extract just the values for submission
    const submissionData = Object.entries(formData).reduce(
      (acc, [key, field]) => ({ ...acc, [key]: field.value }), 
      {}
    );
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Form submitted successfully!\n\n' + JSON.stringify(submissionData, null, 2));
    }, 1500);
  };

  // Handle form cancel
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      // Create new onChange handlers for reset values
      const resetData = Object.entries(formData).reduce((acc, [key, field]) => {
        const resetField = {
          ...field,
          onChange: (value: any) => handleChange(key, value)
        };
        
        return { ...acc, [key]: resetField };
      }, {});
      
      // Reset to original field definitions with the new handlers
      setFormData(resetData);
    }
  };

  // For displaying current values, extract just the values
  const displayValues = Object.entries(formData).reduce(
    (acc, [key, field]) => ({ ...acc, [key]: field.value }), 
    {}
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xs font-bold mb-4">CForm Component</h1>

      {/* Component Demo */}
      <div className="mb-6">
        <CForm 
          fields={Object.values(formData)}
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
            {JSON.stringify(displayValues, null, 2)}
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
    name: { value: '', state: undefined, message: undefined },
    email: { value: '', state: undefined, message: undefined },
    role: { value: 'user', state: undefined, message: undefined }
  });

  const handleChange = (field, value) => {
    // Update value with validation
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], value }
    }));
  };

  const fields = [
    {
      id: 'name',
      name: 'Full Name',
      type: 'text',
      value: formData.name.value,
      onChange: (value) => handleChange('name', value),
      required: true,
      state: formData.name.state,
      stateMessage: formData.name.message,
      help: 'Enter your full name'
    },
    {
      id: 'email',
      name: 'Email',
      type: 'text',
      value: formData.email.value,
      onChange: (value) => handleChange('email', value),
      state: formData.email.state,
      stateMessage: formData.email.message,
      help: 'Your contact email'
    },
    {
      id: 'role',
      name: 'Role',
      type: 'select',
      value: formData.role.value,
      onChange: (value) => handleChange('role', value),
      state: formData.role.state,
      stateMessage: formData.role.message,
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' }
      ]
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Extract just the values for submission
    const submissionData = Object.entries(formData).reduce(
      (acc, [key, data]) => ({ ...acc, [key]: data.value }), 
      {}
    );
    
    console.log('Form submitted:', submissionData);
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
          <h3 className="text-xs font-medium mb-2">Form with Integrated Validation</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`// Example of integrated validation in the handleChange function
const handleChange = (field, value) => {
  // Create a copy of the current field data
  const updatedField = { 
    ...formData[field],
    value
  };

  // Field-specific validation
  if (field === 'email') {
    if (!value) {
      updatedField.state = 'error';
      updatedField.message = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(value)) {
      updatedField.state = 'error';
      updatedField.message = 'Invalid email format';
    } else {
      updatedField.state = 'success';
      updatedField.message = 'Email is valid';
    }
  }

  // Update the form data with the validated field
  setFormData(prev => ({
    ...prev,
    [field]: updatedField
  }));
};`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CFormDemo;
