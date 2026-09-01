const API_BASE = "http://localhost:5000/api";

function saveAuth(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", data.name);
}

function getToken() {
  return localStorage.getItem("token");
}

function getRole() {
  return localStorage.getItem("role");
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

function requireAdmin() {
  requireAuth();
  if (getRole() !== "admin") {
    window.location.href = "events.html";
  }
}

async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (getToken()) {
    headers["Authorization"] = `Bearer ${getToken()}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
