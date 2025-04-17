import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import CTableDemo from './demos/CTableDemo';

// Home page component
const Home: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <h1 className="text-xl font-bold mb-2">Welcome to CompactUI</h1>
    <p className="text-sm text-gray-600">
      A lightweight UI component library for React applications.
    </p>
  </div>
);

// Compact navigation link component
const NavLink: React.FC<{to: string, children: React.ReactNode, icon?: React.ReactNode, isCollapsed?: boolean}> = 
  ({ to, children, icon, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-2 py-2 rounded text-xs font-medium flex ${isCollapsed ? 'justify-center' : 'items-center'} ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      title={isCollapsed ? String(children) : ''}
    >
      {icon && (
        <span className={isCollapsed ? '' : 'mr-2'}>
          {icon}
        </span>
      )}
      {!isCollapsed && children}
    </Link>
  );
};

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-sm flex">
        {/* Left Menu Bar */}
        <aside className={`${isCollapsed ? 'w-12' : 'w-48'} bg-white shadow-md h-screen sticky top-0 transition-all duration-300`}>
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            {!isCollapsed && <span className="text-blue-600 font-medium text-sm">CompactUI</span>}
            <button 
              onClick={toggleSidebar} 
              className={`text-gray-500 hover:text-gray-700 focus:outline-none ${isCollapsed ? 'mx-auto' : ''}`}
            >
              {isCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
          <div className="py-2">
            <nav className={`flex flex-col gap-1 ${isCollapsed ? 'px-1' : 'px-2'}`}>
              <NavLink 
                to="/" 
                isCollapsed={isCollapsed}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/components/table" 
                isCollapsed={isCollapsed}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
              >
                Table
              </NavLink>
            </nav>
          </div>
          <div className="absolute bottom-0 w-full p-2 border-t border-gray-200 flex justify-center">
            <a 
              href="https://github.com/davidzemancz/compactui" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-2"
              title="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              {!isCollapsed && "GitHub"}
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/components/table" element={<CTableDemo />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
