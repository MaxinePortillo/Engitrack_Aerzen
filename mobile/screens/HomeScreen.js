import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Aquí puedes limpiar datos del usuario si es necesario
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ImageBackground
      source={require('../assets/lob.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>

        {/* Encabezado con botón de cerrar sesión */}
        <View style={styles.header}>
          
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Welcome!</Text>

        <View style={styles.buttonContainer}>
          <Text style={styles.title1}></Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Rutas')} activeOpacity={0.7}>
            
            <Text style={styles.buttonText}>Routes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reuniones')} activeOpacity={0.7}>
           
            <Text style={styles.buttonText}>Meeting</Text>
          </TouchableOpacity>

<Text style={styles.title1}></Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Proyectos')} activeOpacity={0.7}>
           
            <Text style={styles.buttonText}>View Projects</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VerRutas')} activeOpacity={0.7}>
          
            <Text style={styles.buttonText}>View Saved Routes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ReunionesLista')} activeOpacity={0.7}>
            
            <Text style={styles.buttonText}>View Mettings</Text>
          </TouchableOpacity>

          

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#d9534f',
    borderRadius: 6,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 30,
    textAlign: 'center',
  },
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004171',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
