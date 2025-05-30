import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function ReunionesLista() {
  const [reuniones, setReuniones] = useState([]);
  const [filteredReuniones, setFilteredReuniones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const navigation = useNavigation();

  const fetchReuniones = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://192.168.147.61:5000/reuniones');
      const data = await res.json();
      setReuniones(data);
      setFilteredReuniones(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchReuniones();
    }, [])
  );

  // Filtrar reuniones cuando cambia la búsqueda o reuniones
  useEffect(() => {
    if (busqueda.trim() === '') {
      setFilteredReuniones(reuniones);
    } else {
      const texto = busqueda.toLowerCase();
      const filtradas = reuniones.filter((r) =>
        r.fecha.toLowerCase().includes(texto) ||
        r.contacto.toLowerCase().includes(texto) ||
        r.descripcion.toLowerCase().includes(texto)
      );
      setFilteredReuniones(filtradas);
    }
  }, [busqueda, reuniones]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('EditarReunion', { reunion: item })}
    >
      <Text style={styles.title}>{item.fecha} - {item.hora}</Text>
      <Text style={styles.desc}>{item.contacto}</Text>
      <Text style={styles.desc}>{item.descripcion}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mettings</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar por fecha, contacto o descripción..."
        value={busqueda}
        onChangeText={setBusqueda}
        clearButtonMode="while-editing"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : filteredReuniones.length === 0 ? (
        <Text style={styles.noResults}>No se encontraron reuniones.</Text>
      ) : (
        <FlatList
          data={filteredReuniones}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Elevación para Android
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6, color: '#007bff' },
  desc: { fontSize: 15, color: '#555' },
  noResults: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#888' },
});
