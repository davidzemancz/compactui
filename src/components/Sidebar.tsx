import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold">CompactUI</h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <NavLink
              to="/filter-demo"
              className={({ isActive }) =>
                `block p-2 mx-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Filter Demo
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;