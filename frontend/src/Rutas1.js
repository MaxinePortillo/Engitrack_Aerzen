import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const colors = ['blue', 'red', 'green', 'purple', 'orange', 'darkgreen', 'maroon'];

function MoverMapa({ coords }) {
  const map = useMap();
  if (coords) {
    map.setView(coords, 13);
  }
  return null;
}

export default function Rutas() {
  const [rutas, setRutas] = useState([]);
  const [centro, setCentro] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/rutas')
      .then(res => res.json())
      .then(data => setRutas(data))
      .catch(err => console.error('Error cargando rutas:', err));
  }, []);

  const handleSeleccionar = (coords) => {
    if (coords.length > 0) {
      const [lat, lng] = [coords[0][1], coords[0][0]];
      setCentro([lat, lng]);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Encabezado arriba */}
      <header style={estilos.header}>
        <div style={estilos.logoContainer}>
          <img src="/imagen/aerzen.png" alt="Logo" style={estilos.logoImage} />
        </div>
        <nav style={estilos.menu}>
          <a href="Inicio1" style={estilos.enlace}>Home</a>
        <a href="Rutas1" style={estilos.enlace}>Routes</a>
        <a href="Reuniones1" style={estilos.enlace}>Meetings</a>
                     <a href="Proyectos1" style={estilos.enlace}>Projects</a>
                    <a href="Contactos1" style={estilos.enlace}>Plant</a> 
                    
   
        
        <a href="Login" style={estilos.enlace}>Log out</a>
        </nav>
      </header>

      {/* Contenido dividido: Mapa y Tabla */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Mapa */}
        <div style={{ flex: 2 }}>
          <MapContainer center={[19.4326, -99.1332]} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <MoverMapa coords={centro} />
            {rutas.map((ruta, index) => {
              const coords = ruta.geometria.coordinates.map(([lng, lat]) => [lat, lng]);
              const color = colors[index % colors.length];
              return (
                <Polyline
                  key={ruta.id}
                  positions={coords}
                  color={color}
                  weight={5}
                  opacity={0.7}
                  dashArray="8, 8"
                >
                  <Popup>
                    <div style={{ lineHeight: '1.5', fontSize: '14px' }}>
                      <strong style={{ fontSize: '16px' }}>{ruta.nombre}</strong><br />
                      📅 <strong>Fecha:</strong> {new Date(ruta.fecha).toLocaleDateString()}<br />
                      👤 <strong>Ingeniero:</strong> {ruta.usuario_nombre}
                    </div>
                  </Popup>
                </Polyline>
              );
            })}
          </MapContainer>
        </div>

        {/* Tabla */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: '1rem',
          overflowY: 'auto',
          borderLeft: '1px solid #ddd'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>View</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#eaeaea' }}>
              <tr>
                <th style={estilos.th}>Nombre</th>
                <th style={estilos.th}>Fecha</th>
                <th style={estilos.th}>Ingeniero</th>
              </tr>
            </thead>
            <tbody>
              {rutas.map((ruta) => (
                <tr
                  key={ruta.id}
                  onClick={() => handleSeleccionar(ruta.geometria.coordinates)}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d2e6ff'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={estilos.td}>{ruta.nombre}</td>
                  <td style={estilos.td}>{new Date(ruta.fecha).toLocaleDateString()}</td>
                  <td style={estilos.td}>{ruta.usuario_nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🎨 Estilos
const estilos = {
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoImage: {
    width: "250px",
    height: "100px",
    objectFit: "contain",
  },
  menu: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  enlace: {
    color: "#313131",
    textDecoration: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  th: {
    padding: '8px',
    border: '1px solid #ccc',
    textAlign: 'left',
    backgroundColor: '#004171',
    color: 'white',
  },
  td: {
    padding: '8px',
    border: '1px solid #ccc',
  }
};
