const BASE = import.meta.env.VITE_API_URL; // Example: https://user-api-project-final.onrender.com

// Generic request helper
async function req(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // include cookies/session if used
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res.json().catch(() => ({}));
}

// API functions
export function register(data) {
  return req("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return req("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getUser() {
  return req("/user", {
    method: "GET",
  });
}
