import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { loading } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
  
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // to send cookies if needed
        body: JSON.stringify(form),
      });
  
      if (!response.ok) {
        // backend returned error status
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Try again.");
        return;
      }
  
      const data = await response.json();
      setSuccessMessage(data.message || "Registration successful! Please login.");
      setForm({ name: "", email: "", password: "" });
      navigate("/")
  
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full space-y-8"
      >
        <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-wide mb-6">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-center font-medium">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded text-center font-medium">
            {successMessage}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="John Doe"
            className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="john@example.com"
            className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
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
          className="w-full py-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-300/50 transition font-bold text-lg disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
