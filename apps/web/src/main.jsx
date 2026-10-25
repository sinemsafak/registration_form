
import React from 'react';
import { createRoot } from 'react-dom/client';
import RegisterForm from './RegisterForm.jsx';
import './style.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RegisterForm />
  </React.StrictMode>
);
