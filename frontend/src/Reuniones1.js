import React, { useState, useEffect } from "react";

const Reuniones = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [reuniones, setReuniones] = useState([]);
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    contacto: "",
    ubicacion: "",
    descripcion: "",
    usuario_id: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [hoverCancelar, setHoverCancelar] = React.useState(false);
const [hoverGuardar, setHoverGuardar] = React.useState(false);
const [inputFocus, setInputFocus] = React.useState(null);

  useEffect(() => {
    obtenerUsuarios();
    obtenerReuniones();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const obtenerReuniones = async () => {
    try {
      const res = await fetch("http://localhost:5000/reuniones");
      const data = await res.json();
      setReuniones(data);
    } catch (err) {
      console.error("Error cargando reuniones:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const abrirModalNuevo = () => {
    setFormData({
      fecha: "",
      hora: "",
      contacto: "",
      ubicacion: "",
      descripcion: "",
      usuario_id: "",
    });
    setEditandoId(null);
    setModalAbierto(true);
  };

  const handleEditar = (r) => {
    setFormData({
      fecha: r.fecha ? r.fecha.split("T")[0] : "",
      hora: r.hora || "",
      contacto: r.contacto || "",
      ubicacion: r.ubicacion || "",
      descripcion: r.descripcion || "",
      usuario_id: r.usuario_id || "",
    });
    setEditandoId(r.id);
    setModalAbierto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        const res = await fetch(`http://localhost:5000/reuniones/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Error al actualizar la reunión");
        alert("Reunión actualizada exitosamente");
      } else {
        const res = await fetch("http://localhost:5000/reuniones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Error al guardar la reunión");
        alert("Reunión guardada exitosamente");
      }

      setFormData({
        fecha: "",
        hora: "",
        contacto: "",
        ubicacion: "",
        descripcion: "",
        usuario_id: "",
      });
      setEditandoId(null);
      setModalAbierto(false);
      obtenerReuniones();
    } catch (err) {
      console.error("Error guardando reunión:", err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro que quieres eliminar esta reunión?")) return;

    try {
      const res = await fetch(`http://localhost:5000/reuniones/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar la reunión");
      alert("Reunión eliminada exitosamente");
      obtenerReuniones();
    } catch (err) {
      console.error("Error eliminando reunión:", err);
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
          
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <text style={estilos.titulo}></text>
     <text style={estilos.titulo}></text>     
     <text style={estilos.titulo}></text>   
        <button
          style={estilos.botonAgregar} onClick={abrirModalNuevo}
          >
          Agregar Reunión
        </button>
      </div>

      
      <table style={estilos.tabla}>
        <thead style={estilos.tableHeader}>
          <tr >
            <th style={estilos.th}>Fecha</th>
            <th style={estilos.th}>Hora</th>
            <th style={estilos.th}>Contacto</th>
            <th style={estilos.th}>Ubicación</th>
            <th style={estilos.th}>Descripción</th>
            <th style={estilos.th}>Usuario</th>
            <th style={estilos.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reuniones.map((r) => (
            <tr key={r.id} style={estilos.tableRow}>
              <td style={estilos.td}>{r.fecha ? r.fecha.split("T")[0] : r.fecha}</td>
              <td style={estilos.td}>{r.hora}</td>
              <td style={estilos.td}>{r.contacto}</td>
              <td style={estilos.td}>{r.ubicacion}</td>
              <td style={estilos.td}>{r.descripcion}</td>
              <td style={estilos.td}>{r.usuario}</td>
              <td style={estilos.td}>
                <button
                  style={estilos.botonEditar} onClick={() => handleEditar(r)}
                   >
                  Editar
                </button>
                <button style={estilos.botonEditar} onClick={() => handleEliminar(r.id)} >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalAbierto && (
    <div style={estilos.modal}>
      <div style={estilos.modalContenido}>
        <h2 style={estilos.titulo}>
          {editandoId ? "Editar Reunión" : "Registrar Reunión"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            style={{
              ...estilos.input,
              ...(inputFocus === "fecha" ? estilos.inputFocus : {}),
            }}
            onFocus={() => setInputFocus("fecha")}
            onBlur={() => setInputFocus(null)}
            required
          />
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            style={{
              ...estilos.input,
              ...(inputFocus === "hora" ? estilos.inputFocus : {}),
            }}
            onFocus={() => setInputFocus("hora")}
            onBlur={() => setInputFocus(null)}
            required
          />
          <input
            type="text"
            name="contacto"
            value={formData.contacto}
            placeholder="Contacto"
            onChange={handleChange}
            style={{
              ...estilos.input,
              ...(inputFocus === "contacto" ? estilos.inputFocus : {}),
            }}
            onFocus={() => setInputFocus("contacto")}
            onBlur={() => setInputFocus(null)}
            required
          />
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            placeholder="Ubicación"
            onChange={handleChange}
            style={{
              ...estilos.input,
              ...(inputFocus === "ubicacion" ? estilos.inputFocus : {}),
            }}
            onFocus={() => setInputFocus("ubicacion")}
            onBlur={() => setInputFocus(null)}
          />
          <textarea
            name="descripcion"
            value={formData.descripcion}
            placeholder="Descripción"
            onChange={handleChange}
            style={{
              ...estilos.textarea,
              ...(inputFocus === "descripcion" ? estilos.inputFocus : {}),
            }}
            onFocus={() => setInputFocus("descripcion")}
            onBlur={() => setInputFocus(null)}
          />
          <select
            name="usuario_id"
            value={formData.usuario_id}
            onChange={handleChange}
            style={{
              ...estilos.select,
              ...(inputFocus === "usuario_id" ? estilos.inputFocus : {}),
            }}
            onFocus={() => setInputFocus("usuario_id")}
            onBlur={() => setInputFocus(null)}
            required
          >
            <option value="">Seleccione un usuario</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>

          <div style={estilos.botonesContenedor}>
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
              style={hoverCancelar ? {...estilos.botonCancelar, ...estilos.botonCancelarHover} : estilos.botonCancelar}
              onMouseEnter={() => setHoverCancelar(true)}
              onMouseLeave={() => setHoverCancelar(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={hoverGuardar ? {...estilos.botonGuardar, ...estilos.botonGuardarHover} : estilos.botonGuardar}
              onMouseEnter={() => setHoverGuardar(true)}
              onMouseLeave={() => setHoverGuardar(false)}
            >
              {editandoId ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
      )}
    </div>
    </div>
  );
};

export default Reuniones;

const estilos ={
    inicioContainer: {
    minHeight: "100vh",
    backgroundImage:'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/imagen/2C.jpg")',
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
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)", // Overlay oscuro semi-transparente
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContenido: {
    backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "30px 40px",
  maxWidth: "500px",
  width: "90%",
  maxHeight: "80vh",           // 👈 Máxima altura del modal
  overflowY: "auto",           // 👈 Activa scroll vertical si hay mucho contenido
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",

  },
  
  input: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1.8px solid #cbd5e1", // gris claro
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  inputFocus: {
    borderColor: "#3b82f6", // azul vibrante
    boxShadow: "0 0 6px rgba(59,130,246,0.5)",
  },
  textarea: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1.8px solid #cbd5e1",
    fontSize: "1rem",
    minHeight: "80px",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  select: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1.8px solid #cbd5e1",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s ease",
    backgroundColor: "white",
  },
  botonesContenedor: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "20px",
  },
  botonCancelar: {
    backgroundColor: "#004171", // gris claro
    color: "white", // gris oscuro
    border: "none",
    padding: "10px 22px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  botonCancelarHover: {
    backgroundColor: "#cbd5e1",
  },
  botonGuardar: {
    backgroundColor: "#004171", // azul brillante
    color: "white",
    border: "none",
    padding: "10px 22px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  botonGuardarHover: {
    backgroundColor: "#004171",
  },
  menuItem: {
    position: "relative",
    cursor: "pointer",
  },
  tableRow: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transition: 'background-color 0.3s ease',
        color: '#313131',
        
       
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
    th: {
    padding: '8px',
        border: '1px solid #ccc',
        maxWidth: '200px', 
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
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
   tableHeader: {
        backgroundColor: '#004171',
        color: '#fff',
        
        
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
    td: {
    padding: '8px',
        border: '1px solid #ccc',
        maxWidth: '200px', 
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
  }
}
