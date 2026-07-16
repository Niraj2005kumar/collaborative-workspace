import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      setLoading(true);

      const response = await registerUser(formData);

      if (response.data.success) {
        setSuccessMsg("Registration Successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Collaborative Workspace</h1>

        <h2>Create Account</h2>

        {errorMsg && (
          <div style={{
            backgroundColor: "var(--danger-bg)",
            color: "var(--danger)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center",
            fontWeight: "500",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            backgroundColor: "var(--success-bg)",
            color: "var(--success)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center",
            fontWeight: "500",
            border: "1px solid rgba(16, 185, 129, 0.2)"
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Enter Full Name"
            value={name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;