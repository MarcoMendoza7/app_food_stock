import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Administrador');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', data.user);
        localStorage.setItem('role', data.role);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al conectar con el cluster balanceado');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#2c3e50' }}>FOOD - STOCK</h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Rol de Acceso</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Administrador">Administrador</option>
              <option value="Voluntario">Voluntario</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;