// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

// 🆕 IMPORTACIONES DE ÓRDENES DE PRODUCCIÓN
import OrdenList from './pages/ordenes/OrdenList';
import OrdenDetail from './pages/ordenes/OrdenDetail';
import OrdenForm from './components/ordenes/OrdenForm'; // O la ruta donde lo guardaste
import MovimientoForm from './components/movimientos/MovimientoForm';
import MovimientosList from './pages/movimientos/MovimientosList';
import MovimientoDetalle from './pages/movimientos/MovimientoDetalle';
import MateriaPrimaPage from './pages/inventario/MateriaPrimaPage';
import ProductoTerminadoPage from './pages/inventario/ProductoTerminadoPage';

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

              {/* 🆕 RUTAS DE ÓRDENES DE PRODUCCIÓN */}
              <Route path="ordenes" element={<OrdenList />} />
              <Route path="ordenes/:id" element={<OrdenDetail />} />
              <Route path="ordenes/nueva" element={<OrdenForm />} />
              <Route path="ordenes/editar/:id" element={<OrdenForm />} />

              <Route path="movimientos" element={<MovimientosList />} />
              <Route path="movimientos/nuevo" element={<MovimientoForm />} />
              <Route path="movimientos/:id" element={<MovimientoDetalle />} />

              <Route path="/inventario/materia-prima" element={<MateriaPrimaPage />} />
              <Route path="/inventario/producto-terminado" element={<ProductoTerminadoPage />} />
          </Route>
        </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;