import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Administrador');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Cambia dinámicamente la URL dependiendo de lo que el usuario esté haciendo
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await response.json();

      if (response.ok || data.success) {
        if (isRegister) {
          setSuccessMessage('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
          setIsRegister(false); // Regresa automáticamente a la vista de Login
          setPassword('');
        } else {
          localStorage.setItem('user', data.user);
          localStorage.setItem('role', data.role);
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Error en la operación');
      }
    } catch (err) {
      setError('Error al conectar con el cluster balanceado');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#2c3e50' }}>FOOD - STOCK</h2>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#7f8c8d', fontSize: '1.1rem' }}>
          {isRegister ? 'Crear Nueva Cuenta' : 'Iniciar Sesión'}
        </h3>

        {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{successMessage}</p>}
        
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            {isRegister ? 'Registrar Cuenta Nuevo' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button 
            type="button" 
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccessMessage(''); }}
            style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;