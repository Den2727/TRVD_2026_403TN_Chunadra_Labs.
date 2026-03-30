import api from "./api";

export const getCourses = () => api.get("/Courses");

export const createCourse = (data) =>
  api.post("/Courses", data);