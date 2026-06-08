import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  const role = localStorage.getItem('role');

  return (
    <nav className="sidebar">
      <h2 style={{ marginBottom: '2rem', color: '#18bc9c' }}>FOOD - STOCK</h2>
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Panel Principal</NavLink>
      {role === 'Administrador' && (
        <NavLink to="/inventario" className={({ isActive }) => isActive ? 'active' : ''}>Inventario (CRUD)</NavLink>
      )}
      <NavLink to="/movimientos" className={({ isActive }) => isActive ? 'active' : ''}>Entradas / Salidas</NavLink>
    </nav>
  );
}

export default Sidebar;