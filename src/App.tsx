import React from 'react';
import CTableDemo from './demos/CTableDemo';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12 items-center">
            <div className="flex items-center">
              <span className="text-blue-600 font-medium text-sm">CompactUI</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/your-repo/compactui" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 text-xs"
              >
                GitHub
              </a>
              <a 
                href="/docs" 
                className="text-gray-500 hover:text-gray-700 text-xs"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <CTableDemo />
      </main>

      <footer className="bg-white shadow-inner mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-xs">
            CompactUI Library &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
