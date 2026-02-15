import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });
    login(data);
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-w-100vw min-h-[80vh]">
      <form className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md space-y-5">
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
        />

        <input
          type="password"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
