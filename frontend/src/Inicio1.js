import React, { useEffect, useState } from "react";
import axios from "axios";
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,CartesianGrid,} from "recharts";

const Inicio1 = () => {
  const [totalProyectos, setTotalProyectos] = useState(0);
  const [totalIngenieros, setTotalIngenieros] = useState(0);

  const [proyectosPorEstado, setProyectosPorEstado] = useState({
    Concluido: 0,
    "En proceso": 0,
    "No concluido": 0,
    "En espera": 0,
  });

  const [inversionesPorZona, setInversionesPorZona] = useState({});

  useEffect(() => {
    obtenerProyectos();
    obtenerIngenieros();
  }, []);

  const obtenerProyectos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/proyectos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotalProyectos(res.data.length);

      // Contar proyectos por estado
      const conteo = {
        Concluido: 0,
        "En proceso": 0,
        "No concluido": 0,
        "En espera": 0,
      };

      // Acumular inversiones por zona
      const inversionesZona = {};

      res.data.forEach((p) => {
        const estado = p.status || "En espera";
        conteo[estado] = (conteo[estado] || 0) + 1;

        // Sumar inversión por zona usando los campos correctos
        const zona = p.zone || "Sin zona";
        const inversion = parseFloat(p.inversion_usd) || 0;
        inversionesZona[zona] = (inversionesZona[zona] || 0) + inversion;
      });

      setProyectosPorEstado(conteo);
      setInversionesPorZona(inversionesZona);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    }
  };

  const obtenerIngenieros = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/ingenieros", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalIngenieros(res.data.length);
    } catch (error) {
      console.error("Error al obtener ingenieros:", error);
    }
  };

  return (
    <div style={estilos.inicioContainer}>
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

      <main style={estilos.principal}>
        <div style={estilos.cuadro1}>
          <h1 style={estilos.titulo}>Overview</h1>
          <p style={estilos.descripcion}>
            This summary present the total number of projects currently registered and the total number of engineers assigned.
          </p>
          <div style={estilos.panel}>
            <div style={estilos.tarjeta}>
              <h2>Total Projects</h2>
              <p>{totalProyectos}</p>
            </div>
            <div style={estilos.tarjeta}>
              <h2>Total Engineers</h2>
              <p>{totalIngenieros}</p>
            </div>
          </div>
        </div>

        <div style={{ ...estilos.cuadro1, marginLeft: '10px', marginTop: '-180px' }}>
          <h1 style={estilos.titulo}>Project Status Summary</h1>

          {/* Gráfica de pastel */}
          <div style={estilos.grafica}>
            <ResponsiveContainer width="100%" height={235}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Concluido', value: proyectosPorEstado['Concluido'] },
                    { name: 'En proceso', value: proyectosPorEstado['En proceso'] },
                    { name: 'No concluido', value: proyectosPorEstado['No concluido'] },
                    { name: 'En espera', value: proyectosPorEstado['En espera'] },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  <Cell fill="#28a745" />
                  <Cell fill="#ffc107" />
                  <Cell fill="#98a6c4" />
                  <Cell fill="#6c757d" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          
        </div>
      </main>
      <main style={estilos.principal}>
      {/* Gráfica de barras de inversiones por zona */}
      <div style={{ ...estilos.cuadro, marginLeft: '10px', marginTop:'-300px'}}> {/* Hacer la posicion*/}
          <div style={{ marginTop: '1px', width: '100%', height: 300 }}>
            <h3 style={estilos.titulo}>TIV (USD)</h3>
            <p style={estilos.descripcion}>
            This bar chart displays the total investment in USD for each zone, aggregating all project investments by region to highlight which areas have received the most funding.
          </p>
            <ResponsiveContainer>
              <BarChart
                data={Object.entries(inversionesPorZona).map(([zone, inversion]) => ({ zone, inversion }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" tick={{ fontSize: 14 }} />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`}  tick={{ fontSize: 14 }}/>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="inversion" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
         </div> </div>
         </main>
    </div>
  );
};

export default Inicio1;

const estilos = {
  inicioContainer: {
    minHeight: "100vh",
    backgroundImage:
      'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/imagen/ptar.jpg")',
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

      titulo: {
        fontSize: '24px',
        marginTop: '1px',
        color: '#313131',
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
    
};
