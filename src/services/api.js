const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const getToken = () => localStorage.getItem("bulldogs_token");

export async function request(path, options = {}) {
  const headers = { Accept: "application/json", ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Cannot reach the server. Check that it is running and that VITE_API_URL is correct.", 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || data.error || "The request could not be completed.", response.status, data.errors);
  }
  return data.data ?? data;
}

export const api = {
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (details) => request("/auth/register", { method: "POST", body: JSON.stringify(details) }),
  me: () => request("/auth/me"),
  updateProfile: (details) => request("/auth/me", { method: "PATCH", body: JSON.stringify(details) }),
  changePassword: (details) => request("/auth/change-password", { method: "PATCH", body: JSON.stringify(details) }),
  products: (query = "") => request(`/products${query ? `?${query}` : ""}`),
  product: (id) => request(`/products/${id}`),
  createProduct: (details) => request("/products", { method: "POST", body: details instanceof FormData ? details : JSON.stringify(details) }),
  updateProduct: (id, details) => request(`/products/${id}`, { method: "PATCH", body: details instanceof FormData ? details : JSON.stringify(details) }),
  orders: () => request("/orders"),
  createOrder: (details) => request("/orders", { method: "POST", body: JSON.stringify(details) }),
  updateOrder: (id, details) => request(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(details) }),
  reviews: (productId) => request(`/products/${productId}/reviews`),
  allReviews: () => request("/reviews"),
  createReview: (productId, details) => request(`/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(details) }),
  updateReview: (id, details) => request(`/reviews/${id}`, { method: "PATCH", body: JSON.stringify(details) }),
  users: () => request("/users"),
  updateUser: (id, details) => request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(details) }),
};

export { API_URL };

export const resolveImageUrl = (image) =>
  image?.startsWith("/api/uploads/") || image?.startsWith("/uploads/")
    ? `${API_URL.replace(/\/api$/, "")}${image}`
    : image;
