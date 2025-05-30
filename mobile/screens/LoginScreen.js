import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";

export default function LoginScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!nombre || !password) {
      Alert.alert("Error", "Por favor, ingresa usuario y contraseña");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.147.61:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", `Bienvenido, rol: ${data.rol}`);
        navigation.navigate("Home"); 
        
      } else {
        Alert.alert("Error", data.error || "Error en login");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagen arriba del título */}
      <Image
        source={require("../assets/login.png")} // Ruta relativa a tu imagen
        style={styles.image}
        resizeMode="contain"
      />



      <TextInput
        style={styles.input}
        placeholder="User"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
        <TouchableOpacity
  style={[styles.button, loading && styles.buttonDisabled]}
  onPress={handleLogin}
  disabled={loading}
>
  <Text style={styles.buttonText}>
    {loading ? "Loading..." : "LOG IN"}
  </Text>
</TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
    button: {
  backgroundColor: "#004171",
  paddingVertical: 15,
  paddingHorizontal: 10,
  width: "50%",
  borderRadius: '1px',
  alignItems: "center",
  alignSelf: "center",
  marginTop: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},
buttonDisabled: {
  backgroundColor: "#7ba4d4",
},

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  input: {
    height: 50,
    borderColor: "#717577",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
