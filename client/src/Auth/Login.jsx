import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loading, error } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies in request
        body: JSON.stringify(form),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
  
      const data = await response.json();
      console.log("Logged in successfully:", data);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      // Optionally show error to user here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full space-y-8"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-900">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-center font-medium">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-300 px-5 py-3 pr-20 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-4 top-[38px] text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-300/50 hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
