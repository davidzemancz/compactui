import React, { useState, useEffect } from 'react';
import { CFilterProps, FilterField, FilterValues, FilterFieldType } from './types';
import { TextField, NumberField, DateField, DateRangeField, SelectField, BooleanField } from './FilterFields';

const CFilter: React.FC<CFilterProps> = ({ 
  fields, 
  onFilterApply, 
  className = '',
  applyOnChange = false,
  required = false
}) => {
  // Initialize filter values with defaults
  const [filterValues, setFilterValues] = useState<FilterValues>(() => {
    const initialValues: FilterValues = {};
    fields.forEach(field => {
      initialValues[field.id] = field.defaultValue !== undefined ? field.defaultValue : null;
    });
    return initialValues;
  });

  // Update filter values when fields change
  useEffect(() => {
    const updatedValues = { ...filterValues };
    let changed = false;
    
    fields.forEach(field => {
      // Add new fields if they don't exist
      if (!(field.id in updatedValues)) {
        updatedValues[field.id] = field.defaultValue !== undefined ? field.defaultValue : null;
        changed = true;
      }
    });
    
    // Remove fields that no longer exist
    Object.keys(updatedValues).forEach(key => {
      if (!fields.some(field => field.id === key)) {
        delete updatedValues[key];
        changed = true;
      }
    });
    
    if (changed) {
      setFilterValues(updatedValues);
    }
  }, [fields]);

  // Notify parent component when filter values change (if applyOnChange is true)
  useEffect(() => {
    if (applyOnChange) {
      onFilterApply(filterValues);
    }
  }, [filterValues, onFilterApply, applyOnChange]);

  // Handle filter field value changes
  const handleFilterChange = (id: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Reset all filters to null or default values
  const handleResetFilters = () => {
    const resetValues: FilterValues = {};
    fields.forEach(field => {
      resetValues[field.id] = field.defaultValue !== undefined ? field.defaultValue : null;
    });
    setFilterValues(resetValues);
    
    // Trigger onFilterApply with reset values
    onFilterApply(resetValues);
  };
  
  // Apply current filter values
  const handleApplyFilters = () => {
    onFilterApply(filterValues);
  };

  // Render the appropriate field component based on type
  const renderField = (field: FilterField) => {
    const fieldProps = {
      field,
      value: filterValues[field.id],
      onChange: handleFilterChange
    };

    switch (field.type) {
      case 'text':
        return <TextField {...fieldProps} />;
      case 'number':
        return <NumberField {...fieldProps} />;
      case 'date':
        return <DateField {...fieldProps} />;
      case 'daterange':
        return <DateRangeField {...fieldProps} />;
      case 'select':
        return <SelectField {...fieldProps} />;
      case 'boolean':
        return <BooleanField {...fieldProps} />;
      default:
        return <TextField {...fieldProps} />;
    }
  };

  return (
    <div className={`bg-white rounded shadow-md p-4 ${className}`}>
      {/* Required message moved to the top */}
      {required && (
        <div className="mb-3 text-xs text-amber-600 font-medium">
          Pro zobrazení dat zadejte filtr
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {fields.map(field => (
          <div key={field.id} className="flex flex-col min-w-[200px]">
            <label className="mb-1 text-xs text-gray-700 font-medium">{field.label}</label>
            {renderField(field)}
          </div>
        ))}
        
        <div className="flex flex-col min-w-[200px] justify-end">
          <div className="flex gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3 h-[26px] bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 text-xs flex items-center justify-center"
            >
              Výchozí
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-3 h-[26px] bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center justify-center"
            >
              Zobrazit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CFilter;
