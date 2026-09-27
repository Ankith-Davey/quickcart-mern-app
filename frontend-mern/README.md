# QuickCart Catalog

## Setup

```
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## File structure

```
quickcart-catalog/
├── index.html          Vite's HTML entry point — loads src/main.jsx
├── package.json         scripts + dependencies
├── vite.config.js        enables the React plugin
└── src/
    ├── main.jsx          mounts <App /> into #root, imports index.css
    ├── App.jsx            all components (Sidebar, ProductGrid, ProductModal, CartDrawer, App)
    ├── index.css          all styles — global reset + every component class
    └── products.js        product data, categories, brands, sort/rating options
```
