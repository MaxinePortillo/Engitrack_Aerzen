import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Reuniones() {
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [contacto, setContacto] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const validarCampos = () => {
    if (!contacto.trim()) {
      Alert.alert('Campo requerido', 'Por favor, ingresa el contacto.');
      return false;
    }
    if (!ubicacion.trim()) {
      Alert.alert('Campo requerido', 'Por favor, ingresa la ubicación.');
      return false;
    }
    if (!descripcion.trim()) {
      Alert.alert('Campo requerido', 'Por favor, ingresa la descripción.');
      return false;
    }
    return true;
  };

  const guardarReunion = async () => {
    if (!validarCampos()) return;

    try {
      const response = await fetch('http://192.168.147.61:5000/reuniones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: fecha.toISOString().split('T')[0], // yyyy-mm-dd
          hora: hora.toTimeString().split(' ')[0],  // hh:mm:ss
          contacto,
          ubicacion,
          descripcion
        })
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', data.mensaje);
        setFecha(new Date());
        setHora(new Date());
        setContacto('');
        setUbicacion('');
        setDescripcion('');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error de red', error.message);
    }
  };

  return (
    
    
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Meeting</Text>

      <TouchableOpacity
        onPress={() => setMostrarFecha(true)}
        style={styles.datePicker}
        activeOpacity={0.7}
      >
        <Text style={styles.dateText}>{fecha.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {mostrarFecha && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setMostrarFecha(Platform.OS === 'ios');
            if (selectedDate) setFecha(selectedDate);
          }}
          style={styles.picker}
        />
      )}

      <TouchableOpacity onPress={() => setMostrarHora(true)} style={styles.datePicker}>
  <Text style={styles.dateText}>
    {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
  </Text>
</TouchableOpacity>

      {mostrarHora && (
        <DateTimePicker
          value={hora}
          mode="time"
          display="spinner"
          is24Hour={true}
          onChange={(event, selectedTime) => {
            setMostrarHora(Platform.OS === 'ios');
            if (selectedTime) setHora(selectedTime);
          }}
          style={styles.picker}
        />
      )}

      <TextInput
        placeholder="Contacto *"
        value={contacto}
        onChangeText={setContacto}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Ubicación *"
        value={ubicacion}
        onChangeText={setUbicacion}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Descripción *"
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, styles.textArea]}
        multiline
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={guardarReunion} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#004171',
    marginBottom: 25,
    textAlign: 'center',
  },
  datePicker: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#717577',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    color: '#003366',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#717577',
    color: '#003366',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#004171',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#e6f0ff',
    fontSize: 18,
    fontWeight: '700',
  },
});
