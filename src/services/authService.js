import api from "./api";

export const login = async (data) => {
  const res = await api.post("/Auth/login", data);
  localStorage.setItem("token", res.data.token);
};