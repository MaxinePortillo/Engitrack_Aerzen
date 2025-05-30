import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

export default function VerRutas() {
  const [rutas, setRutas] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [cargando, setCargando] = useState(true);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [searchText, setSearchText] = useState('');

  const eliminarRuta = async (id) => {
    Alert.alert(
      'Desea Terminar',
      '¿Estás seguro de terminar o eliminar esta ruta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`http://192.168.147.61:5000/rutas/${id}`, {
                method: 'DELETE',
              });

              if (res.ok) {
                setRutas((prevRutas) => prevRutas.filter((r) => r.id !== id));
              } else {
                alert('Error al eliminar la ruta.');
              }
            } catch (err) {
              console.error('Error al eliminar la ruta:', err);
              alert('Error al eliminar la ruta.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const resRutas = await fetch('http://192.168.147.61:5000/rutas');
        const dataRutas = await resRutas.json();

        const resUsuarios = await fetch('http://192.168.147.61:5000/usuarios');
        const dataUsuarios = await resUsuarios.json();

        const rutasProcesadas = dataRutas.map((ruta) => {
          const puntos = ruta.geometria.coordinates.map(([lng, lat]) => ({
            latitude: lat,
            longitude: lng,
          }));
          return { ...ruta, puntos };
        });

        const usuariosMap = {};
        dataUsuarios.forEach((user) => {
          usuariosMap[user.id] = user.nombre;
        });

        setRutas(rutasProcesadas);
        setUsuarios(usuariosMap);
      } catch (err) {
        console.error('Error al cargar rutas o usuarios:', err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Filtrar rutas según texto de búsqueda (por ejemplo, por nombre de ruta o nombre de usuario)
  const rutasFiltradas = rutas.filter((ruta) => {
    const nombreRuta = ruta.nombre.toLowerCase();
    const nombreUsuario = (usuarios[ruta.usuario_id] || '').toLowerCase();
    const textoBusqueda = searchText.toLowerCase();

    return (
      nombreRuta.includes(textoBusqueda) ||
      nombreUsuario.includes(textoBusqueda)
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.inputBusqueda}
        placeholder="Buscar por ruta o ingeniero..."
        value={searchText}
        onChangeText={setSearchText}
        clearButtonMode="while-editing"
      />
      <ScrollView style={styles.container}>
        {rutasFiltradas.length === 0 ? (
          <Text style={styles.sinResultados}>No se encontraron rutas.</Text>
        ) : (
          rutasFiltradas.map((ruta) => (
            <View key={ruta.id} style={styles.rutaCard}>
              <Text style={styles.nombre}>{ruta.nombre}</Text>
              <Text style={styles.usuario}>
                Enginner: {usuarios[ruta.usuario_id] || 'Unknown'}
              </Text>
              <Text style={styles.fecha}>
                {new Date(ruta.fecha).toLocaleString()}
              </Text>

              {ruta.puntos.length > 0 && (
                <TouchableOpacity
                  onPress={() => setRutaSeleccionada(ruta)}
                  style={styles.botonMapa}
                >
                  <Text style={styles.textoBoton}>Ver mapa</Text>
                </TouchableOpacity>
              )}

              {ruta.puntos.length > 0 && (
                <MapView
                  style={styles.mapa}
                  initialRegion={{
                    latitude: ruta.puntos[0].latitude,
                    longitude: ruta.puntos[0].longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Polyline coordinates={ruta.puntos} strokeWidth={4} strokeColor="blue" />
                </MapView>
              )}

              <TouchableOpacity
                onPress={() => eliminarRuta(ruta.id)}
                style={styles.botonEliminar}
              >
                <Text style={styles.textoBoton}>Terminar Ruta</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal para mostrar el mapa completo */}
      <Modal visible={!!rutaSeleccionada} animationType="slide">
        <View style={{ flex: 1 }}>
          {rutaSeleccionada && (
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: rutaSeleccionada.puntos[0].latitude,
                longitude: rutaSeleccionada.puntos[0].longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Polyline
                coordinates={rutaSeleccionada.puntos}
                strokeWidth={4}
                strokeColor="blue"
              />
            </MapView>
          )}
          <TouchableOpacity
            style={styles.botonCerrar}
            onPress={() => setRutaSeleccionada(null)}
          >
            <Text style={styles.textoCerrar}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  rutaCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  usuario: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
  fecha: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  mapa: {
    height: 200,
    width: '100%',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonMapa: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  botonEliminar: {
    backgroundColor: '#dc3545',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonCerrar: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
  },
  textoCerrar: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputBusqueda: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  sinResultados: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
});
