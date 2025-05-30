import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import Rutas from '../screens/Rutas';
import VerRutas from '../screens/VerRutas';
import Proyectos from '../screens/Proyectos';
import Reuniones from '../screens/Reuniones';
import ReunionesLista from '../screens/ReunionesLista';
import EditarReunion from '../screens/EditarReunion';



const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Rutas" component={Rutas} options={{ title: "Back" }} />
      <Stack.Screen name="VerRutas" component={VerRutas} options={{ title: "Back" }} />
      <Stack.Screen name="Proyectos" component={Proyectos} options={{ title: "Back" }} />
      <Stack.Screen name="Reuniones" component={Reuniones} options={{ title: "Back" }}/>
      <Stack.Screen name="ReunionesLista" component={ReunionesLista} options={{ title: "Back" }}/>
      <Stack.Screen name="EditarReunion" component={EditarReunion} options={{ title: "Back" }}/>


    </Stack.Navigator>
  );
}
