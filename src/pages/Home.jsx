import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import CoursesTable from "../components/CoursesTable";


export default function Home() {
   return <CoursesTable />;
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/Courses");
      setCourses(res.data);
    } catch {
      toast.error("Load error");
    }
  };

  const add = async () => {
    try {
      await api.post("/Courses", {
        title,
        description: "From React"
      });

      setTitle("");
      load();
      toast.success("Added");
    } catch {
      toast.error("Add error");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/Courses/${id}`);
      load();
      toast.success("Deleted");
    } catch {
      toast.error("Delete error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Courses</h2>

      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary" onClick={add}>
          Add
        </button>
      </div>

      {courses.map((c) => (
        <div key={c.id} className="card p-2 mb-2">
          <b>{c.title}</b>
          <p>{c.description}</p>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => remove(c.id)}
          >
            Delete
          </button>
        </div>
      ))}

      <button
        className="btn btn-secondary mt-3"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}