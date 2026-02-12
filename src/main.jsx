import React from 'react';
import ReactDOM from 'react-dom/client'; // Importación necesaria para React 18+
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css'; // O tus estilos globales
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Seleccionamos el elemento raíz del HTML
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);