import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditarReunion({ route, navigation }) {
  const { reunion } = route.params;
  const [fecha, setFecha] = useState(new Date(reunion.fecha));
  const [hora, setHora] = useState(new Date(`1970-01-01T${reunion.hora}`));
  const [contacto, setContacto] = useState(reunion.contacto);
  const [ubicacion, setUbicacion] = useState(reunion.ubicacion);
  const [descripcion, setDescripcion] = useState(reunion.descripcion);

  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const actualizarReunion = async () => {
    try {
      const response = await fetch(`http://192.168.147.61:5000/reuniones/${reunion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: fecha.toISOString().split('T')[0],
          hora: hora.toTimeString().split(' ')[0],
          contacto,
          ubicacion,
          descripcion,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('¡Éxito!', data.mensaje, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error de red', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Reunión</Text>

        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          onPress={() => setMostrarFecha(true)}
          style={styles.dateInput}
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
          />
        )}

        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity
          onPress={() => setMostrarHora(true)}
          style={styles.dateInput}
          activeOpacity={0.7}
        >
          <Text style={styles.dateText}>
            {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          />
        )}

        <Text style={styles.label}>Contacto</Text>
        <TextInput
          value={contacto}
          onChangeText={setContacto}
          style={styles.input}
          placeholder="Nombre del contacto"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          value={ubicacion}
          onChangeText={setUbicacion}
          style={styles.input}
          placeholder="Lugar de la reunión"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Detalles adicionales"
          placeholderTextColor="#999"
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={actualizarReunion} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Actualizar Reunión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingBottom: 40,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#004a99',
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#33475b',
    fontSize: 16,
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccd6dd',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#1a202c',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccd6dd',
    marginBottom: 20,
    color: '#1a202c',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
