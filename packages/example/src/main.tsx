import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const app = createRoot(document.getElementById('root')!);

app.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
