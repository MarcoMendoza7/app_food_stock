import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [alimentos, setAlimentos] = useState([]);
  const [nodeName, setNodeName] = useState('Detectando...');

  useEffect(() => {
    fetch('/api/alimentos')
      .then(res => res.json())
      .then(data => setAlimentos(data))
      .catch(() => {});

    fetch('/api/health')
      .then(res => res.json())
      .then(data => setNodeName(data.node))
      .catch(() => setNodeName('Error NGINX'));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Panel Principal Estratégico" />
        <div style={{ background: '#e8f8f5', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem' }}>
          <p>📡 Petición procesada por el nodo distribuidor: <strong>{nodeName}</strong></p>
        </div>
        <div className="metrics-grid">
          <div className="card">
            <h3>Total Productos</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{alimentos.length} Insumos</div>
          </div>
          <div className="card danger">
            <h3>Alertas de Caducidad</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Crítico</div>
          </div>
        </div>
        <h3>⚠️ Alertas Críticas de Inventario</h3>
        <table>
          <thead>
            <tr>
              <th>Alimento</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Caducidad</th>
            </tr>
          </thead>
          <tbody>
            {alimentos.slice(0, 3).map(a => (
              <tr key={a.id}>
                <td>{a.nombre}</td>
                <td>{a.cantidad}</td>
                <td>{a.categoria}</td>
                <td><span style={{ color: 'red', fontWeight: 'bold' }}>{a.caducidad}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Dashboard;