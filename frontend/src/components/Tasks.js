import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

function Tasks({ onLogout, goToProfile }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

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
      setError("Failed to fetch tasks!");
    }
  };

  const handleAddTask = async () => {
    if (!title) return;
    try {
      await axios.post(
        `${BASE_URL}/tasks`,
        {
          title,
          description,
          status: "pending",
          due_date: dueDate || null,
        },
        { headers }
      );
      setTitle("");
      setDescription("");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      setError("Failed to add task!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task!");
    }
  };

  const handleStatus = async (task) => {
    const newStatus =
      task.status === "pending"
        ? "in_progress"
        : task.status === "in_progress"
        ? "done"
        : "pending";
    try {
      await axios.put(
        `${BASE_URL}/tasks/${task.id}`,
        { ...task, status: newStatus },
        { headers }
      );
      fetchTasks();
    } catch (err) {
      setError("Failed to update task!");
    }
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "#f5576c";
    if (status === "in_progress") return "#f093fb";
    if (status === "done") return "#4facfe";
    return "#888";
  };

  const isOverdue = (due_date) => {
    if (!due_date) return false;
    return new Date(due_date) < new Date();
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;
      return task.status === filter;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📝 TaskFlow</h1>
        <div style={styles.headerButtons}>
          <button style={styles.profileBtn} onClick={goToProfile}>
            👤 Profile
          </button>
          <button style={styles.logoutBtn} onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Add Task */}
      <div style={styles.addCard}>
        <h3 style={styles.addTitle}>➕ Add New Task</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          style={styles.input}
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button style={styles.addBtn} onClick={handleAddTask}>
          + Add Task
        </button>
      </div>

      {/* Search and Filter */}
      <div style={styles.searchBar}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={styles.select}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Task Stats */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>
            {tasks.filter((t) => t.status === "pending").length}
          </p>
          <p style={styles.statLabel}>Pending</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>
            {tasks.filter((t) => t.status === "in_progress").length}
          </p>
          <p style={styles.statLabel}>In Progress</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>
            {tasks.filter((t) => t.status === "done").length}
          </p>
          <p style={styles.statLabel}>Done</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{tasks.length}</p>
          <p style={styles.statLabel}>Total</p>
        </div>
      </div>

      {/* Task List */}
      <div style={styles.taskList}>
        {filteredTasks.length === 0 && (
          <p style={styles.noTask}>No tasks found! 😊</p>
        )}
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              ...styles.taskCard,
              borderLeft: `4px solid ${getStatusColor(task.status)}`,
              ...(isOverdue(task.due_date) && task.status !== "done"
                ? styles.overdueCard
                : {}),
            }}
          >
            <div style={styles.taskInfo}>
              <h3 style={styles.taskTitle}>{task.title}</h3>
              {task.description && (
                <p style={styles.taskDesc}>{task.description}</p>
              )}
              {task.due_date && (
                <p
                  style={{
                    ...styles.taskDate,
                    color: isOverdue(task.due_date) && task.status !== "done"
                      ? "#f5576c"
                      : "#888",
                  }}
                >
                  📅 {task.due_date}
                  {isOverdue(task.due_date) && task.status !== "done" && (
                    <span style={styles.overdueBadge}> ⚠️ Overdue!</span>
                  )}
                </p>
              )}
              <span
                style={{
                  ...styles.statusBadge,
                  background: getStatusColor(task.status),
                }}
              >
                {task.status}
              </span>
            </div>
            <div style={styles.taskActions}>
              <button
                style={styles.statusBtn}
                onClick={() => handleStatus(task)}
                title="Change status"
              >
                🔄
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(task.id)}
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
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
  headerButtons: {
    display: "flex",
    gap: "10px",
  },
  profileBtn: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#16213e",
    color: "#e94560",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#e94560",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  addCard: {
    background: "#16213e",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  addTitle: {
    margin: 0,
    color: "white",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #0f3460",
    fontSize: "16px",
    outline: "none",
    background: "#0f3460",
    color: "white",
  },
  addBtn: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#e94560",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  searchBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  searchInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #0f3460",
    fontSize: "16px",
    outline: "none",
    background: "#16213e",
    color: "white",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #0f3460",
    fontSize: "16px",
    outline: "none",
    background: "#16213e",
    color: "white",
    cursor: "pointer",
  },
  stats: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  statCard: {
    flex: 1,
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
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskCard: {
    background: "#16213e",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overdueCard: {
    background: "#1a0a0a",
  },
  taskInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  taskTitle: {
    margin: 0,
    color: "white",
    fontSize: "18px",
  },
  taskDesc: {
    margin: 0,
    color: "#888",
    fontSize: "14px",
  },
  taskDate: {
    margin: 0,
    fontSize: "12px",
  },
  overdueBadge: {
    color: "#f5576c",
    fontWeight: "bold",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    width: "fit-content",
  },
  taskActions: {
    display: "flex",
    gap: "8px",
  },
  statusBtn: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#0f3460",
    cursor: "pointer",
    fontSize: "18px",
  },
  deleteBtn: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#2a0a0a",
    cursor: "pointer",
    fontSize: "18px",
  },
  noTask: {
    color: "#888",
    textAlign: "center",
    fontSize: "18px",
  },
  error: {
    color: "#f5576c",
    margin: 0,
  },
};

export default Tasks;