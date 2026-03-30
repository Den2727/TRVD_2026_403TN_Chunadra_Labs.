import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let email = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    } catch {}
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">🎓 Education App</span>

      <div className="text-white">
        {email && <span className="me-3">{email}</span>}
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}