import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Inicio from "./Inicio";
import Proyectos from "./Proyectos";
import Ingenieros from "./Ingenieros";
import Inicio1 from "./Inicio1";
import Proyectos1 from "./Proyectos1";
import Contactos from "./Contactos";
import Management from "./Management";
import ProtectedRoute from "./ProtectedRoute";
import Contactos1 from "./Contactos1";
import Rutas from "./Rutas";
import Rutas1 from "./Rutas1";
import Reuniones from "./Reuniones";  
import Reuniones1 from "./Reuniones1";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />

        {/*INICIO ADMINISTRADOR */}
        <Route
          path="/Inicio"
          element={
            <ProtectedRoute>
              <Inicio />
            </ProtectedRoute>
          }
        />

        {/*PROYECTOS ADMINISTRADOR*/}
        <Route
          path="/Proyectos"
          element={
            <ProtectedRoute>
              <Proyectos />
            </ProtectedRoute>
          }
        />

        {/*INGENIEROS ADMINISTRADOR*/}
        <Route
          path="/Ingenieros"
          element={
            <ProtectedRoute>
              <Ingenieros />
            </ProtectedRoute>
          }
        />
        {/*RUTAS*/}
        <Route
          path="/Rutas"
          element={
            <ProtectedRoute>
              <Rutas />
            </ProtectedRoute>
          }
        />

        {/*RUTAS*/}
        <Route
          path="/Rutas1"
          element={
            <ProtectedRoute>
              <Rutas1 />
            </ProtectedRoute>
          }
        />

        {/*ROL USUARIO*/}
        <Route
          path="/Inicio1"
          element={
            <ProtectedRoute>
              <Inicio1 />
            </ProtectedRoute>
          }
        />
        {/*Reuniones*/}
        <Route
          path="/Reuniones"
          element={
            <ProtectedRoute>
              <Reuniones />
            </ProtectedRoute>
          }
        />
       
        {/*Reuniones1*/}
        <Route
          path="/Reuniones1"
          element={
            <ProtectedRoute>
              <Reuniones1 />
            </ProtectedRoute>
          }
        />


        {/*ROL USUARIO PROYECTOS */}
        <Route
        path="/Proyectos1"
        element={
          <ProtectedRoute>
          <Proyectos1 />
          </ProtectedRoute>
        }
        />

        {/*Contactos*/}
        <Route
          path="/Contactos"
          element={
            <ProtectedRoute>
              <Contactos />
            </ProtectedRoute>
          }
        />

        {/*Contactos1*/}
        <Route
          path="/Contactos1"
          element={
            <ProtectedRoute>
              <Contactos1 />
            </ProtectedRoute>
          }
        />

        {/*Management*/}
        <Route
          path="/Management"
          element={
            <ProtectedRoute>
              <Management />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
