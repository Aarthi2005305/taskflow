import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      onLogin();
    } catch (err) {
      setError("Invalid email or password!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>📝</div>
        <h2 style={styles.title}>Welcome Back!</h2>
        <p style={styles.subtitle}>Login to TaskFlow</p>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        <p style={styles.link}>
          Don't have an account?{" "}
          <span style={styles.linkText} onClick={goToRegister}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#1a1a2e",
  },
  card: {
    background: "#16213e",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
  },
  logo: {
    fontSize: "48px",
  },
  title: {
    margin: 0,
    color: "white",
    fontSize: "24px",
    textAlign: "center",
  },
  subtitle: {
    margin: 0,
    color: "#888",
    textAlign: "center",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #0f3460",
    fontSize: "16px",
    outline: "none",
    background: "#0f3460",
    color: "white",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#e94560",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  },
  error: {
    color: "#e94560",
    textAlign: "center",
    margin: 0,
  },
  link: {
    textAlign: "center",
    color: "#888",
    margin: 0,
  },
  linkText: {
    color: "#e94560",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;