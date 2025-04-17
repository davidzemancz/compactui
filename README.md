# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# CompactUI

A lightweight, responsive UI component library for React applications.

## Features

- Modern, clean UI components built with React and Tailwind CSS
- Focused on performance and usability
- Fully typed with TypeScript
- Responsive design works across devices
- Accessible components

## Components

### CTable

A versatile data table component with the following features:
- Sorting
- Filtering/search
- Resizable columns
- Reorderable columns
- Single or multi-selection
- CSV export
- Persistent state (via localStorage)

### CSideBar

A collapsible sidebar navigation component:
- Collapsible/expandable
- Support for nested menu items
- Active route highlighting
- Icons support
- Mobile-friendly

## Installation

```bash
# If you're using npm
npm install compactui

# If you're using yarn
yarn add compactui
```

## Usage Example

```tsx
import React from 'react';
import { CTable } from 'compactui';

const MyComponent = () => {
  const columns = [
    { key: 'id', header: 'ID', dataType: 'int' },
    { key: 'name', header: 'Name', dataType: 'string' },
    { key: 'email', header: 'Email', dataType: 'link' },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <CTable 
      columns={columns} 
      data={data}
      selectionMode="single"
      onSelectionChange={(ids) => console.log('Selected:', ids)}
      storageKey="my-table"
    />
  );
};
```

## License

MIT
