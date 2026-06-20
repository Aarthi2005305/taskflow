import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

function Profile({ goBack }) {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks`, { headers });
      setTasks(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "done"
  ).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👤 My Profile</h1>
        <button style={styles.backBtn} onClick={goBack}>
          ← Back
        </button>
      </div>

      <div style={styles.profileCard}>
        <div style={styles.avatar}>👤</div>
        <h2 style={styles.name}>TaskFlow User</h2>
        <p style={styles.email}>Logged in successfully ✅</p>
      </div>

      <h3 style={styles.sectionTitle}>📊 Task Statistics</h3>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderTop: "4px solid #4facfe" }}>
          <p style={styles.statNumber}>{totalTasks}</p>
          <p style={styles.statLabel}>Total Tasks</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #f5576c" }}>
          <p style={styles.statNumber}>{pendingTasks}</p>
          <p style={styles.statLabel}>Pending</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #f093fb" }}>
          <p style={styles.statNumber}>{inProgressTasks}</p>
          <p style={styles.statLabel}>In Progress</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #43e97b" }}>
          <p style={styles.statNumber}>{doneTasks}</p>
          <p style={styles.statLabel}>Done</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #f5576c" }}>
          <p style={styles.statNumber}>{overdueTasks}</p>
          <p style={styles.statLabel}>Overdue</p>
        </div>
      </div>

      <h3 style={styles.sectionTitle}>📈 Progress</h3>
      <div style={styles.progressCard}>
        <p style={styles.progressLabel}>
          Completion Rate:{" "}
          <span style={styles.progressValue}>
            {totalTasks > 0
              ? Math.round((doneTasks / totalTasks) * 100)
              : 0}
            %
          </span>
        </p>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${
                totalTasks > 0
                  ? Math.round((doneTasks / totalTasks) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#1a1a2e",
    padding: "20px",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    color: "#e94560",
    margin: 0,
    fontSize: "28px",
  },
  backBtn: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#e94560",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  profileCard: {
    background: "#16213e",
    padding: "30px",
    borderRadius: "16px",
    marginBottom: "20px",
    textAlign: "center",
  },
  avatar: {
    fontSize: "64px",
    marginBottom: "10px",
  },
  name: {
    margin: 0,
    color: "white",
    fontSize: "22px",
  },
  email: {
    margin: 0,
    color: "#888",
    fontSize: "14px",
    marginTop: "8px",
  },
  sectionTitle: {
    color: "white",
    marginBottom: "12px",
  },
  statsGrid: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: "100px",
    background: "#16213e",
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
  },
  statNumber: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "bold",
    color: "#e94560",
  },
  statLabel: {
    margin: 0,
    color: "#888",
    fontSize: "12px",
    marginTop: "4px",
  },
  progressCard: {
    background: "#16213e",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  progressLabel: {
    margin: 0,
    color: "#888",
    marginBottom: "10px",
  },
  progressValue: {
    color: "#e94560",
    fontWeight: "bold",
  },
  progressBar: {
    background: "#0f3460",
    borderRadius: "10px",
    height: "12px",
    overflow: "hidden",
  },
  progressFill: {
    background: "#e94560",
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },
};

export default Profile;