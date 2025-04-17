import React from 'react';
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
const NavLink: React.FC<{to: string, children: React.ReactNode}> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-2 py-1 rounded text-xs font-medium ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-sm">
        <header className="bg-white shadow-sm py-1">
          <div className="mx-auto px-3 max-w-6xl">
            <div className="flex justify-between h-8 items-center">
              <div className="flex items-center">
                <span className="text-blue-600 font-medium text-sm">CompactUI</span>
              </div>
              <div className="flex items-center">
                <a 
                  href="https://github.com/davidzemancz/compactui" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 text-xs"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-3 py-3">
          <div className="flex gap-3">
            {/* Compact Navigation Sidebar */}
            <aside className="w-48 bg-white shadow rounded p-2 h-fit">
              <h2 className="font-medium text-gray-700 mb-2 text-xs">Components</h2>
              <nav className="flex flex-col gap-1">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/components/table">CTable</NavLink>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/components/table" element={<CTableDemo />} />
              </Routes>
            </main>
          </div>
        </div>

        <footer className="bg-white shadow-inner mt-3 py-2">
          <div className="mx-auto max-w-6xl px-3">
            <p className="text-center text-gray-500 text-xs">
              CompactUI &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
