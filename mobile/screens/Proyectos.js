import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';

export default function ProyectosScreen() {
  const [proyectos, setProyectos] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://192.168.147.61:5000/proyectos')
      .then(response => response.json())
      .then(data => {
        setProyectos(data);
        setFilteredProyectos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener proyectos:', error);
        setLoading(false);
      });
  }, []);

  // Función para filtrar proyectos cuando cambie el texto de búsqueda
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = proyectos.filter(item => {
      const searchText = text.toLowerCase();
      return (
        item.name_project.toLowerCase().includes(searchText) ||
        item.zone.toLowerCase().includes(searchText) ||
        item.plant_owner.toLowerCase().includes(searchText) ||
        item.application.toLowerCase().includes(searchText) ||
        item.aerzen_product.toLowerCase().includes(searchText) ||
        item.ingenieroasignado.toLowerCase().includes(searchText) ||
        item.status.toLowerCase().includes(searchText)
      );
    });
    setFilteredProyectos(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name_project}</Text>
      <Text style={styles.label}>Zone:</Text>
      <Text style={styles.value}>{item.zone}</Text>
      <Text style={styles.label}>Plant Owner:</Text>
      <Text style={styles.value}>{item.plant_owner}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{item.application}</Text>
      <Text style={styles.label}>Product Aerzen:</Text>
      <Text style={styles.value}>{item.aerzen_product}</Text>
      <Text style={styles.label}>Assigned Enginner:</Text>
      <Text style={styles.value}>{item.ingenieroasignado}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{item.status}</Text>
      <Text style={styles.label}>Investment (USD):</Text>
      <Text style={styles.value}>${item.inversion_usd}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar proyectos..."
        value={search}
        onChangeText={handleSearch}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#004171" />
      ) : (
        <FlatList
          data={filteredProyectos}
          keyExtractor={item => item.id_project.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#717577',
    borderWidth: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004171',
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  value: {
    marginBottom: 8,
    color: '#555',
  },
});
