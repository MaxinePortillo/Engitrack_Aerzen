import React, { useEffect, useState } from 'react';

export default function Reuniones() {
  const [reuniones, setReuniones] = useState([]);
    const [mostrarSubmenu, setMostrarSubmenu] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/reuniones')
      .then(res => res.json())
      .then(data => setReuniones(data))
      .catch(err => console.error('Error cargando reuniones:', err));
  }, []);

  return (
    <div style={estilos.inicioContainer}>
          <header style={estilos.header}>
            <div style={estilos.logoContainer}>
              <img src="/imagen/aerzen.png" alt="Logo" style={estilos.logoImage} />
            </div>
            <nav style={estilos.menu}>
              <a href="Inicio" style={estilos.enlace}>Home</a>
              <a href="Rutas" style={estilos.enlace}>Routes</a>
              <a href="Reuniones" style={estilos.enlace}>Meetings</a>
              <div
                style={estilos.menuItem}
                onMouseEnter={() => setMostrarSubmenu(true)}
                onMouseLeave={() => setMostrarSubmenu(false)}
              >
                <a style={estilos.enlace }>
            Sales
          </a>
          {mostrarSubmenu && (
                  <div style={estilos.submenu}>
                    <a href="Proyectos" style={estilos.submenuLink}>Projects</a>
                    <a href="Ingenieros" style={estilos.submenuLink}>Engineers</a>
                  </div>
                )}
              </div>
              <a href="Contactos" style={estilos.enlace}>Plant</a>
              <a href="Management" style={estilos.enlace}>Management</a>
              <a href="Login" style={estilos.enlace}>Log out</a>
            </nav>
          </header>
    
    <text style={estilos.titulo}></text>
     <text style={estilos.titulo}></text>     
     <text style={estilos.titulo}></text>   
    <table style={estilos.tabla}>
                <thead style={estilos.tableHeader}>
                    <tr>
              <th style={estilos.th}>ID</th>
              <th style={estilos.th}>Fecha</th>
              <th style={estilos.th}>Hora</th>
              <th style={estilos.th}>Contacto</th>
              <th style={estilos.th}>Ubicación</th>
              <th style={estilos.th}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {reuniones.map((r) => (
              <tr key={r.id} style={estilos.tableRow}>
                <td style={estilos.td}>{r.id}</td>
                <td style={estilos.td}>{new Date(r.fecha).toLocaleDateString()}</td>
                <td style={estilos.td}>{r.hora}</td>
                <td style={estilos.td}>{r.contacto}</td>
                <td style={estilos.td}>{r.ubicacion}</td>
                <td style={estilos.td}>{r.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
  );
}

const estilos = {
    
  inicioContainer: {
    minHeight: "100vh",
    backgroundImage:
      'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/imagen/2C.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    color: "blue",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Klavika, sans-serif",
  },

  header: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative",
    zIndex: 10,
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "8px",
    width: "100%",
  },
  logoImage: {
    width: "250px",
    height: "100px",
    objectFit: "contain",
  },
  menu: {
    display: "flex",
    gap: "20px",
    position: "relative",
    alignItems: "center",
    padding: "10px 20px", // nuevo
  },

  enlace: {
    color: "#313131",
    textDecoration: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  menuItem: {
    position: "relative",
    cursor: "pointer",
  },
  submenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    borderRadius: "8px",
    padding: "10px",
    zIndex: 1000,
    minWidth: "160px",
  },
  submenuLink: {
    display: "block",
    color:'#313131',
        padding: '8px 12px',
        textDecoration: 'none',
        fontSize: '15px',
        borderRadius: '4px',
    },
    principal: {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center', // 👈 Alinea a la derecha
  alignItems: 'center',
  paddingRight: '50px',       // 👈 Opcional: espacio entre el borde derecho y el contenido
},

grafica: {
  width: '300px',
},

principal1: {
  height: '100vh',
  display: 'flex',
  justifyContent: 'flex-start', // 👈 Alinea a la derecha
  alignItems: 'center',
  paddingRight: '40px',       // 👈 Opcional: espacio entre el borde derecho y el contenido
},
      cuadro: {
  margin: '5px',                    // espacio mínimo alrededor
  backgroundColor: 'rgba(255,255,255,0.8)',
  boxShadow: '0 4px 20px rgba(0,0,0,1)',
  padding: '60px 100px',
  width: '600px',
  textAlign: 'center',
},

cuadro1: {
  marginTop: '-180px',    
  margin: '5px',                // espacio mínimo alrededor
  backgroundColor: 'rgba(255,255,255,0.8)',
  boxShadow: '0 4px 20px rgba(0,0,0,1)',
  padding: '57px 50px',
  width: '300px',
  textAlign: 'center',
},

      
      descripcion: {
        fontSize: '16px',
        marginTop: '1px',
        color: '#313131',
      },
      panel: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
      },
      tarjeta: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '15px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        color: '#313131',
      },
    
    iconoIdioma: {
        width: '40px',
        height: '13px',
        objectFit: 'contain',
    },
    


  contenedor: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#707070",
  },
  titulo: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize:'40px',
    fontFamily:'Klavika',
    fontWeight:'1',
    color:'#004171'
  },
  tabla: {
 width: "100%",
    borderCollapse: "collapse",
    color: "#707070",
        
        

  },
  tableHeader: {
        backgroundColor: '#004171',
        color: '#fff',
        
        
    },
  tableRow: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transition: 'background-color 0.3s ease',
        color: '#313131',
        
       
    },
  th: {
    padding: '8px',
        border: '1px solid #ccc',
        maxWidth: '200px', 
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
  },
  td: {
    padding: '8px',
        border: '1px solid #ccc',
        maxWidth: '200px', 
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
  }
};
