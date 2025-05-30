require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });


const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = decoded;
        next();
    });
};

//Login
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await pool.query("SELECT * FROM usuarios");
        res.json(usuarios.rows);
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

// Registrar un nuevo usuario
app.post("/usuarios", async (req, res) => {
    const { nombre, password, rol } = req.body;

    if (!nombre || !password || !rol) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    try {
        // Verificar si el usuario ya existe
        const checkUser = await pool.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: "El nombre de usuario ya existe" });
        }

        // Insertar el nuevo usuario en la base de datos (sin encriptar la contraseña)
        const result = await pool.query(
            "INSERT INTO usuarios (nombre, password, rol) VALUES ($1, $2, $3) RETURNING *",
            [nombre, password, rol]
        );

        // Retornar el nuevo usuario creado
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error registrando el usuario:", error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
});

// Retorna el usuario actualizado
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, password, rol } = req.body;

    try {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, password = $2, rol = $3 WHERE id = $4 RETURNING *',
            [nombre, password, rol, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]); 
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});


// server.js ( rutas) //
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
});





app.delete('/zonas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM zonas WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar zona:', error);
        res.status(500).send('Error al eliminar zona');
    }
});




// LOGIN
app.post("/login", async (req, res) => {
    const { nombre, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
        if (result.rows.length === 0) return res.status(400).json({ error: "Usuario no encontrado" });

        const user = result.rows[0];
        if (user.password !== password) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, rol: user.rol });
    } catch (error) {
        res.status(500).json({ error: "Error en el login", details: error.message });
    }
});

app.get('/ingenieros', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                i.id,
                i.id_usuario,
                u.nombre AS nombre_usuario,
                i.especialidad,
                i.zona,
                i.status
            FROM ingenieros i
            LEFT JOIN usuarios u ON i.id_usuario = u.id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener ingenieros:', error);
        res.status(500).json({ error: 'Error al obtener ingenieros' });
    }
});

  



app.post('/ingenieros', async (req, res) => {
    try {
        const { id_usuario, especialidad, zona, status } = req.body;

        const zonasString = Array.isArray(zona) ? zona.join(',') : zona;

        const result = await pool.query(
            'INSERT INTO ingenieros (id_usuario, especialidad, zona, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_usuario, especialidad, zonasString, status]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al insertar ingeniero:', error.message);
        res.status(500).json({ error: 'Error al insertar ingeniero' });
    }
});

//Contactos
// Obtener plantas (proyectos) para asignar a contactos
app.get('/contactos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.puesto,
        c.nombre_contacto, 
        c.numero_contacto,   -- <- Agregado aquí
        c.planta_id, 
        p.plant_owner AS nombre_planta
      FROM contactos c
      JOIN proyectos p ON c.planta_id = p.id_project
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener contactos:', err);
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
});





app.get('/plant_owners', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT plant_owner FROM proyectos ORDER BY plant_owner');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener plant_owner:', error);
    res.status(500).json({ error: 'Error al obtener plant_owner' });
  }
});

app.get('/plantas', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_project, plant_owner FROM proyectos ORDER BY plant_owner');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener plantas:', error);
    res.status(500).json({ error: 'Error al obtener plantas' });
  }
});



app.post('/contactos', async (req, res) => {
  const { planta_id, puesto, nombre_contacto, numero_contacto } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO contactos (planta_id, puesto, nombre_contacto, numero_contacto) VALUES ($1, $2, $3, $4) RETURNING *',
      [planta_id, puesto, nombre_contacto, numero_contacto]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear contacto:', error);
    res.status(500).json({ error: 'Error al crear contacto' });
  }
});




app.delete('/contactos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM contactos WHERE id = $1', [id]);
    res.json({ message: 'Contacto eliminado' });
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    res.status(500).json({ error: 'Error al eliminar contacto' });
  }
});





// Obtener lista de zonas
app.get('/zonas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM zonas');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener zonas:', error);
        res.status(500).send('Error al obtener zonas');
    }
});

app.post('/zonas', async (req, res) => {
    const { nombre, region } = req.body;
    if (!nombre || !region) {
        return res.status(400).send('El nombre y la región son obligatorios');
    }
    try {
        const result = await pool.query(
            'INSERT INTO zonas (nombre, region) VALUES ($1, $2) RETURNING *',
            [nombre, region]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar zona:', error);
        res.status(500).send('Error al registrar zona');
    }
});
app.put('/zonas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, region } = req.body;
    if (!nombre || !region) {
        return res.status(400).send('El nombre y la región son obligatorios');
    }
    try {
        const result = await pool.query(
            'UPDATE zonas SET nombre = $1, region = $2 WHERE id = $3 RETURNING *',
            [nombre, region, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar zona:', error);
        res.status(500).send('Error al actualizar zona');
    }
});
  

// Actualizar un ingeniero
app.put('/ingenieros/:id', async (req, res) => {
    const { id } = req.params;
    const { id_usuario, especialidad, zona, status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE ingenieros SET
                id_usuario = $1,
                especialidad = $2,
                zona = $3,
                status = $4
            WHERE id = $5
            RETURNING *`,
            [id_usuario, especialidad, zona.join(','), status, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ingeniero no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar ingeniero:', error);
        res.status(500).json({ error: 'Error al actualizar ingeniero' });
    }
});

    

app.get('/proyectos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proyectos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ error: 'Error al obtener proyectos' });
    }
});




app.post('/proyectos', async (req, res) => {
    const { name_project, plant_owner, zone, owner, application, aerzen_product, ingenieroasignado, status, inversion_usd } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO proyectos (
                name_project, 
                plant_owner, 
                zone, 
                owner, 
                application, 
                aerzen_product, 
                ingenieroasignado, 
                status, 
                inversion_usd)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [name_project, plant_owner, zone, owner, application, aerzen_product, ingenieroasignado, status, inversion_usd]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar proyecto:', error);
        res.status(500).json({ error: 'Error al agregar proyecto' });
    }
});



app.put('/proyectos/:id', async (req, res) => {
    const { id } = req.params;
    const { name_project, plant_owner, zone, owner, application, aerzen_product, ingenieroasignado, inversion_usd } = req.body;

    try {
        const result = await pool.query(
            `UPDATE proyectos SET 
                name_project = $1,
                plant_owner = $2,
                zone = $3,
                owner = $4,
                application = $5,
                aerzen_product = $6,
                ingenieroasignado = $7,
                inversion_usd = $8
             WHERE id_project = $9
             RETURNING *`,
            [name_project, plant_owner, zone, owner, application, aerzen_product, ingenieroasignado, inversion_usd, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ error: 'Error al actualizar proyecto' });
    }
});



app.delete('/proyectos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM proyectos WHERE id_project = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        res.json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {   
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ error: 'Error al eliminar proyecto' });
    }
});

app.put('/contactos/:id', async (req, res) => {
  const { id } = req.params;
  const { planta_id, nombre_contacto, numero_contacto } = req.body;
  try {
    const result = await pool.query(
      'UPDATE contactos SET planta_id=$1, nombre_contacto=$2, numero_contacto=$3 WHERE id=$4 RETURNING *',
      [planta_id, nombre_contacto, numero_contacto, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    res.status(500).json({ error: 'Error al actualizar contacto' });
  }
});


app.get('/inversiones-por-zona', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT zone, SUM(inversion_usd) AS total_inversion
            FROM proyectos
            GROUP BY zone
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener inversiones por zona:', error);
        res.status(500).json({ error: 'Error al obtener inversiones por zona' });
    }
});

//Mobile

// LOGIN SIN JWT
app.post("/login-no-jwt", async (req, res) => {
    const { nombre, password } = req.body;
  
    try {
      const result = await pool.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
      if (result.rows.length === 0) return res.status(400).json({ success: false, message: "Usuario no encontrado" });
  
      const user = result.rows[0];
      if (user.password !== password) {
        return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
      }
  
      return res.json({ success: true, rol: user.rol, message: "Inicio de sesión exitoso" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error en el servidor", error: error.message });
    }
  });

  app.put('/proyectos/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE proyectos SET status = $1 WHERE id_project = $2', [status, id]);
    res.status(200).json({ mensaje: 'Status actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el status' });
  }
});

//rutas

// GET /rutas
app.get('/rutas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        rutas.id, 
        rutas.nombre, 
        rutas.fecha, 
        rutas.usuario_id,
        usuarios.nombre AS usuario_nombre,
        ST_AsGeoJSON(rutas.geometria)::json AS geometria
      FROM rutas
      JOIN usuarios ON rutas.usuario_id = usuarios.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    res.status(500).json({ error: 'Error al obtener rutas' });
  }
});





app.post('/rutas', async (req, res) => {
  const { nombre, puntos, usuario_id } = req.body;

  if (!nombre || !puntos || puntos.length < 2 || !usuario_id) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const lineString = `LINESTRING(${puntos.map(p => `${p.longitude} ${p.latitude}`).join(', ')})`;
    const result = await pool.query(
      'INSERT INTO rutas (nombre, geometria, usuario_id) VALUES ($1, ST_GeomFromText($2, 4326), $3)',
      [nombre, lineString, usuario_id]
    );

    res.json({ mensaje: 'Ruta guardada' });
  } catch (error) {
    console.error('Error al guardar ruta:', error);
    res.status(500).json({ error: 'Error al guardar la ruta' });
  }
});

// Endpoint DELETE para eliminar ruta por id
app.delete('/rutas/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Ejecuta DELETE
    const resultado = await pool.query('DELETE FROM rutas WHERE id = $1', [id]);

    if (resultado.rowCount === 0) {
      // No encontró ruta con ese id
      return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }

    // Eliminación exitosa
    res.status(200).json({ mensaje: 'Ruta eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando ruta:', error);
    res.status(500).json({ mensaje: 'Error del servidor al eliminar ruta' });
  }
});



// GET /reuniones
app.get('/reuniones', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.fecha, r.hora, r.contacto, r.ubicacion, r.descripcion,
             u.nombre AS usuario
      FROM reuniones r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.fecha DESC, r.hora DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reuniones:', err);
    res.status(500).json({ error: 'Error al obtener reuniones' });
  }
});



app.post('/reuniones', async (req, res) => {
  const { fecha, hora, contacto, ubicacion, descripcion, usuario_id } = req.body;

  try {
    await pool.query(
      `INSERT INTO reuniones (fecha, hora, contacto, ubicacion, descripcion, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [fecha, hora, contacto, ubicacion, descripcion, usuario_id]
    );
    res.status(201).json({ message: 'Reunión guardada correctamente' });
  } catch (err) {
    console.error('Error al guardar la reunión:', err);
    res.status(500).json({ error: 'Error al guardar la reunión' });
  }
});





app.put('/reuniones/:id', async (req, res) => {
  const id = req.params.id;
  const { fecha, hora, contacto, ubicacion, descripcion, usuario_id } = req.body;
  try {
    // Aquí el código para actualizar en BD la reunión con ese id
    // Ejemplo (PostgreSQL):
    const result = await pool.query(
      'UPDATE reuniones SET fecha=$1, hora=$2, contacto=$3, ubicacion=$4, descripcion=$5, usuario_id=$6 WHERE id=$7',
      [fecha, hora, contacto, ubicacion, descripcion, usuario_id, id]
    );
    res.status(200).json({ message: 'Reunión actualizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando reunión' });
  }
});




app.delete('/reuniones/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const resultado = await pool.query('DELETE FROM reuniones WHERE id = $1', [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Reunión no encontrada' });
    }

    res.status(200).json({ mensaje: 'Reunión eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar reunión:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});







  
  


//INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
