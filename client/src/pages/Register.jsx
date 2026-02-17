import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";

const Register = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/api/auth/register", {
        email,
        password,
      });

      login(data); // saves token + user
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center">Create Account</h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* PASSWORD */}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg 
          font-semibold hover:bg-blue-700 transition
          disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-center text-black">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
