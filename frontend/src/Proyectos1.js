import axios from "axios";
import React, { useEffect, useState } from "react";

const Proyectos1 = () => {
    const [proyectos, setProyectos] = useState([]);
    
  const [filtroBusqueda, setFiltroBusqueda] = useState('');


    useEffect(() => {
        fetchProyectos();
        
    }, []);

    const proyectosFiltrados = proyectos.filter((c) => {
    const t = filtroBusqueda.toLowerCase();
    return(
        
        c.name_project.toLowerCase().includes(t) ||
        c.plant_owner.toLowerCase().includes(t) ||
        c.zone.toLowerCase().includes(t) ||
        c.owner.toLowerCase().includes(t) ||
        c.application.toLowerCase().includes(t) ||
        c.aerzen_product.toLowerCase().includes(t) ||
        c.ingenieroasignado.toLowerCase().includes(t)||
        c.inversion_usd.toLowerCase().includes(t)


        ); 
        });

    const fetchProyectos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/proyectos");
            setProyectos(response.data);
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    };

   
    const actualizarStatus = async (idProyecto, nuevoStatus) => {
  try {
    const response = await fetch(`http://localhost:5000/proyectos/${idProyecto}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: nuevoStatus }),
    });

    if (response.ok) {
      // Actualizar la lista de proyectos localmente o volver a cargar
      setProyectos((prevProyectos) =>
        prevProyectos.map((proyecto) =>
          proyecto.id_project === idProyecto
            ? { ...proyecto, status: nuevoStatus }
            : proyecto
        )
      );
    } else {
      console.error('Error al actualizar el status');
    }
  } catch (error) {
    console.error('Error en la petición:', error);
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
            
            <div style={{ padding: "20px" }}>

                {/* Filtro de búsqueda */}
            <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0 5px 20px',
            }}
            >
            <input
                type="text"
                placeholder="Buscar..."
                value={filtroBusqueda}
                onChange={e => setFiltroBusqueda(e.target.value)}
                style={{
                ...estilos.input,
                maxWidth: '300px',
                width: '100%',
                }}
            />
            </div>
                <table style={estilos.tabla}>
                    <thead style={estilos.tableHeader}>
                        <tr>
                            <th style={estilos.tableCell}>Id</th>
                            <th style={estilos.tableCell}>Name Projects</th>
                            <th style={estilos.tableCell}>Plant</th>
                            <th style={estilos.tableCell}>Zone</th>
                            <th style={estilos.tableCell}>Owner</th>
                            <th style={estilos.tableCell}>Application</th>
                            <th style={estilos.tableCell}>Product Aerzen</th>
                            <th style={estilos.tableCell}>Engineer</th>
                            <th style={estilos.tableCell}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proyectosFiltrados.map((proyecto) => (
                            <tr key={proyecto.id_project} style={estilos.tableRow}>
                                <td style={estilos.tableCell}>{proyecto.id_project}</td>
                                <td style={estilos.tableCell}>{proyecto.name_project}</td>
                                <td style={estilos.tableCell}>{proyecto.plant_owner}</td>
                                <td style={estilos.tableCell}>{proyecto.zone}</td>
                                <td style={estilos.tableCell}>{proyecto.owner}</td>
                                <td style={estilos.tableCell}>{proyecto.application}</td>
                                <td style={estilos.tableCell}>{proyecto.aerzen_product}</td>
                                <td style={estilos.tableCell}>{proyecto.ingenieroasignado}</td>
                                <td style={estilos.tableCell}>
                                <select
                                    value={proyecto.status || "En espera"}
                                    onChange={(e) => actualizarStatus(proyecto.id_project, e.target.value)}
                                    style={{
                                    padding: '5px',
                                    borderRadius: '1px',
                                    fontWeight: 'bold',
                                    backgroundColor:
                                        proyecto.status === 'Concluido' ? '#28a745' :
                                        proyecto.status === 'En proceso' ? '#ffc107' :
                                        proyecto.status === 'No concluido' ? '#98a6c4' :
                                        '#6c757d', 
                                    color: 'rgb(242, 242, 240)',
                                    border: 'none'
                                    }}
                                >
                                    <option value="En espera">En espera</option>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Concluido">Concluido</option>
                                    <option value="No concluido">No Concluido</option>
                                </select>
                                </td>



                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Proyectos1;


const estilos = {
    inicioContainer: {
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/imagen/lago.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: 'blue',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Klavika, sans-serif',
    
    
    },
    header: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 10,
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '8px',
        width: '100%',
    },
    logoImage: {
        width: '250px',
        height: '100px',
        objectFit: 'contain',
    },
    menu: {
        display: 'flex',
        gap: '20px',
        position: 'relative',
        alignItems: 'center', 
        padding: '10px 20px', // nuevo
        
    },
    enlace: {
        color: '#313131',
        textDecoration: 'none',
        fontSize: '18px',
        cursor: 'pointer',
    },
    menuItem: {
        position: 'relative',
        cursor: 'pointer',
    },
    submenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        padding: '10px',
        zIndex: 1000,
        minWidth: '160px',
    },
    submenuLink: {
        display: 'block',
        color: '#313131',
        padding: '8px 12px',
        textDecoration: 'none',
        fontSize: '15px',
        borderRadius: '4px',
    },
    iconoIdioma: {
        width: '40px',
        height: '13px',
        objectFit: 'contain',
    },

    botonAgregar: {
    padding: "10px 20px",
    backgroundColor: "#004171",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
    fontFamily: 'Klavika, sans-serif',
},
botonEliminar: {
    padding: "5px 10px",
    backgroundColor: "#004171",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
    fontFamily: 'Klavika, sans-serif',
},
botonEditar: {
    padding: "5px 10px",
    backgroundColor: "#004171",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
    fontFamily: 'Klavika, sans-serif',
},

modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    transition: "opacity 0.3s ease",
},
modalContenido: {
    backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  maxHeight: '90vh', // asegura que no sobrepase el alto de la pantalla
  overflowY: 'auto', // activa scroll si hay mucho contenido
  width: '90%', // o un valor como '600px'
  maxWidth: '800px',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  position: 'relative',
},
modalTitulo: {
    fontSize: "1.5em",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    textAlign: "center",
},
formulario: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // Dos columnas
    gap: "15px",
},
campoFormulario: {
    display: "flex",
    flexDirection: "column",
},


botones: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
},

modalBotonHover: {
    backgroundColor: "#004171",
},
modalBotonCerrar: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#f1f1f1",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "1.2em",
    color: "#333",
    transition: "background-color 0.2s ease",
},
modalBotonCerrarHover: {
    backgroundColor: "#e0e0e0",
},
modalBoton: {
    padding: "12px 20px",
    backgroundColor: "#004171   ",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
    transition: "background-color 0.3s ease",
},

// Estilos
inputs: {
    width: "100%", // Asegura que el campo ocupe el 100% del contenedor
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
    resize: "both", // Permite redimensionar el campo de texto
    minHeight: "40px", // Altura mínima para que no sea demasiado pequeño
    transition: "height 0.3s ease", // Transición suave al cambiar el tamaño
},

textarea: {
    width: "100%", // Asegura que el campo ocupe el 100% del contenedor
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
    resize: "both", // Permite redimensionar el campo de texto
    minHeight: "40px", // Altura mínima para que no sea demasiado pequeño
    transition: "height 0.3s ease", // Transición suave al cambiar el tamaño
},

tabla: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#707070",
    
    
},
input: {
    padding: '10px',
    fontSize: '1rem',
    width: '60%',
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
    tableCell: {
        padding: '8px',
        border: '1px solid #ccc',
        maxWidth: '200px', 
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
        
    },
};
