import React, { createContext, useReducer, useEffect } from "react";
import api from "../api/api.js";

// Initial state
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// Reducer function to handle actions
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, data: action.payload, error: null };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, data: null };
    default:
      return state;
  }
}

// Create the AuthContext
export const AuthContext = createContext(initialState);

// AuthProvider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Optional: Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/user/get-user"); // Backend endpoint to get current user session
        console.log("User data:", response.data.data);
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data.data });
      } catch {
        dispatch({ type: "LOGOUT" });
      }
    };
    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await api.post("/user/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data.data });
      return true;    // <-- Return true on success
    } catch (error) {
      const message = error.response?.data?.data?.message || "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      return false;   // <-- Return false on failure
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.get("/user/logout");
      dispatch({ type: "LOGOUT" });
    } catch {
      // handle error if needed
    }
  };

  return (
    <AuthContext.Provider
      value={{
        data: state.data,
        loading: state.loading,
        error: state.error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
