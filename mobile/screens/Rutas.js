import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, Modal, FlatList,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';

export default function Rutas() {
  const [puntos, setPuntos] = useState([]);
  const [nombreRuta, setNombreRuta] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [direccionManual, setDireccionManual] = useState('');
  const [region, setRegion] = useState({
    latitude: 19.4326, // CDMX como punto inicial
    longitude: -99.1332,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [coordenadaDireccion, setCoordenadaDireccion] = useState(null);

  useEffect(() => {
    fetch('http://192.168.147.61:5000/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error cargando usuarios:', err));
  }, []);

  const agregarPunto = (e) => {
    setPuntos([...puntos, e.nativeEvent.coordinate]);
  };

  const buscarDireccion = async () => {
    if (!direccionManual.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionManual)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const nuevaRegion = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(nuevaRegion);
        setCoordenadaDireccion({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      } else {
        Alert.alert('No encontrado', 'No se pudo encontrar la dirección');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar con el servicio de búsqueda');
    }
  };

  const guardarRuta = async () => {
    if (puntos.length < 2 || !nombreRuta.trim() || !usuarioSeleccionado) {
      Alert.alert('Error', 'Selecciona un nombre de ruta y un usuario, y marca al menos 2 puntos');
      return;
    }

    try {
      const response = await fetch('http://192.168.147.61:5000/rutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puntos,
          nombre: nombreRuta,
          usuario_id: usuarioSeleccionado.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', 'Ruta guardada correctamente');
        limpiarRuta();
      } else {
        Alert.alert('Error', data.error || 'No se pudo guardar');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  const limpiarRuta = () => {
    setPuntos([]);
    setNombreRuta('');
    setCoordenadaDireccion(null);
    // Si quieres también limpiar el usuario seleccionado, descomenta la línea siguiente:
    // setUsuarioSeleccionado(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name route"
        style={styles.input}
        value={nombreRuta}
        onChangeText={setNombreRuta}
      />

      <TouchableOpacity style={styles.selectButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.selectButtonText}>
          {usuarioSeleccionado ? usuarioSeleccionado.nombre : 'Select a engineer'}
        </Text>
      </TouchableOpacity>

      <View style={styles.direccionContainer}>
        <TextInput
          placeholder="Address"
          style={styles.direccionInput}
          value={direccionManual}
          onChangeText={setDireccionManual}
        />
        <TouchableOpacity style={styles.botonBuscar} onPress={buscarDireccion}>
          <Text style={styles.botonTexto}>Search</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona un ingeniero</Text>
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setUsuarioSeleccionado(item);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>{item.nombre}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <MapView
        style={styles.mapa}
        region={region}
        onPress={agregarPunto}
      >
        {puntos.map((p, index) => <Marker key={index} coordinate={p} />)}
        {coordenadaDireccion && (
          <Marker
            coordinate={coordenadaDireccion}
            pinColor="green"
            title="Ubicación buscada"
          />
        )}
        <Polyline coordinates={puntos} strokeWidth={4} strokeColor="blue" />
      </MapView>

      <TouchableOpacity style={styles.guardarButton} title="Save Route" onPress={guardarRuta} >
      <Text style={styles.limpiarButtonText}>Save Route</Text>
      
      </TouchableOpacity>
      
        
      <TouchableOpacity style={styles.limpiarButton} onPress={limpiarRuta}>
        <Text style={styles.limpiarButtonText}>Clear Ruote</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 10,
    paddingVertical: 30,
    paddingTop: 10,
    flex: 1 
  },
  mapa: { flex: 1 },
  input: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    
  },
  selectButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  direccionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  direccionInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  botonBuscar: {
    marginLeft: 10,
    backgroundColor: '#004171',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 2,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalText: {
    fontSize: 16,
  },
  guardarButton:{
  
    marginTop: 10,
    paddingVertical: 10,
    width: '50%',
    alignSelf: 'center',
    borderRadius: '1px',
    alignItems: 'center',
    shadowColor: '#717577',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    elevation: 4,
  
    marginLeft: 10,
    backgroundColor: '#004171',
    paddingVertical: 10,
    paddingHorizontal: 15,
   
    
  },
  limpiarButton: {
    
    marginTop: 10,
    paddingVertical: 10,
    width: '50%',
    alignSelf: 'center',
    borderRadius: '1px',
    alignItems: 'center',
    shadowColor: '#717577',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2,
    elevation: 4,

    marginLeft: 10,
    backgroundColor: '#004171',
    paddingVertical: 10,
    paddingHorizontal: 15,
   
  },
  limpiarButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
