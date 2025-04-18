import React from 'react';
import { CFormProps, FormField, FieldState } from './types';
import CTextInput from '../CTextInput';
import CNumberField from '../CNumberField';
import CSelectField from '../CSelectField';
import CDateField from '../CDateField';
import CDateRangeField from '../CDateRangeField';
import CBooleanField from '../CBooleanField';

const CForm: React.FC<CFormProps> = ({ 
  fields, 
  className = '',
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  loading = false
}) => {
  // Render the appropriate field component based on type
  const renderField = (field: FormField) => {
    const commonProps = {
      disabled: field.disabled || loading,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'text':
        return (
          <CTextInput
            value={field.value || ''}
            onChange={field.onChange}
            {...commonProps}
          />
        );
      case 'number':
        return (
          <CNumberField
            value={field.value}
            onChange={field.onChange}
            {...commonProps}
          />
        );
      case 'select':
        return (
          <CSelectField
            value={field.value}
            onChange={field.onChange}
            options={field.options || []}
            {...commonProps}
          />
        );
      case 'date':
        return (
          <CDateField
            value={field.value}
            onChange={field.onChange}
            {...commonProps}
          />
        );
      case 'daterange':
        return (
          <CDateRangeField
            value={field.value}
            onChange={field.onChange}
            {...commonProps}
          />
        );
      case 'boolean':
        return (
          <CBooleanField
            value={field.value}
            onChange={field.onChange}
            {...commonProps}
          />
        );
      case 'custom':
        return field.customField || null;
      default:
        return (
          <CTextInput
            value={field.value || ''}
            onChange={field.onChange}
            {...commonProps}
          />
        );
    }
  };

  // Render the state indicator based on field state
  const renderStateIndicator = (state?: FieldState, message?: string) => {
    if (!state || state === 'default') {
      return null;
    }

    const stateClasses = {
      error: 'text-red-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      loading: 'text-blue-500',
    };

    const stateIcons = {
      error: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      success: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      warning: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      loading: (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ),
    };

    return (
      <div className={`flex items-center ${stateClasses[state] || ''}`}>
        <span className="mr-1">{stateIcons[state]}</span>
        {message && <span className="text-xs">{message}</span>}
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !loading) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded shadow-md ${className}`}>
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left py-2 px-3 w-1/5 text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
            <th className="text-left py-2 px-3 w-2/5 text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="text-left py-2 px-3 w-1/5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-left py-2 px-3 w-1/5 text-xs font-medium text-gray-500 uppercase tracking-wider">Help</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id} className="border-b border-gray-200">
              <td className="py-2 px-3 align-top">
                <label className="block text-xs font-medium text-gray-700">
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </td>
              <td className="py-2 px-3 align-top">
                {renderField(field)}
              </td>
              <td className="py-2 px-3 align-top">
                {renderStateIndicator(field.state, field.stateMessage)}
              </td>
              <td className="py-2 px-3 align-top">
                {field.help && (
                  <p className="text-gray-500 text-xs">{field.help}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {(onSubmit || onCancel) && (
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 text-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
          )}
          {onSubmit && (
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 border border-transparent rounded shadow-sm text-white text-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {submitLabel}
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default CForm;
