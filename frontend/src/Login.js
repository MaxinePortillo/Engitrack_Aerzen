import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Login = () => {
    const [nombre, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

   

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/login", {
                nombre,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);

                const { rol } = response.data;
                if (rol === "administrador") {
                    navigate("/inicio");
                } else {
                    navigate("/inicio1");
                }
            } else {
                setError("Error");
            }
        } catch (err) {
            setError("User or password incorrects");
        }
    };

    
    return (
        <div style={styles.inicioContainer}>
            <header style={styles.header}>
                <div style={styles.logoContainer}>
                    <img
                        src="/imagen/aerzen.png"
                        alt="Logo AERZEN"
                        style={styles.logoImage}
                    />
                </div>
                
            </header>

            <div style={styles.container}>
                <div style={styles.box}>
                    <h2 style={styles.title}>Welcome</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>User:</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setUsuario(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" style={styles.button}>
                            Sig in
                        </button>
                    </form>
                    {error && <p style={styles.error}>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;

const styles = {
    inicioContainer: {
        minHeight: '100vh',
        backgroundImage: 'url("/imagen/lobulares.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: 'blue',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Klavika, sans-serif',
            
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        height: 'calc(100vh - 64px)',
        textAlign: 'center',
    },
    box: {
        backgroundColor: 'white',
        padding: '30px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '190px',
    },
    title: {
        textAlign: 'center',
        color: 'hsl(0, 0%, 44%)',
        fontFamily: 'Klavika, sans-serif',
        fontSize: '29px',
        fontWeight: 400
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '8px',
        width: '100%',
    },
    header: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 10,
    },
    logoImage: {
        width: '250px',
        height: '100px',
        objectFit: 'contain',
    },
    iconoIdioma: {
        width: '40px',
        height: '13px',
        objectFit: 'contain',
    },
    button: {
        backgroundColor: '#004171',
        color: '#fff',
        padding: '14px',
        cursor: 'pointer',
        fontSize: '16px',
        border: 'none',
        transition: 'background-color 0.3s ease',
        marginLeft: '5px'
    },
    error: {
        color: 'hsl(0, 0%, 30%)',
        marginTop: '12px',
        textAlign: 'center',
    },
    submenu: {
        position: 'absolute',
        top: '30px',
        right: 0,
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        padding: '10px',
        zIndex: 1000,
        minWidth: '160px',
    },
    submenuLink: {
        display: 'block',
        color: '#313131',
        padding: '8px 12px',
        textDecoration: 'none',
        fontSize: '15px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
};
