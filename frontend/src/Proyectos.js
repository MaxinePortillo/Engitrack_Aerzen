import axios from "axios";
import React, { useEffect, useState } from "react";



const Proyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [name_project, setNameProject] = useState("");
    const [plant_owner, setPlantOwner] = useState("");
    const [zone, setZone] = useState("");
    const [zonas, setZonas] = useState([]);
    const [owner, setOwner] = useState("");
    const [application, setApplication] = useState("");
    const [aerzen_product, setAerzenProduct] = useState("");
    const [ingenieroasignado, setIngenieroAsignado] = useState([]);
    const [inversion_usd, setInversionUsd] = useState("");
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingenieros, setIngenieros] = useState([]);
    const [mostrarSubmenu, setMostrarSubmenu] = useState(false);
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    

    

    useEffect(() => {
        fetchProyectos();
        fetchIngenieros();
        fetchZonas();
    }, []);  
    
    const fetchZonas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/zonas');
            setZonas(response.data);
        } catch (error) {
            console.error('Error al obtener zonas:', error);
        }
    };

    const fetchProyectos = async () => {
        try {
            
            const response = await axios.get("http://localhost:5000/proyectos"); 
                setProyectos(response.data);
            }catch (error) {
                console.error("Error al obtener proyectos:", error);
            }
    };

    const fetchIngenieros = async () => {
        try {
            const response = await axios.get('http://localhost:5000/ingenieros');
            setIngenieros(response.data);
        } catch (error) {
            console.error('Error al obtener ingenieros:', error);
        }
    };

    const agregarProyecto = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!name_project) {
                alert("Name Project" + " es requerido.");
                return;
            }
            const ingenierosAsignadosArray = ingenieroasignado.join(", ");  
    
            const response = await axios.post("http://localhost:5000/proyectos", {
                inversion_usd,
                name_project, 
                plant_owner, 
                zone, 
                owner, 
                application, 
                aerzen_product, 
                ingenieroasignado: ingenierosAsignadosArray, 
            }, { headers: { Authorization: `Bearer ${token}` } });
    
            setProyectos([...proyectos, response.data]);
            resetForm();  // Limpia los campos después de agregar el proyecto
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al agregar proyecto:", error);
        }
    };
    const resizeTextarea = (e) => {
        e.target.style.height = 'auto'; // Resetea la altura para ajustar el contenido.
        e.target.style.height = `${e.target.scrollHeight}px`; // Ajusta la altura según el contenido.
    };
     
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
    
    
    

    const modificarProyecto = async () => {
        try {
            const token = localStorage.getItem("token");
            
         
            const ingenierosAsignadosArray = ingenieroasignado.join(", ");  
          

    
            const response = await axios.put(`http://localhost:5000/proyectos/${editingProjectId}`, {
                inversion_usd,
                name_project, 
                plant_owner, 
                zone, 
                owner, 
                application, 
                aerzen_product, 
                ingenieroasignado: ingenierosAsignadosArray, 
            }, { headers: { Authorization: `Bearer ${token}` } });
    
            setProyectos(proyectos.map((proyecto) =>
                proyecto.id_project === editingProjectId ? response.data : proyecto
            ));
            resetForm();  // Limpia los campos después de modificar el proyecto
            setIsModalOpen(false);
            setEditingProjectId(null);
        } catch (error) {
            console.error("Error al modificar proyecto:", error);
        }
    };
    

    const eliminarProyecto = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/proyectos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProyectos(proyectos.filter((proyecto) => proyecto.id_project !== id));
        } catch (error) {
            console.error("Error al eliminar proyecto:", error);
        }
    };

    const editarProyecto = (proyecto) => {
        setNameProject(proyecto.name_project);
        setPlantOwner(proyecto.plant_owner);
        setZone(proyecto.zone);
        setOwner(proyecto.owner);
        setApplication(proyecto.application);
        setAerzenProduct(proyecto.aerzen_product);
        setInversionUsd(proyecto.inversion_usd);
        
        // Asegurarse de que ingenieroasignado siempre sea un array
        setIngenieroAsignado(Array.isArray(proyecto.ingenieroasignado) ? proyecto.ingenieroasignado : [proyecto.ingenieroasignado]);
        
        setEditingProjectId(proyecto.id_project);
        setIsModalOpen(true);
    };
    
    const abrirModalAgregarProyecto = () => {
        resetForm(); // Limpia los campos antes de agregar un nuevo proyecto
        setEditingProjectId(null); // Asegúrate de que el ID del proyecto editado sea null
        setIsModalOpen(true); // Abre el modal para agregar el proyecto
    };
    

    
    
    

    const resetForm = () => {
        setNameProject("");
        setPlantOwner("");
        setZone("");
        setOwner("");
        setApplication("");
        setAerzenProduct("");
        setIngenieroAsignado([]);  // Limpia ingeniero asignado
        setInversionUsd("");
    };

    
    

    
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

            <div style={{ padding: "20px" }}>
            <button onClick={abrirModalAgregarProyecto} style={estilos.botonAgregar}>
    + Add Project
</button>

                {isModalOpen && (
    <div style={estilos.modal}>
        <div style={estilos.modalContenido}>
            <button 
                onClick={() => setIsModalOpen(false)} 
                style={estilos.modalBotonCerrar}
                onMouseEnter={(e) => e.target.style.backgroundColor = estilos.modalBotonCerrarHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = ''} 
            >
                &times;
            </button>
            <h2 style={estilos.modalTitulo}>{editingProjectId ? "Edit" : "Add"}</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                editingProjectId ? modificarProyecto() : agregarProyecto();
            }}>
                <div style={estilos.formulario}>
                    <div style={estilos.campoFormulario}>
                        <label htmlFor="name_project">Name Project</label>
                        <textarea
                            id="name_project"
                            style={estilos.textarea} 
                            placeholder="Name Project"
                            value={name_project} 
                            onChange={(e) => setNameProject(e.target.value)} 
                            required 
                            aria-label="Name Project"
                            rows={1} 
                            onInput={resizeTextarea}
                        />
                    </div>
                                    <div style={estilos.campoFormulario}>
                    <label htmlFor="inversion_usd">Investment (USD)</label>
                    <input
                        id="inversion_usd"
                        type="number"
                        style={estilos.inputs}
                        placeholder="Investment in USD"
                        value={inversion_usd}
                        onChange={(e) => setInversionUsd(e.target.value)}
                        aria-label="Investment in USD"
                        step="0.01"
                    />
</div>

                    <div style={estilos.campoFormulario}>
                        <label htmlFor="plant_owner">Plant</label>
                        <textarea
                            id="plant_owner"
                            style={estilos.textarea} 
                            placeholder="Plant" 
                            value={plant_owner} 
                            onChange={(e) => setPlantOwner(e.target.value)} 
                            aria-label="Plant"
                            rows={1} 
                            onInput={resizeTextarea}
                        />
                    </div>

                    <div style={estilos.campoFormulario}>
    <label htmlFor="zone">Zone</label>
    <select
        id="zone"
        style={estilos.inputs}
        value={zone}
        onChange={(e) => setZone(e.target.value)}  // Cambiado para que solo se seleccione un valor
        aria-label="Zone"
    >
        <option value="">Zone</option>
        {zonas.map((zona) => (
    <option key={zona.id || zona.nombre} value={zona.nombre}> {zona.nombre} </option>
))}

    </select>
</div>


                    <div style={estilos.campoFormulario}>
                        <label htmlFor="owner">Owner</label>
                        <textarea
                            id="owner"
                            style={estilos.textarea} 
                            placeholder="Owner" 
                            value={owner} 
                            onChange={(e) => setOwner(e.target.value)} 
                            aria-label="Owner"
                            rows={1} 
                            onInput={resizeTextarea}
                        />
                    </div>

                    <div style={estilos.campoFormulario}>
                        <label htmlFor="application">Aplication</label>
                        <textarea
                            id="application"
                            style={estilos.textarea} 
                            placeholder="Aplication"
                            value={application} 
                            onChange={(e) => setApplication(e.target.value)} 
                            aria-label="Aplication"
                            rows={1} 
                            onInput={resizeTextarea}
                        />
                    </div>

                    <div style={estilos.campoFormulario}>
                        <label htmlFor="aerzen_product">Product Aerzen</label>
                        <textarea
                            id="aerzen_product"
                            style={estilos.textarea} 
                            placeholder="Product Aerzen"
                            value={aerzen_product} 
                            onChange={(e) => setAerzenProduct(e.target.value)} 
                            aria-label="Product Aerzen"
                            rows={1} 
                            onInput={resizeTextarea}
                        />
                    </div>

                    <div style={estilos.campoFormulario}>
                    <label htmlFor="ingenieroasignado">Enginner</label>
                    <select 
                        id="ingenieroasignado"
                        style={estilos.inputs} 
                        multiple
                        value={ingenieroasignado} 
                        onChange={(e) => 
                            setIngenieroAsignado(
                                Array.from(e.target.selectedOptions, option => option.value)
                            )
                        } 
                        aria-label="Enginner"
                        required
                    >
                        <option value="">Enginner</option>
                        {ingenieros.map((ingeniero) => (
                            <option key={ingeniero.id} value={ingeniero.name}> 
                                {ingeniero.nombre_usuario}
                            </option>
                        ))}
                    </select>
                </div>
                </div>

                <div style={estilos.botones}>
                    <button 
                        type="submit" 
                        style={estilos.modalBoton}
                        onMouseEnter={(e) => e.target.style.backgroundColor = estilos.modalBotonHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                    >
                        Save
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)} 
                        style={estilos.modalBoton}
                        onMouseEnter={(e) => e.target.style.backgroundColor = estilos.modalBotonHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = ''} 
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
)}


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
                            <th style={estilos.tableCell}>Aplication</th>
                            <th style={estilos.tableCell}>Product Aerzen</th>
                            <th style={estilos.tableCell}>TIV $ USD</th>
                            <th style={estilos.tableCell}>Enginner</th>
                            <th style={estilos.tableCell}>Status</th>
                            <th style={estilos.tableCell}></th>
                            
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
                                <td style={estilos.tableCell}>{proyecto.inversion_usd}</td>
                                <td style={estilos.tableCell}>{proyecto.ingenieroasignado}</td>
                                <td style={estilos.tableCell}>{proyecto.status}</td>
                                
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <button style={estilos.botonEliminar} onClick={() => eliminarProyecto(proyecto.id_project)}>
                                        Delete
                                        </button>
                                        <button style={estilos.botonEditar} onClick={() => editarProyecto(proyecto)}>
                                        Edit
                                        </button>
                                    </div>
                                    </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Proyectos;


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
input: {
    padding: '10px',
    fontSize: '1rem',
    width: '60%',
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
tableHeader: {
        backgroundColor: '#004171',
        color: '#fff',
        
    },
    tableRow: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transition: 'background-color 0.3s ease',
        color: '#313131',
        fontSize: '13px',
       
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
