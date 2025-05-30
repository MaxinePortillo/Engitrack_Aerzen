import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    console.log("Token recibido en ProtectedRoute:", token);

    if (!token) {
        console.log("No hay token, redirigiendo al login");
        return <Navigate to="/" />;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar token
        console.log("Payload decodificado:", payload);

        const isExpired = payload.exp * 1000 < Date.now();
        console.log("¿Token expirado?:", isExpired);

        if (isExpired) {
            console.log("Token expirado, eliminando y redirigiendo al login");
            localStorage.removeItem("token");
            return <Navigate to="/" />;
        }

        console.log("Token válido, permitiendo acceso");
        return children;
    } catch (error) {
        console.error("Error decodificando el token:", error);
        localStorage.removeItem("token");
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;