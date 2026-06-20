import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      });
      setSuccess("Account created! Please login 🎉");
      setError("");
    } catch (err) {
      setError("Email already registered!");
      setSuccess("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🚀</div>
        <h2 style={styles.title}>Create Account!</h2>
        <p style={styles.subtitle}>Join TaskFlow today</p>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <input
          style={styles.input}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>
        <p style={styles.link}>
          Already have an account?{" "}
          <span style={styles.linkText} onClick={goToLogin}>
            Login here
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
  success: {
    color: "#4facfe",
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

export default Register;