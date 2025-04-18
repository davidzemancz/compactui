import React, { useState } from 'react';
import CFilter from '../components/CFilter/CFilter';
import { FilterValues, FilterField } from '../components/CFilter/types';

const CFilterDemo: React.FC = () => {
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  
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

  const handleFilterChange = (values: FilterValues) => {
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

      {/* Component Demo */}
      <div className="p-4 bg-white rounded-lg shadow-md mb-6">
        <CFilter 
          fields={filterFields} 
          onFilterChange={handleFilterChange} 
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
          <li>Real-time filter updates</li>
          <li>Integrates easily with table components</li>
          <li>Responsive design for all screen sizes</li>
        </ul>
      </div>
      
      {/* Current Filter Values Display */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold mb-3">Current Filter Values</h2>
        <div className="bg-white rounded-lg shadow-md p-4 text-xs">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {Object.entries(filterValues).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-4 py-2 whitespace-nowrap text-xs font-medium">{key}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    {formatFilterValue(key, value)}
                  </td>
                </tr>
              ))}
              {Object.keys(filterValues).length === 0 && (
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
  const [filterValues, setFilterValues] = useState({});
  
  const filterFields = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'age', label: 'Age', type: 'number' },
    { id: 'active', label: 'Status', type: 'boolean' }
  ];

  return (
    <CFilter 
      fields={filterFields} 
      onFilterChange={setFilterValues} 
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
  return Object.entries(filterValues).every(([key, value]) => {
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
      </div>
    </div>
  );
};

export default CFilterDemo;
