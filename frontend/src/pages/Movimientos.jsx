import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [tipo, setTipo] = useState('entrada');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');

  const cargarMovimientos = () => {
    fetch('/api/movimientos')
      .then(res => res.json())
      .then(data => setMovimientos(data));
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, producto, cantidad: parseInt(cantidad) })
    }).then(() => {
      setProducto('');
      setCantidad('');
      cargarMovimientos();
    });
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Registro de Entradas y Salidas" />
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', maxWidth: '500px', marginBottom: '2rem' }}>
          <h3>Operación Diaria</h3>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Tipo de Operación</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="entrada">Entrada (Donación)</option>
              <option value="salida">Salida (Consumo)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nombre Exacto del Producto</label>
            <input type="text" value={producto} onChange={e => setProducto(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Cantidad</label>
            <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Registrar Flujo</button>
        </form>

        <h3>Historial de Operaciones</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(m => {
              // 🛡️ Normalizamos el texto para evitar que las mayúsculas/minúsculas rompan el color
              const esEntrada = m.tipo && m.tipo.trim().toLowerCase() === 'entrada';
              
              return (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>
                    <span style={{ 
                      color: esEntrada ? '#2ecc71' : '#e74c3c', 
                      fontWeight: 'bold' 
                    }}>
                      {m.tipo ? m.tipo.toUpperCase() : ''}
                    </span>
                  </td>
                  <td>{m.producto}</td>
                  <td>{m.cantidad}</td>
                  <td>{new Date(m.fecha).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Movimientos;