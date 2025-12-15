// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa el CSS de react-toastify

import { AuthProvider } from './context/AuthContext.jsx';

import PaginaLogin from './pages/Login';
import PaginaDashboard from './pages/Dashboard';
import SizesList from './pages/sizes/SizesList';
import MaterialesList from './pages/materials/MaterialsList';
import ColorsList from './pages/colors/ColorsList';
import LayoutPrincipal from './components/comun/LayoutPrincipal';
import UnidadesList from './pages/unidades/UnidadesList';
import ProductosList from './pages/productos/ProductosList';
import AlmacenesList from './pages/almacenes/AlmacenesList';
import EmpleadosList from './pages/empleados/EmpleadosList';
import RecetasList from './pages/recetas/RecetasList';
import RecetaDetail from './pages/recetas/RecetaDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          <Routes>
            {/* Ruta pública para el login */}
            <Route path="/login" element={<PaginaLogin />} />

            {/* Rutas protegidas - anidadas dentro de LayoutPrincipal */}
            <Route element={<LayoutPrincipal />}>
              <Route path="/" element={<PaginaDashboard />} />
              <Route path="/dashboard" element={<PaginaDashboard />} />
              <Route path="sizes" element={<SizesList />} />
              <Route path="materiales" element={<MaterialesList />} />
              <Route path="colores" element={<ColorsList />} />
              <Route path="unidades" element={<UnidadesList />} />
              <Route path="productos" element={<ProductosList />} />
              <Route path="almacenes" element={<AlmacenesList />} />
              <Route path="empleados" element={<EmpleadosList />} />
              <Route path="recetas" element={<RecetasList />} />
              <Route path="/recetas/:id_producto" element={<RecetaDetail />} />
            
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;