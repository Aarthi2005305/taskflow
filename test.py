import requests

BASE_URL = "http://127.0.0.1:8000"

# Login
login_response = requests.post(f"{BASE_URL}/login", json={
    "email": "test@gmail.com",
    "password": "test123"
})
token = login_response.json()["access_token"]
print("✅ Login Success! Token:", token)

# Create Task
headers = {"Authorization": f"Bearer {token}"}
task_response = requests.post(f"{BASE_URL}/tasks",
    json={
        "title": "My first task",
        "description": "Learning FastAPI",
        "status": "pending",
        "due_date": "2026-06-30"
    },
    headers=headers
)
print("✅ Create Task:", task_response.json())

# Get All Tasks
get_response = requests.get(f"{BASE_URL}/tasks", headers=headers)
print("✅ All Tasks:", get_response.json())