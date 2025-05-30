import React, { useEffect, useState } from 'react';

const Contactos1 = () => {
  const [contactos, setContactos] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [puesto, setPuesto] = useState('');
  const [nombreContacto, setNombreContacto] = useState('');
  const [numeroContacto, setNumeroContacto] = useState('');
  const [plantaId, setPlantaId] = useState('');
  const [editId, setEditId] = useState(null);

  const [errorNumero, setErrorNumero] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  useEffect(() => {
    fetchContactos();
    fetchProyectos();
  }, []);

  const fetchContactos = async () => {
    try {
      const res = await fetch('http://localhost:5000/contactos');
      const data = await res.json();
      setContactos(data);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
    }
  };

  const fetchProyectos = async () => {
    try {
      const res = await fetch('http://localhost:5000/proyectos');
      const data = await res.json();
      setPlantas(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const validarNumero = (n) => /^[0-9\sxX]+$/.test(n);

  const resetForm = () => {
    setPuesto('');
    setNombreContacto('');
    setNumeroContacto('');
    setPlantaId('');
    setEditId(null);
    setErrorNumero('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plantaId || !nombreContacto) {
      alert('Completa todos los campos');
      return;
    }
    if (!validarNumero(numeroContacto)) {
      setErrorNumero('Sólo números, espacios y “x” permitidos.');
      return;
    }
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId
        ? `http://localhost:5000/contactos/${editId}`
        : 'http://localhost:5000/contactos';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planta_id: parseInt(plantaId),
          puesto: puesto,
          nombre_contacto: nombreContacto,
          numero_contacto: numeroContacto,
        }),
      });
      if (!res.ok) throw new Error();
      resetForm();
      setModalOpen(false);
      fetchContactos();
    } catch {
      alert('Error al guardar el contacto');
    }
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setPuesto(c.puesto);
    setNombreContacto(c.nombre_contacto);
    setNumeroContacto(c.numero_contacto);
    setPlantaId(c.planta_id.toString());
    setErrorNumero('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este contacto?')) return;
    try {
      const res = await fetch(`http://localhost:5000/contactos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      fetchContactos();
    } catch {
      alert('Error al eliminar');
    }
  };

  const abrirModal = () => {
    resetForm();
    setModalOpen(true);
  };
  const closeModal = () => {
    resetForm();
    setModalOpen(false);
  };

  const contactosFiltrados = contactos.filter((c) => {
    const t = filtroBusqueda.toLowerCase();
    return (
      c.puesto.toLowerCase().includes(t) ||
      c.nombre_contacto.toLowerCase().includes(t) ||
      c.numero_contacto.toLowerCase().includes(t) ||
      c.nombre_planta.toLowerCase().includes(t)
    );
  });

return (
  <div style={estilos.inicioContainer}>
    {/* Header con logo y menú */}
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

    {/* Botón para abrir modal */}
    <div style={{ padding: '16px' }}>
      <button onClick={abrirModal} style={styles.openBtn}>
        + Nuevo Contacto
      </button>
    </div>

    {/* Modal centrado y de tamaño moderado */}
    {modalOpen && (
      <div style={styles.overlay}>
        <div style={styles.modalBox}>
          <button onClick={closeModal} style={styles.closeBtn}>&times;</button>
          <h2 style={{color:'#313131',}}>{editId ? 'Editar Contacto' : 'Registrar Contacto'}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
          <input 
          type="text" 
          placeholder="Puesto"
          value={puesto} 
          onChange={e => setPuesto(e.target.value)}
          autoFocus
          required
          style={styles.input}
          />
            <input
              type="text"
              placeholder="Nombre del contacto"
              value={nombreContacto}
              onChange={e => setNombreContacto(e.target.value)}
              autoFocus
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Número (ej. 859242266 x456)"
              value={numeroContacto}
              onChange={e => setNumeroContacto(e.target.value)}
              required
              style={styles.input}
            />
            {errorNumero && <p style={styles.error}>{errorNumero}</p>}
            <select
              value={plantaId}
              onChange={e => setPlantaId(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">Selecciona planta</option>
              {plantas.map(p => (
                <option key={p.id_project} value={p.id_project}>
                  {p.plant_owner}
                </option>
              ))}
            </select>
            <div style={styles.actions}>
              <button  style={styles.openBtn} type="submit">{editId ? 'Actualizar' : 'Guardar'}</button>
              <button style={styles.openBtn}  type="button" onClick={closeModal}>Cancelar</button>
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
      ...styles.input,
      maxWidth: '300px',
      width: '100%',
    }}
  />
</div>


    {/* Tabla de contactos */}
    <div style={{ padding: '0 16px' }}>
      <table style={estilos.tabla}>
        <thead style ={estilos.tableHeader}>
          <tr>
            
            <th style={estilos.tableCell}>Puesto</th>
            <th style={estilos.tableCell}>Nombre</th>
            <th style={estilos.tableCell}>Número</th>
            <th style={estilos.tableCell}>Planta</th>
            <th style={estilos.tableCell}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contactosFiltrados.map(c => (
            <tr key={c.id} style={estilos.tableRow}>
              
              <td style={estilos.tableCell}>{c.puesto}</td>
              <td style={estilos.tableCell}>{c.nombre_contacto}</td>
              <td style={estilos.tableCell}>{c.numero_contacto}</td>
              <td style={estilos.tableCell}>{c.nombre_planta}</td>
              <td>
                <button style={estilos.botonEliminar} onClick={() => handleEdit(c)}>Editar</button>{' '}
                <button style={estilos.botonEliminar} onClick={() => handleDelete(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {contactosFiltrados.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No hay resultados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

};

const estilos ={
  inicioContainer: {
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/imagen/productos.jpg")',
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
        backgroundColor: '  rgba(255, 255, 255, 0.8)',
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
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Klavika, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  openBtn: {
    backgroundColor: '#004171',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  filter: {
    margin: '12px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  // overlay reducido
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  closeBtn: {
   position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px'
  },
  input: {
    padding: '10px 14px',
    fontSize: '16px',
    borderRadius: '1px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border 0.3s',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '-10px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
};

export default Contactos1;
