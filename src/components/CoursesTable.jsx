import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export default function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);

  // Завантаження курсів
  const loadCourses = async () => {
    try {
      const res = await api.get("/Courses");
      setCourses(res.data);
    } catch {
      toast.error("Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Створення або редагування
  const saveCourse = async () => {
    try {
      if (!title || !description) {
        toast.error("Fill all fields");
        return;
      }

      if (editId) {
        await api.put(`/Courses/${editId}`, {
          title,
          description,
        });
        toast.success("Course updated");
      } else {
        await api.post("/Courses", {
          title,
          description,
        });
        toast.success("Course created");
      }

      setTitle("");
      setDescription("");
      setEditId(null);

      loadCourses();
    } catch {
      toast.error("Save error");
    }
  };

  
  const deleteCourse = async (id) => {
    if (!confirm("Ви впевнені?")) return;

    try {
      await api.delete(`/Courses/${id}`);
      toast.success("Deleted");
      loadCourses();
    } catch {
      toast.error("Delete error");
    }
  };

  //Редагування
  const editCourse = (course) => {
    setTitle(course.title);
    setDescription(course.description);
    setEditId(course.id);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Courses CRM</h2>

      {/* ➕ Форма */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row">
          <div className="col">
            <input
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col">
            <input
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-auto">
            <button className="btn btn-success" onClick={saveCourse}>
              {editId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>

      {/*Таблиця*/}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((c, index) => (
                <tr key={c.id}>
                  <td>{index + 1}</td>
                  <td>{c.title}</td>
                  <td>{c.description}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editCourse(c)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteCourse(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No courses
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}