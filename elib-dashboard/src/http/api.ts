import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get token from Zustand's persisted store
const getToken = (): string => {
  const tokenStore = localStorage.getItem("token-store");
  if (tokenStore) {
    try {
      const parsed = JSON.parse(tokenStore);
      return parsed.state?.token || "";
    } catch {
      return "";
    }
  }
  return "";
};

export const login = async (data: { email: string; password: string }) => {
  return api.post("/api/users/login", data);
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("api/users/register", data);
};

export const getBooks = async () => api.get("/api/books");

export const deleteBook = async (bookId: string) =>
  api.delete(`/api/books/${bookId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
export const createBook = async (data: FormData) =>
  api.post("/api/books", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
