import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Inventario() {
  const [alimentos, setAlimentos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('Granos');
  const [caducidad, setCaducidad] = useState('');

  const cargarAlimentos = () => {
    fetch('/api/alimentos')
      .then(res => res.json())
      .then(data => setAlimentos(data));
  };

  useEffect(() => {
    cargarAlimentos();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    fetch('/api/alimentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, cantidad: parseInt(cantidad), categoria, caducidad })
    }).then(() => {
      setNombre('');
      setCantidad('');
      setCaducidad('');
      cargarAlimentos();
    });
  };

  const handleDelete = (id) => {
    fetch(`/api/alimentos/${id}`, { method: 'DELETE' })
      .then(() => cargarAlimentos());
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar title="Gestión de Inventario (CRUD)" />
        <form onSubmit={handleCreate} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3>Agregar Nuevo Alimento</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group"><label>Nombre</label><input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required /></div>
            <div className="form-group"><label>Cantidad</label><input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} required /></div>
            <div className="form-group">
              <label>Categoría</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                <option value="Granos">Granos</option>
                <option value="Enlatados">Enlatados</option>
                <option value="Lácteos">Lácteos</option>
              </select>
            </div>
            <div className="form-group"><label>Fecha Caducidad</label><input type="date" value={caducidad} onChange={e => setCaducidad(e.target.value)} required /></div>
          </div>
          <button type="submit" className="btn btn-primary">Guardar en Base de Datos</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Caducidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alimentos.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nombre}</td>
                <td>{a.cantidad}</td>
                <td>{a.categoria}</td>
                <td>{a.caducidad}</td>
                <td><button className="btn btn-danger" onClick={() => handleDelete(a.id)}>Borrar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Inventario;