import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Server, AlertTriangle, Package, Calendar, Activity, ArrowUpRight, ArrowDownLeft, BarChart3, PieChart } from 'lucide-react';

function Dashboard() {
  const [alimentos, setAlimentos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [nodeName, setNodeName] = useState('Detectando...');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    // 1. Cargar alimentos
    fetch('/api/alimentos')
      .then(res => res.json())
      .then(data => setAlimentos(data))
      .catch(() => {});

    // 2. Cargar historial de movimientos diarios
    fetch('/api/movimientos')
      .then(res => res.json())
      .then(data => setMovimientos(data))
      .catch(() => {});

    // 3. Estado del balanceador NGINX
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setNodeName(data.node))
      .catch(() => setNodeName('Error NGINX'));
  }, []);

  // --- LÓGICA FILTRADO DINÁMICO ---
  const fechaActual = new Date();

  // Filtrar productos en estado crítico (Stock menor o igual a 5 o ya vencidos)
  const alertasCriticas = alimentos.filter(a => {
    const fechaCaducidad = new Date(a.caducidad);
    return a.cantidad <= 5 || fechaCaducidad <= fechaActual;
  });

  // Contar cuántos productos están vencidos o vencen hoy
  const productosVencidosContador = alimentos.filter(a => {
    const fechaCaducidad = new Date(a.caducidad);
    return fechaCaducidad <= fechaActual;
  }).length;

  // --- PROCESAMIENTO PARA GRÁFICAS ESTADÍSTICAS ---
  const categoriasUnicas = [...new Set(alimentos.map(a => a.categoria))];
  const stockPorCategoria = categoriasUnicas.map(cat => {
    const total = alimentos.filter(a => a.categoria === cat).reduce((sum, a) => sum + Number(a.cantidad), 0);
    return { categoria: cat, total };
  });

  // Calcular totales para la gráfica de distribución de riesgo
  const totalProductos = alimentos.length;
  const porcentajeCritico = totalProductos > 0 ? (alertasCriticas.length / totalProductos) * 100 : 0;
  const porcentajeEstable = 100 - porcentajeCritico;

  // --- PALETA DE COLORES MODERNA Y ENÉRGICA ---
  const colors = {
    bgGeneral: '#F1F5F9',      // Fondo sutilmente azulado, más limpio
    textMain: '#0F172A',       // Slate oscuro de alta legibilidad
    cardBg: '#FFFFFF',
    primary: '#059669',      // Verde esmeralda con vida
    primaryLight: '#E6F4EA',
    danger: '#DC2626',       // Rojo vivo de alerta
    dangerBg: '#FFFEF2',
    warning: '#D97706',      // Ámbar corporativo
    infoBg: '#F0FDF4',
    border: '#CBD5E1',
    accent: '#3B82F6'        // Azul eléctrico interactivo para dar contraste
  };

  return (
    <div className="app-layout" style={{ backgroundColor: colors.bgGeneral, minHeight: '100vh', color: colors.textMain, fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem' }}>
        <Navbar title="Panel Principal Estratégico" />

        {/* Banner del Nodo Distribuidor */}
        <div style={{ 
          background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)', 
          padding: '1.25rem 1.5rem', 
          borderRadius: '14px', 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: '1px solid #7DD3FC',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)'
        }}>
          <Server size={22} color="#0369A1" />
          <p style={{ margin: 0, color: '#0369A1', fontWeight: '600', fontSize: '0.95rem' }}>
            Servidor Activo • Peticiones balanceadas • Round Robin
          </p>
        </div>

        {/* Tarjetas de Métricas Principales */}
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Tarjeta Total Productos */}
          <div 
            className="card" 
            onMouseEnter={() => setHoveredCard('total')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              background: colors.cardBg, 
              padding: '1.75rem', 
              borderRadius: '20px', 
              border: hoveredCard === 'total' ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
              boxShadow: hoveredCard === 'total' ? '0 12px 24px -10px rgba(59, 130, 246, 0.3)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: hoveredCard === 'total' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div>
              <h3 style={{ fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.075em', margin: '0 0 0.5rem 0', fontWeight: '700' }}>Insumos del Almacén</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: colors.textMain }}>{alimentos.length} <span style={{ fontSize: '1.25rem', fontWeight: '500', color: '#64748B' }}>Líneas</span></div>
            </div>
            <div style={{ background: '#EFF6FF', padding: '1.25rem', borderRadius: '16px' }}>
              <Package size={36} color={colors.accent} />
            </div>
          </div>

          {/* Tarjeta de Caducidad Dinámica */}
          <div 
            className="card" 
            onMouseEnter={() => setHoveredCard('alertas')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              background: productosVencidosContador > 0 ? '#FEF2F2' : colors.cardBg, 
              padding: '1.75rem', 
              borderRadius: '20px', 
              border: hoveredCard === 'alertas' ? `2px solid ${colors.danger}` : `1px solid ${productosVencidosContador > 0 ? '#FCA5A5' : colors.border}`,
              boxShadow: hoveredCard === 'alertas' ? '0 12px 24px -10px rgba(220, 38, 38, 0.3)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: hoveredCard === 'alertas' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div>
              <h3 style={{ fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.075em', margin: '0 0 0.5rem 0', fontWeight: '700' }}>Alertas de Vencimiento</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: productosVencidosContador > 0 ? colors.danger : '#475569' }}>
                {productosVencidosContador > 0 ? `${productosVencidosContador} Críticos` : '0 Alertas'}
              </div>
            </div>
            <div style={{ background: productosVencidosContador > 0 ? '#FEE2E2' : '#F1F5F9', padding: '1.25rem', borderRadius: '16px' }}>
              <Calendar size={36} color={productosVencidosContador > 0 ? colors.danger : '#475569'} />
            </div>
          </div>

        </div>

        {/* --- SECCIÓN DE GRÁFICAS ESTADÍSTICAS REFINADAS --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Gráfica de Barras Dinámica */}
          <div style={{ background: colors.cardBg, padding: '1.75rem', borderRadius: '24px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textMain }}>
              <BarChart3 size={20} color={colors.primary} /> Niveles de Existencias por Categoría
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {stockPorCategoria.length === 0 ? <p style={{ color: '#94A3B8' }}>No hay datos suficientes</p> : 
                stockPorCategoria.map(item => (
                  <div key={item.categoria} className="bar-row">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: '700', color: '#334155' }}>{item.categoria}</span>
                      <span style={{ color: colors.primary, fontWeight: '700' }}>{item.total} unidades</span>
                    </div>
                    <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '9999px', height: '12px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                      <div style={{ 
                        width: `${Math.min((item.total / 300) * 100, 100)}%`, // Escalado dinámico inteligente
                        background: `linear-gradient(90deg, ${colors.primary} 0%, #10B981 100%)`, 
                        height: '100%', 
                        borderRadius: '9999px',
                        transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}></div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Gráfica de Pastel (Distribución Crítica) */}
          <div style={{ background: colors.cardBg, padding: '1.75rem', borderRadius: '24px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textMain }}>
              <PieChart size={20} color={colors.warning} /> Diagnóstico de Seguridad e Inventario
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '80%', paddingTop: '0.5rem' }}>
              <div style={{ 
                position: 'relative', 
                width: '140px', 
                height: '140px', 
                borderRadius: '50%', 
                background: `conic-gradient(${colors.danger} 0% ${porcentajeCritico}%, ${colors.primary} ${porcentajeCritico}% 100%)`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ width: '95px', height: '95px', background: '#FFF', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', color: '#475569' }}>
                  <span>Balance</span>
                  <span style={{ color: colors.accent, fontSize: '0.75rem', fontWeight: '500' }}>Estadístico</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                  <div style={{ width: '14px', height: '14px', background: colors.danger, borderRadius: '4px' }}></div> 
                  Riesgo Crítico ({Math.round(porcentajeCritico)}%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                  <div style={{ width: '14px', height: '14px', background: colors.primary, borderRadius: '4px' }}></div> 
                  Estado Estable ({Math.round(porcentajeEstable)}%)
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Tablas Operativas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          
          {/* Alertas Críticas Filtradas */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={22} color={colors.danger} /> Productos en Alerta Crítica
            </h3>
            <div style={{ background: colors.cardBg, borderRadius: '20px', border: `1px solid ${colors.border}`, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: `2px solid ${colors.border}` }}>
                    <th style={{ padding: '1.25rem', color: '#475569', fontWeight: '700' }}>Alimento</th>
                    <th style={{ padding: '1.25rem', color: '#475569', fontWeight: '700' }}>Cantidad</th>
                    <th style={{ padding: '1.25rem', color: '#475569', fontWeight: '700' }}>Categoría</th>
                    <th style={{ padding: '1.25rem', color: '#475569', fontWeight: '700' }}>Caducidad</th>
                  </tr>
                </thead>
                <tbody>
                  {alertasCriticas.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', fontWeight: '500' }}>Todo bajo control. No hay alertas críticas de almacén.</td></tr>
                  ) : (
                    alertasCriticas.map(a => {
                      const esInseguro = new Date(a.caducidad) <= fechaActual;
                      return (
                        <tr key={a.id} className="table-row-interactive" style={{ borderBottom: `1px solid ${colors.border}`, background: a.cantidad <= 5 ? '#FFF7ED' : 'transparent', transition: 'background 0.2s' }}>
                          <td style={{ padding: '1.25rem', fontWeight: '700', color: '#1E293B' }}>{a.nombre}</td>
                          <td style={{ padding: '1.25rem', color: a.cantidad <= 5 ? colors.danger : colors.textMain, fontWeight: '800' }}>
                            {a.cantidad} {a.cantidad <= 5 ? '' : ''}
                          </td>
                          <td style={{ padding: '1.25rem', color: '#475569' }}>{a.categoria}</td>
                          <td style={{ padding: '1.25rem' }}>
                            <span style={{ 
                              color: '#FFF', 
                              background: esInseguro ? colors.danger : colors.warning, 
                              padding: '0.35rem 0.75rem', 
                              borderRadius: '8px', 
                              fontSize: '0.8rem',
                              fontWeight: '700' 
                            }}>
                              {a.caducidad}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historial Cruzado Reciente Ordenado Dinámicamente */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={22} color={colors.accent} /> Operaciones del Día
            </h3>
            <div style={{ background: colors.cardBg, borderRadius: '20px', border: `1px solid ${colors.border}`, padding: '1.25rem', maxHeight: '350px', overflowY: 'auto', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
              {movimientos.length === 0 ? (
                <p style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem', fontWeight: '500' }}>No se registran transacciones el día de hoy.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* 🔥 Agregamos .reverse() para garantizar que los últimos movimientos creados aparezcan de primero */}
                  {[...movimientos].reverse().slice(0, 5).map(mov => {
                    const esEntrada = mov.tipo.toUpperCase().includes('ENTRADA');
                    return (
                      <div key={mov.id} className="feed-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {esEntrada ? (
                            <div style={{ background: '#D1FAE5', padding: '0.5rem', borderRadius: '12px', display: 'flex' }}><ArrowUpRight size={18} color="#065F46" /></div>
                          ) : (
                            <div style={{ background: '#FEE2E2', padding: '0.5rem', borderRadius: '12px', display: 'flex' }}><ArrowDownLeft size={18} color="#991B1B" /></div>
                          )}
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B' }}>{mov.producto}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>{mov.tipo.toUpperCase()}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: esEntrada ? '#065F46' : '#991B1B' }}>
                          {esEntrada ? '+' : '-'}{mov.cantidad}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;