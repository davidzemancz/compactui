import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CTableDemo from './demos/CTableDemo';
import CSideBar, { SidebarItem } from './components/CSideBar/CSideBar';
import CFilterDemo from './demos/CFilterDemo';
import CFilteredTableDemo from './demos/CFilteredTableDemo';
import CFormDemo from './demos/CFormDemo';
import CCrudDemo from './demos/CCrudDemo';
import { HomeIcon, ComponentsIcon, TableIcon, FilterIcon, FilteredTableIcon, 
         GitHubIcon } from './components/CIcons';

// Home page component
const Home: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <h1 className="text-xl font-bold mb-2 text-xs">Welcome to CompactUI</h1>
    <p className="text-xs text-gray-600">
      A lightweight UI component library for React applications.
    </p>
  </div>
);

const App: React.FC = () => {
  // Define sidebar items with nested structure
  const sidebarItems: SidebarItem[] = [
    {
      id: 'home',
      label: 'Home',
      to: '/',
      icon: <HomeIcon />
    },
    {
      id: 'components',
      label: 'Components',
      icon: <ComponentsIcon />,
      children: [
        {
          id: 'table',
          label: 'Table',
          to: '/components/table',
          icon: <TableIcon />
        },
        {
          id: 'filter',
          label: 'Filter',
          to: '/components/filter',
          icon: <FilterIcon />
        },
        {
          id: 'filtered-table',
          label: 'Filtered Table',
          to: '/components/filtered-table',
          icon: <FilteredTableIcon />
        },
        {
          id: 'form',
          label: 'Form',
          to: '/components/form',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        },
        {
          id: 'crud',
          label: 'CRUD Demo',
          to: '/components/crud',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          )
        }
      ]
    }
  ];

  const githubFooter = {
    label: "GitHub",
    href: "https://github.com/davidzemancz/compactui",
    icon: <GitHubIcon />
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen h-screen bg-gray-50 font-sans text-xs flex">
        <CSideBar 
          items={sidebarItems} 
          title="CompactUI" 
          footerItem={githubFooter}
        />

        {/* Main Content - Updated overflow handling */}
        <main className="flex-1 p-6 overflow-x-auto overflow-y-auto">
          <div className="h-full mx-auto max-w-6xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/components/table" element={<CTableDemo />} />
              <Route path="/components/filter" element={<CFilterDemo />} />
              <Route path="/components/filtered-table" element={<CFilteredTableDemo />} />
              <Route path="/components/form" element={<CFormDemo />} />
              <Route path="/components/crud" element={<CCrudDemo />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
