import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Ingenieros = () => {
    const [ingenieros, setIngenieros] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
    const [id_usuario, setIdUsuario] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [zona, setZona] = useState([]);
    const [status, setStatus] = useState('activo');
    const [editingIngeniero, setEditingIngeniero] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // Estado de modal para registro
    const [editModalOpen, setEditModalOpen] = useState(false); // Estado de modal para edición
    const [mostrarSubmenu, setMostrarSubmenu] = useState(false);
    

   
    useEffect(() => {
        fetchIngenieros();
        fetchZonas();
        fetchUsuariosDisponibles();
    }, []);

    const fetchIngenieros = async () => {
        const res = await axios.get('http://localhost:5000/ingenieros');
        setIngenieros(res.data);
    };

    const fetchZonas = async () => {
        const res = await axios.get('http://localhost:5000/zonas');
        setZonas(res.data);
    };

    const fetchUsuariosDisponibles = async () => {
        const resUsuarios = await axios.get('http://localhost:5000/usuarios');
        const resIngenieros = await axios.get('http://localhost:5000/ingenieros');
        const idsRegistrados = resIngenieros.data.map(i => i.id_usuario);
        const disponibles = resUsuarios.data.filter(u => !idsRegistrados.includes(u.id));
        setUsuariosDisponibles(disponibles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                id_usuario,
                especialidad,
                zona,
                status,
            };

            if (editingIngeniero) {
                await axios.put(`http://localhost:5000/ingenieros/${editingIngeniero.id}`, data);
            } else {
                await axios.post('http://localhost:5000/ingenieros', data);
            }

            resetForm();
            fetchIngenieros();
            fetchUsuariosDisponibles();
            setModalOpen(false); // Cierra el modal de registro
            setEditModalOpen(false); // Cierra el modal de edición
        } catch (err) {
            console.error('Error guardando ingeniero:', err);
        }
    };

    const handleEdit = (ingeniero) => {
        setEditingIngeniero(ingeniero);
        setIdUsuario(ingeniero.id_usuario);
        setEspecialidad(ingeniero.especialidad);
        setZona(ingeniero.zona ? ingeniero.zona.split(',') : []);
        setStatus(ingeniero.status);
        setEditModalOpen(true); // Abre el modal de edición
    };

    const resetForm = () => {
        setEditingIngeniero(null);
        setIdUsuario('');
        setEspecialidad('');
        setZona([]);
        setStatus('activo');
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
            <button style={estilos.botonAgregar} onClick={() => setModalOpen(true)}>Register Enginners</button>

            
            {modalOpen && (
                <div style={estilos.modal}>
                    <div style={estilos.modalContenido}>
                    <h3 style={{ marginBottom: '20px' }}>Register Engineer</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={estilos.campoFormulario}>
                            <label>Engineer:</label>
                            <select style={estilos.select} value={id_usuario} onChange={(e) => setIdUsuario(e.target.value)} required>
                                <option value="">Select a User</option>
                                {usuariosDisponibles.map(user => (
                                    <option key={user.id} value={user.id}>{user.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div style={estilos.campoFormulario}>
                            <label>Especiality:</label>
                            <input
                                style={estilos.input}
                                type="text"
                                value={especialidad}
                                onChange={(e) => setEspecialidad(e.target.value)}
                                required
                            />
                        </div>

                        <div style={estilos.campoFormulario}>
                            <label>Zones:</label>
                            <select
                                multiple
                                style={estilos.select}
                                value={zona}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                                    setZona(selected);
                                }}
                            >
                                {zonas.map(z => (
                                    <option key={z.id} value={z.nombre}>{z.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div style={estilos.campoFormulario}>
                            <label>Status:</label>
                            <select style={estilos.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="activo">Active</option>
                                <option value="inactivo">Inactive</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" style={estilos.boton}>Register</button>
                            <button type="button" style={estilos.botonCerrar} onClick={() => setModalOpen(false)}>Close</button>
                        </div>
                    </form>

                    </div>
                </div>
            )}

          

            
            <table style={estilos.tabla}>
                <thead style={estilos.tableHeader}>
                    <tr>
                        <th style={estilos.tableCell}>Id</th>
                        <th style={estilos.tableCell}>Enginner</th>
                        <th style={estilos.tableCell}>Especiality</th>
                        <th style={estilos.tableCell}>Zone</th>
                        <th style={estilos.tableCell}>Status</th>
                        <th style={estilos.tableCell}></th>
                    </tr>
                </thead>
                <tbody>
                    {ingenieros.map(ing => (
                        <tr key={ing.id} style={estilos.tableRow}>
                            <td style={estilos.tableCell}>{ing.id}</td>
                            <td style={estilos.tableCell}>{ing.nombre_usuario}</td>
                            <td style={estilos.tableCell}>{ing.especialidad}</td>
                            <td style={estilos.tableCell}>{ing.zona}</td>
                            <td style={estilos.tableCell}
                            >{ing.status}</td>
                            <td>
                                <button style={estilos.botonEliminar} onClick={() => handleEdit(ing)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para editar */}
            {editModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: '0', left: '0',
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '400px',
                    }}>
                        <h3>Editar Ingeniero</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Especialidad: </label>
                                <input
                                    type="text"
                                    value={especialidad}
                                    onChange={(e) => setEspecialidad(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Zonas: </label>
                                <select multiple value={zona} onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                                    setZona(selected);
                                }}>
                                    {zonas.map(z => (
                                        <option key={z.id} value={z.nombre}>{z.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Status: </label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>

                            <button type="submit">Actualizar</button>
                            <button type="button" onClick={() => { resetForm(); setEditModalOpen(false); }}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            
            )}
        </div>
        </div>
    );
};

export default Ingenieros;

const estilos = {
    inicioContainer: {
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/imagen/cemento.jpg")',
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
    botonAgregar: {
        padding: "6px 12px",
        backgroundColor: "#004171",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "20px",
        fontFamily: 'Klavika, sans-serif',
        fontSize: "14px"
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
    tableCell: {
        padding: '8px',
        border: '1px solid #ccc',
        maxWidth: '200px', 
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
        
        
    },

    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContenido: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        fontFamily: 'Klavika, sans-serif',
    },
    campoFormulario: {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '14px',
    },
    input: {
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        marginTop: '5px',
    },
    select: {
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        marginTop: '5px',
    },
    boton: {
        padding: '10px 15px',
        marginRight: '10px',
        backgroundColor: '#004171',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    botonCerrar: {
        padding: '10px 15px',
        backgroundColor: '#ccc',
        color: '#000',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    }

    

};