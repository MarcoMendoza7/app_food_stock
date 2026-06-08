import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Movimientos from './pages/Movimientos';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = localStorage.getItem('user');
  const role = localStorage.getItem('role');

  if (!user) return <Navigate noble to="/" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/inventario" element={<ProtectedRoute allowedRoles={['Administrador']}><Inventario /></ProtectedRoute>} />
        <Route path="/movimientos" element={<ProtectedRoute><Movimientos /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;