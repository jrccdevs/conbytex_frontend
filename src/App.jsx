import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LayoutPrincipal from './components/comun/LayoutPrincipal'; // Tu componente con Sidebar
import ProductosList from './pages/productos/ProductosList';
import ProductoForm from './components/productos/ProductoModal';

import EmpleadosList from './pages/empleados/EmpleadosList';
import ClientesList from './pages/clientes/ClientesList';
import OrdenList from './pages/ordenes/OrdenList';
import OrdenForm from './components/ordenes/OrdenForm';
import OrdenDetail from './pages/ordenes/OrdenDetail';

import RecetaList from './pages/recetas/RecetasList';
import RecetaCreateForm from './components/recetas/RecetaCreateForm';
import RecetaDetail from './pages/recetas/RecetaDetail';

import MovimientosList from './pages/movimientos/MovimientosList';
import MovimientoDetail from './pages/movimientos/MovimientoDetalle';
import MovimientoForm from './components/movimientos/MovimientoForm';

import MateriaPrimaPage from './pages/inventario/MateriaPrimaPage';
import ProductoTerminadoPage from './pages/inventario/ProductoTerminadoPage';

import ColorList from './pages/colors/ColorsList';
import ColorForm from './components/colors/ColorModal';

import AlmacenList from './pages/almacenes/AlmacenesList';
import AlmacenForm from './components/almacenes/AlmacenModal';

import MaterialList from './pages/materials/MaterialsList';
import MaterialForm from './components/materials/MaterialModal';

import SizeList from './pages/sizes/SizesList';
import SizeForm from './components/sizes/SizeModal';

import UnidadList from './pages/unidades/UnidadesList';
import UnidadForm from './components/unidades/UnidadModal';
// Páginas
import UsuariosList from './pages/admin/UsuariosList';
import UsuarioForm from './pages/admin/UsuarioForm';
import AsignacionSeguridad from './pages/admin/AsignacionSeguridad';

import RolesList from './pages/admin/RolesList';
import RolForm from './pages/admin/RolForm';

import PaginaLogin from './pages/Login';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Routes>
      {/* 🔓 RUTA PÚBLICA: No lleva Layout */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* 🔐 RUTAS PROTEGIDAS: Todas envueltas en el Layout con Sidebar */}
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutPrincipal />}>
          {/* Todas las rutas aquí dentro mostrarán el Sidebar automáticamente */}

          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<ProtectedRoute permisoRequerido="users.view" />}>
            <Route path="/usuarios" element={<UsuariosList />} />
          </Route>

          {/* Crear: Requiere users.create */}
          <Route element={<ProtectedRoute permisoRequerido="users.create" />}>
            <Route path="/usuarios/nuevo" element={<UsuarioForm />} />
          </Route>

          {/* Editar: Requiere users.edit */}
          <Route element={<ProtectedRoute permisoRequerido="users.edit" />}>
            <Route path="/usuarios/editar/:id" element={<UsuarioForm />} />
          </Route>

          {/* Asignar Seguridad: Requiere roles.assign_permissions */}
          <Route element={<ProtectedRoute permisoRequerido="roles.assign_permissions" />}>
            <Route path="/usuarios/seguridad/:id" element={<AsignacionSeguridad />} />
          </Route>
          {/* --- MÓDULO DE ROLES Y SEGURIDAD --- */}
          {/* Listar Roles */}
          <Route element={<ProtectedRoute permisoRequerido="roles.view" />}>
            <Route path="/roles" element={<RolesList />} />
          </Route>

          {/* Crear Rol */}
          <Route element={<ProtectedRoute permisoRequerido="roles.create" />}>
            <Route path="/roles/nuevo" element={<RolForm />} />
          </Route>

          {/* Editar Rol */}
          <Route element={<ProtectedRoute permisoRequerido="roles.edit" />}>
            <Route path="/roles/editar/:id" element={<RolForm />} />
          </Route>

          {/* Asignación Directa (Seguridad) */}
          <Route element={<ProtectedRoute permisoRequerido="roles.assign_permissions" />}>
            <Route path="/usuarios/seguridad/:id" element={<AsignacionSeguridad />} />
          </Route>
          {/* Agrega aquí más rutas que necesiten Sidebar (ej: Materiales, Inventario) */}
          {/* --- MÓDULO PRODUCTOS --- */}

{/* Listar productos */}
<Route element={<ProtectedRoute permisoRequerido="productos.view" />}>
  <Route path="/productos" element={<ProductosList />} />
</Route>
{/* Crear producto */}
<Route element={<ProtectedRoute permisoRequerido="productos.create" />}>
  <Route path="/productos/nuevo" element={<ProductosList />} />
</Route>
{/* Editar producto */}
<Route element={<ProtectedRoute permisoRequerido="productos.edit" />}>
  <Route path="/productos/editar/:id" element={<ProductosList />} />
</Route>

{/* Listar Empleados */}
<Route element={<ProtectedRoute permisoRequerido="empleados.view" />}>
  <Route path="/empleados" element={<EmpleadosList />} />
</Route>
{/* Crear empleado */}
<Route element={<ProtectedRoute permisoRequerido="empleados.create" />}>
  <Route path="/empleados/nuevo" element={<EmpleadosList />} />
</Route>
{/* Editar empleado */}
<Route element={<ProtectedRoute permisoRequerido="empleados.edit" />}>
  <Route path="/empleados/editar/:id" element={<EmpleadosList />} />
</Route>

/***************************************************************/
{/* ✅ Listar - Carga la tabla */}
<Route element={<ProtectedRoute permisoRequerido="orden.view" />}>
  <Route path="/orden" element={<OrdenList />} />
</Route>

{/* ✅ Crear - DEBE cargar el Formulario (OrdenForm), no la lista */}
<Route element={<ProtectedRoute permisoRequerido="orden.create" />}>
  <Route path="/orden/nuevo" element={<OrdenForm />} /> 
</Route>

{/* ✅ Editar - Carga el Formulario */}
<Route element={<ProtectedRoute permisoRequerido="orden.edit" />}>
  <Route path="/orden/editar/:id" element={<OrdenForm />} />
</Route>

{/* ✅ Detalle - Carga el componente de solo lectura */}
<Route element={<ProtectedRoute permisoRequerido="orden.view" />}>
  <Route path="/orden/detalle/:id" element={<OrdenDetail />} />
</Route>

/*******************************************************************/
/***************************************************************/
{/* ✅ Listar Recetas - Carga la tabla */}
<Route element={<ProtectedRoute permisoRequerido="recetas.view" />}>
  <Route path="/recetas" element={<RecetaList />} />
</Route>

{/* ✅ Crear - DEBE cargar el Formulario (OrdenForm), no la lista */}
<Route element={<ProtectedRoute permisoRequerido="recetas.create" />}>
  <Route path="/recetas/nuevo" element={<RecetaCreateForm />} /> 
</Route>



{/* ✅ Detalle - Carga el componente de solo lectura */}
<Route element={<ProtectedRoute permisoRequerido="recetas.view" />}>
  <Route path="/recetas/:id_producto" element={<RecetaDetail />} />
</Route>

/*******************************************************************/
/*******************************************************************/
{/* 1. Lista de Movimientos - Permiso: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="movimientos.view" />}>
  <Route path="/movimientos" element={<MovimientosList />} />
</Route>

{/* 2. Formulario para nuevo movimiento - Permiso: movimientos.create */}
<Route element={<ProtectedRoute permisoRequerido="movimientos.create" />}>
  <Route path="/movimientos/nuevo" element={<MovimientoForm />} />
</Route>

{/* 3. Ver detalle de un movimiento específico - Permiso: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="movimientos.view" />}>
  <Route path="/movimientos/:id" element={<MovimientoDetail />} />
</Route>
//**********************************************************************/
<Route element={<ProtectedRoute permisoRequerido="inventario.view" />}>
  <Route path="/inventario/materia-prima" element={<MateriaPrimaPage />} />
</Route>
<Route element={<ProtectedRoute permisoRequerido="inventario.view" />}>
  <Route path="/inventario/producto-terminado" element={<ProductoTerminadoPage />} />
</Route>
/************************************************************************/
{/* 1. Lista de clor - Permiso: clor.view */}
<Route element={<ProtectedRoute permisoRequerido="color.view" />}>
  <Route path="/color" element={<ColorList />} />
</Route>

{/* 2. Formulario para nuevo color - Permiso: movimientos.create */}
<Route element={<ProtectedRoute permisoRequerido="color.create" />}>
  <Route path="/color/nuevo" element={<ColorForm />} />
</Route>

{/* 3. Ver detalle de un movimiento específico - color: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="color.view" />}>
  <Route path="/color/:id" element={<ColorForm />} />
</Route>
/***************************************************************************/
{/* 1. Lista de almacen - Permiso: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="almacen.view" />}>
  <Route path="/almacen" element={<AlmacenList />} />
</Route>

{/* 2. Formulario para nuevo movimiento - Permiso: movimientos.create */}
<Route element={<ProtectedRoute permisoRequerido="almacen.create" />}>
  <Route path="/almacen/nuevo" element={<AlmacenForm />} />
</Route>

{/* 3. Ver detalle de un movimiento específico - color: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="almacen.view" />}>
  <Route path="/almacen/:id" element={<AlmacenForm />} />
</Route>
/******************************************************************************/
{/* 1. Lista de Material - Permiso: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="material.view" />}>
  <Route path="/material" element={<MaterialList />} />
</Route>

{/* 2. Formulario para nuevo movimiento - Permiso: movimientos.create */}
<Route element={<ProtectedRoute permisoRequerido="material.create" />}>
  <Route path="/material/nuevo" element={<MaterialForm />} />
</Route>

{/* 3. Ver detalle de un movimiento específico - color: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="material.view" />}>
  <Route path="/material/:id" element={<MaterialForm />} />
</Route>
/*******************************************************************************/
{/* 1. Lista de Tallas - Permiso: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="size.view" />}>
  <Route path="/size" element={<SizeList />} />
</Route>

{/* 2. Formulario para nuevo movimiento - Permiso: movimientos.create */}
<Route element={<ProtectedRoute permisoRequerido="size.create" />}>
  <Route path="/size/nuevo" element={<SizeForm />} />
</Route>

{/* 3. Ver detalle de un movimiento específico - color: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="size.view" />}>
  <Route path="/size/:id" element={<SizeForm />} />
</Route>
/*********************************************************************************/
{/* 1. Lista de Unidad de medida - Permiso: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="unidad.view" />}>
  <Route path="/unidad" element={<UnidadList />} />
</Route>

{/* 2. Formulario para nuevo movimiento - Permiso: movimientos.create */}
<Route element={<ProtectedRoute permisoRequerido="unidad.create" />}>
  <Route path="/unidad/nuevo" element={<UnidadForm />} />
</Route>

{/* 3. Ver detalle de un movimiento específico - color: movimientos.view */}
<Route element={<ProtectedRoute permisoRequerido="unidad.view" />}>
  <Route path="/unidad/:id" element={<UnidadForm />} />
</Route>
/**********************************************************************************/
{/* Listar clientes */}
<Route element={<ProtectedRoute permisoRequerido="clientes.view" />}>
  <Route path="/clientes" element={<ClientesList />} />
</Route>
{/* Crear clientes */}
<Route element={<ProtectedRoute permisoRequerido="clientes.create" />}>
  <Route path="/clientes/nuevo" element={<ClientesList />} />
</Route>
{/* Editar clientes */}
<Route element={<ProtectedRoute permisoRequerido="clientes.edit" />}>
  <Route path="/clientes/editar/:id" element={<ClientesList />} />
</Route>
        </Route>
      </Route>

      {/* 🚫 ACCESO DENEGADO (Fuera del layout para que se vea limpio o dentro si quieres sidebar) */}
      <Route path="/unauthorized" element={
        <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>
          <h1>403 - ACCESO NO AUTORIZADO</h1>
          <p>No tienes los privilegios de seguridad necesarios.</p>
        </div>
      } />

      {/* 🔄 REDIRECCIÓN POR DEFECTO */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;