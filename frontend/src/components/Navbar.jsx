import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ title }) {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div>
        <h2>{title}</h2>
        <p style={{ color: '#7f8c8d' }}>Usuario: <strong>{user}</strong> ({role})</p>
      </div>
      <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
    </header>
  );
}

export default Navbar;