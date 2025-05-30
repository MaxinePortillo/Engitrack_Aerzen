import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Management = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('usuario');
    const [usuarios, setUsuarios] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [mostrarSubmenu, setMostrarSubmenu] = useState(false);
    const [zonaNombre, setZonaNombre] = useState('');
    const [zonas, setZonas] = useState([]);
    const [editingZona, setEditingZona] = useState(null);
    const [showZonaModal, setShowZonaModal] = useState(false);
    const [activeTab, setActiveTab] = useState('usuarios');
    const [filteredZonas, setFilteredZonas] = useState([]);
    const [regionSeleccionada, setRegionSeleccionada] = useState('');
    const [zonaToDelete, setZonaToDelete] = useState(null);
    const [zonaRegion, setZonaRegion] = useState('');

    



    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsuarios();
        fetchZonas();
    }, []);
    

    const fetchZonas = async () => {
        try {
          const response = await axios.get('http://localhost:5000/zonas');
          console.log(response.data);
          setZonas(response.data);
      
          // Asegurarte que filteredZonas se actualiza con base en la región seleccionada
          if (regionSeleccionada === "") {
            setFilteredZonas(response.data);
          } else {
            setFilteredZonas(response.data.filter(z => z.region === regionSeleccionada));
          }
        } catch (error) {
          console.error('Error al obtener zonas:', error);
        }
      };
      
      
        

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };
    

    const handleRegionChange = (e) => {
        const region = e.target.value;
        setRegionSeleccionada(region);
    
        let zonasFiltradas;
        if (region === "") {
            zonasFiltradas = zonas;
        } else {
            zonasFiltradas = zonas.filter(z => z.region === region);
        }
    
        setFilteredZonas(zonasFiltradas);
    };
    
      const handleZonaSubmit = async () => {
        try {
            if (editingZona) {
                // Actualiza una zona existente
                await axios.put(`http://localhost:5000/zonas/${editingZona.id}`, {
                    nombre: zonaNombre,
                    region: zonaRegion,
                });
            } else {
                // Agrega una nueva zona
                await axios.post('http://localhost:5000/zonas', {
                    nombre: zonaNombre,
                    region: zonaRegion,
                });
            }
          // Recarga las zonas y limpia el formulario
        fetchZonas();
        setZonaNombre('');
        setZonaRegion('');
        setEditingZona(null);
        setShowZonaModal(false);
    } catch (error) {
        console.error('Error guardando zona:', error);
    }
};
      
      

const handleZonaEdit = (zona) => {
    setEditingZona(zona);
    setZonaNombre(zona.nombre);
    setZonaRegion(zona.region); // Cargar la región actual
    setShowZonaModal(true);
};
      
      

      const handleZonaDelete = (zona) => {
        setZonaToDelete(zona);
        setShowDeleteModal(true);
      };
      
      const confirmZonaDelete = async () => {
        try {
          await axios.delete(`http://localhost:5000/zonas/${zonaToDelete.id}`);
          const nuevasZonas = zonas.filter(z => z.id !== zonaToDelete.id);
          setZonas(nuevasZonas);
          setFilteredZonas(regionSeleccionada ? nuevasZonas.filter(z => z.region === regionSeleccionada) : nuevasZonas);
          setShowDeleteModal(false);
          setZonaToDelete(null);
        } catch (error) {
          console.error('Error eliminando zona:', error);
        }
      };
      
      const cancelZonaDelete = () => {
        setShowDeleteModal(false);
        setZonaToDelete(null);
      };

      
      
   
      
      

    // Registrar o actualizar usuario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingUser) {
            try {
                const response = await axios.put(`http://localhost:5000/usuarios/${editingUser.id}`, {
                    nombre, password, rol
                });
                setUsuarios(usuarios.map(user => user.id === editingUser.id ? response.data : user));
                setEditingUser(null);
                setIsEdit(false);
            } catch (error) {
                console.error('Error actualizando usuario:', error);
            }
        } else {
            try {
                const response = await axios.post('http://localhost:5000/usuarios', { nombre, password, rol });
                setUsuarios([...usuarios, response.data]);
            } catch (error) {
                console.error('Error registrando usuario:', error);
            }
        }

        
        
        
        

        // Limpiar formulario
        setNombre('');
        setPassword('');
        setRol('usuario');
        setShowModal(false);
    };



    // Cargar datos para editar usuario
    const handleEdit = (usuario) => {
        setNombre(usuario.nombre);
        setPassword(usuario.password);
        setRol(usuario.rol);
        setEditingUser(usuario);
        setIsEdit(true);
        setShowModal(true);
    };

    // Eliminar usuario con confirmación
    const handleDelete = (usuario) => {
        setUserToDelete(usuario);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación de usuario
   const confirmDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/usuarios/${id}`);
        setUsuarios(usuarios.filter(user => user.id !== id));
        setShowDeleteModal(false);
    } catch (error) {
        console.error('Error eliminando usuario:', error);
    }
};


    // Cancelar eliminación
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    return (
       
            <div style={estilos.inicioContainer}>
                <header style={estilos.header}>
                    <div style={estilos.logoContainer}>
                        <img src="/imagen/aerzen.png" alt="Logo AERZEN" style={estilos.logoImage} />
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
               


<div style={estilos.mainContent}>
    

    {/* Pestañas de navegación */}
    <div style={{ display: 'flex', gap: '10px', padding: '20px' }}>
        <button 
            onClick={() => setActiveTab('usuarios')} 
            style={activeTab === 'usuarios' ? estilos.botonActivo : estilos.botonTab}
        >
            Usuarios
        </button>
        <button 
            onClick={() => setActiveTab('zonas')} 
            style={activeTab === 'zonas' ? estilos.botonActivo : estilos.botonTab}
        >
            Zonas
        </button>
    </div>

    {/* Sección Usuarios */}
    {activeTab === 'usuarios' && (
        <div style={{ padding: "20px" }}>
            <button onClick={() => setShowModal(true)} style={estilos.botonAgregar}>
                {isEdit ? "Modificar Usuario" : "Agregar Usuario"}
            </button>

            {showModal && (
                <div style={estilos.modal}>
                    <form onSubmit={handleSubmit} style={estilos.form}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            style={estilos.input}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={estilos.input}
                        />
                        <select value={rol} onChange={(e) => setRol(e.target.value)} style={estilos.input}>
                            <option value="usuario">Usuario</option>
                            <option value="administrador">Administrador</option>
                        </select>
                        <button type="submit" style={estilos.button}>
                            {isEdit ? "Actualizar Usuario" : "Registrar Usuario"}
                        </button>
                        <button type="button" onClick={() => setShowModal(false)} style={estilos.button}>Cerrar</button>
                    </form>
                </div>
            )}

            <table style={estilos.table}>
                <thead style={estilos.tableHeader}>
                    <tr>
                        <th style={estilos.tableCell}>Nombre</th>
                        <th style={estilos.tableCell}>Rol</th>
                        <th style={estilos.tableCell}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id} style={estilos.tableRow}>
                            <td style={estilos.tableCell}>{usuario.nombre}</td>
                            <td style={estilos.tableCell}>{usuario.rol}</td>
                            <td>
                                <button onClick={() => handleEdit(usuario)} style={estilos.botonEditar}>Edit</button>
                                <button onClick={() => confirmDelete(usuario.id)} style={estilos.botonEliminar}>Eliminar</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}


{activeTab === 'zonas' && (
  <div style={{ padding: "20px" }}>
    
    {/* Botón de agregar zona */}
    <button onClick={() => setShowZonaModal(true)} style={estilos.botonAgregar}>
      Agregar Zona
    </button>

    {showZonaModal && (
      <div style={estilos.modal}>
        <h2>{editingZona ? "Editar Zona" : "Registrar Zona"}</h2>
        <input
          type="text"
          placeholder="Nombre de la zona"
          value={zonaNombre}
          onChange={(e) => setZonaNombre(e.target.value)}
          style={estilos.input}
        />
        <select
          value={zonaRegion}
          onChange={(e) => setZonaRegion(e.target.value)}
          style={estilos.input}
        >
          <option value="">Selecciona una región</option>
          <option value="Centro">Centro</option>
          <option value="Bajio">Bajío</option>
          <option value="Norte">Norte</option>
          <option value="Sureste">Sureste</option>
        </select>

        <div style={estilos.modalButtons}>
          <button onClick={handleZonaSubmit} style={estilos.botonGuardar}>
            {editingZona ? "Actualizar" : "Guardar"}
          </button>
          <button onClick={() => setShowZonaModal(false)} style={estilos.botonCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    )}

    {/* Filtro por región */}
    <select
      value={regionSeleccionada}
      onChange={handleRegionChange}
      style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }}
    >
      <option value="">See all</option>
      <option value="Centro">Centro</option>
      <option value="Bajio">Bajio</option>
      <option value="Norte">Norte</option>
      <option value="Sureste">Sureste</option>
    </select>

    {/* Tabla de Zonas */}
    <table style={estilos.table}>
      <thead style={estilos.tableHeader}>
        <tr>
          <th style={estilos.tableCell}>Nombre</th>
          <th style={estilos.tableCell}>Región</th>
          <th style={estilos.tableCell}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filteredZonas.map((zona) => (
          <tr key={zona.id} style={estilos.tableRow}>
            <td style={estilos.tableCell}>{zona.nombre}</td>
            <td style={estilos.tableCell}>{zona.region}</td>
            <td>
              <button onClick={() => handleZonaEdit(zona)} style={estilos.botonEditar}>Editar</button>
              <button onClick={() => handleZonaDelete(zona)} style={estilos.botonEliminar}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
          
    {/* Modal de confirmación para eliminar */}
    {showDeleteModal && zonaToDelete && (
      <div style={estilos.deleteModal}>
        <h3>¿Seguro que quieres eliminar la zona "{zonaToDelete.nombre}"?</h3>
        <button onClick={confirmZonaDelete} style={estilos.deleteButton}>Eliminar</button>
        <button onClick={cancelZonaDelete} style={estilos.button}>Cancelar</button>
      </div>
    )}
  </div>
)}

          

    {/* Modal de confirmación para eliminar */}
    {showDeleteModal && zonaToDelete && (
  <div style={estilos.deleteModal}>
    <h3>¿Seguro que quieres eliminar la zona "{zonaToDelete.nombre}"?</h3>
    <button onClick={confirmZonaDelete} style={estilos.deleteButton}>Eliminar</button>
    <button onClick={cancelZonaDelete} style={estilos.button}>Cancelar</button>
  </div>
)}

</div>
</div>
          
        )
    };        

const estilos = {
    inicioContainer: {
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/imagen/engine.jpg")',
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
    //Cuadro de management
    container: {
        padding: '20px',
        backgroundColor: 'white',
        width: '80%',
        maxWidth: '800px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
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
    title: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        width: '250px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: "12px 20px",
    backgroundColor: "#004171   ",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
    transition: "background-color 0.3s ease",
    },
    subtitle: {
        fontSize: '20px',
        marginBottom: '10px',
    },
    table: {
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
    
    botonEditar: {
        padding: "5px 10px",
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
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    deleteModal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: '1000',
    },

    botonTab: {
        padding: '10px 20px',
        background: '#ddd',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    
    botonActivo: {
        padding: '10px 20px',
        background: '#004171 ',
        color: '#fff',
        border: '#004171 ',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    
};

export default Management;
