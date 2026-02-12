import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import PaginaLogin from '../pages/Login';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<PaginaLogin />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
