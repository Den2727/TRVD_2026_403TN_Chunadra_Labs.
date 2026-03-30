import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post("/Auth/register", { email, password });

      toast.success("Registered!");
      navigate("/login");
    } catch {
      toast.error("Register error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>

      <input
        className="form-control mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-success" onClick={register}>
        Register
      </button>

      <p className="mt-3">
        Have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
