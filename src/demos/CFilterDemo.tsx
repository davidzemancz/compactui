import React, { useState } from 'react';
import CFilter from '../components/CFilter/CFilter';
import { FilterValues, FilterField } from '../components/CFilter/types';

const CFilterDemo: React.FC = () => {
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});
  const [isRequired, setIsRequired] = useState<boolean>(true);
  
  // Filter field definitions
  const filterFields: FilterField[] = [
    { 
      id: 'name', 
      label: 'Name', 
      type: 'text',
      placeholder: 'Search by name'
    },
    { 
      id: 'age', 
      label: 'Age', 
      type: 'number',
      placeholder: 'Filter by age'
    },
    { 
      id: 'active', 
      label: 'Status', 
      type: 'boolean'
    },
    { 
      id: 'joined', 
      label: 'Join Date', 
      type: 'daterange'
    },
    { 
      id: 'role', 
      label: 'Role', 
      type: 'select',
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'editor', label: 'Editor' },
        { value: 'user', label: 'User' }
      ]
    }
  ];

  const handleFilterApply = (values: FilterValues) => {
    setAppliedFilters(values);
    setFilterValues(values);
  };

  // Format the filter value for display
  const formatFilterValue = (key: string, value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'none';
    }
    
    if (key === 'joined' && Array.isArray(value)) {
      return `${value[0] || 'any'} to ${value[1] || 'any'}`;
    }
    
    if (key === 'active') {
      return value ? 'Yes' : 'No';
    }
    
    return String(value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xs font-bold mb-4">CFilter Component</h1>

      {/* Demo Options - Moved to the top */}
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-xs font-medium">Demo Options:</h3>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={isRequired}
              onChange={() => setIsRequired(!isRequired)}
            />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
            <span className="ml-2 text-xs font-medium text-gray-700">
              {isRequired ? 'Required Filter Mode' : 'Optional Filter Mode'}
            </span>
          </label>
        </div>
      </div>

      {/* Component Demo */}
      <div className="p-4 bg-white rounded-lg shadow-md mb-6">
        <CFilter 
          fields={filterFields} 
          onFilterApply={handleFilterApply}
          required={isRequired}
        />
      </div>
      
      {/* Description and Features */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Overview</h2>
        <p className="text-xs text-gray-700 mb-4">
          A flexible filter component that supports multiple field types and can be used to filter data in tables and lists.
        </p>
        
        <h3 className="text-xs font-semibold mb-2">Features</h3>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700 mb-4">
          <li>Supports multiple input types: text, number, boolean, select, date ranges</li>
          <li>Customizable field definitions</li>
          <li>Manual filter application with "Zobrazit" button</li>
          <li>Reset to default values with "Výchozí" button</li>
          <li>Optional automatic filter updates</li>
          <li>Required filter indication</li>
          <li>Integrates easily with table components</li>
          <li>Responsive design for all screen sizes</li>
        </ul>
      </div>
      
      {/* Current Filter Values Display */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Applied Filter Values</h2>
        <div className="bg-white rounded-lg shadow-md p-4 text-xs">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {Object.entries(appliedFilters).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-4 py-2 whitespace-nowrap text-xs font-medium">{key}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    {formatFilterValue(key, value)}
                  </td>
                </tr>
              ))}
              {Object.keys(appliedFilters).length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-center text-xs text-gray-500 italic">
                    No filters applied
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Code Examples */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Usage Examples</h2>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Basic Usage</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`import { CFilter } from 'compactui';
import { useState } from 'react';

function MyFilterComponent() {
  const [appliedFilters, setAppliedFilters] = useState({});
  
  const filterFields = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'age', label: 'Age', type: 'number' },
    { id: 'active', label: 'Status', type: 'boolean' }
  ];

  return (
    <CFilter 
      fields={filterFields} 
      onFilterApply={setAppliedFilters} 
    />
  );
}`}
            </pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Integration with Tables</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`// Filter your data based on filter values
const filteredData = data.filter(item => {
  return Object.entries(appliedFilters).every(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return true; // Skip empty filters
    }
    
    switch(key) {
      case 'name':
        return item.name.toLowerCase().includes(String(value).toLowerCase());
      case 'age':
        return item.age === Number(value);
      case 'active':
        return item.active === Boolean(value);
      case 'joined':
        // Handle date range filtering
        const [startDate, endDate] = value;
        const itemDate = new Date(item.joined);
        return (!startDate || itemDate >= new Date(startDate)) && 
               (!endDate || itemDate <= new Date(endDate));
      default:
        return true;
    }
  });
});

// Then pass the filtered data to CTable
<CTable 
  columns={columns}
  data={filteredData}
/>`}
            </pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2">Auto-Apply Changes</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-xs overflow-x-auto">
{`<CFilter 
  fields={filterFields} 
  onFilterApply={setAppliedFilters}
  applyOnChange={true} // This will apply filters automatically as values change
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CFilterDemo;
