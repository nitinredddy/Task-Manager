import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext.jsx";
import api from "../api/api.js";

export default function Home() {
  const { data, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/task/get-all-tasks");
        setTasks(response.data.data || []); // Safe fallback empty array
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = async () => {
    try {
      await api.get(`/user/logout`);
      logout();
      navigate("/login");
    } catch {
      alert("Logout failed, please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/task/delete/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch {
      alert("Failed to delete task.");
    }
  };

  const handleComplete = async (taskId) => {
    try {
      // Delete task permanently after completion
      await api.delete(`/task/delete/${taskId}`);

      // Remove task from state to update UI
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch {
      alert("Failed to complete and delete task");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "to-do":
      case "to_do":
      case "todo":
        return (
          <span className="text-xs bg-gray-300 text-gray-800 px-2 py-0.5 rounded-full">
            To-Do
          </span>
        );
      case "in-progress":
      case "in_progress":
        return (
          <span className="text-xs bg-blue-300 text-blue-800 px-2 py-0.5 rounded-full">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="text-xs bg-green-300 text-green-800 px-2 py-0.5 rounded-full">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const filteredTasks = tasks
    .filter((task) => (filterStatus ? task.status === filterStatus : true))
    .sort((a, b) => {
      if (!sortBy) return 0;

      if (sortBy.includes("duedate")) {
        const dateA = a.duedate ? new Date(a.duedate) : new Date(0);
        const dateB = b.duedate ? new Date(b.duedate) : new Date(0);
        return sortBy === "duedate-asc"
          ? dateA - dateB
          : dateB - dateA;
      }

      if (sortBy.includes("priority")) {
        const order = { low: 1, medium: 2, high: 3 };
        return sortBy === "priority-asc"
          ? order[a.priority] - order[b.priority]
          : order[b.priority] - order[a.priority];
      }

      return 0;
    });

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6 pb-12 flex flex-col items-center">

      {/* Logout button top right */}
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Welcome and create button */}
      <div className="flex flex-col items-center w-full mb-12">
        <h1 className="text-4xl font-bold text-indigo-600 text-center mb-6">
          Welcome, {data?.name || "User"}!
        </h1>
        <button
          onClick={() => navigate("/tasks/create")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          + Create New Task
        </button>
      </div>

      {/* Sorting and filtering controls */}
      <div className="flex space-x-4 mb-6 w-full max-w-4xl mx-auto px-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-2 flex-grow"
        >
          <option value="">All Statuses</option>
          <option value="to-do">To-Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-2 flex-grow"
        >
          <option value="">Sort By</option>
          <option value="duedate-asc">Due Date ↑</option>
          <option value="duedate-desc">Due Date ↓</option>
          <option value="priority-asc">Priority ↑</option>
          <option value="priority-desc">Priority ↓</option>
        </select>
      </div>

      {/* Task list or placeholders */}
      {loading ? (
        <div className="text-center text-gray-500">Loading your tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center text-gray-400">
          No pending tasks. Enjoy your free time!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 w-full">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="border rounded-lg p-6 shadow hover:shadow-lg transition relative bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2
                    className={`text-xl font-semibold ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {task.title}
                  </h2>
                  <span
                    className={`${getPriorityColor(
                      task.priority
                    )} rounded-full w-4 h-4`}
                    title={`Priority: ${task.priority}`}
                  ></span>
                </div>

                <p
                  className={`mb-4 text-gray-700 ${
                    task.status === "completed" ? "line-through" : ""
                  }`}
                >
                  {task.description || "No description"}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    Due:{" "}
                    {task.duedate
                      ? new Date(task.duedate).toLocaleDateString()
                      : "No due date"}
                  </span>
                  {getStatusBadge(task.status)}
                </div>
              </div>

              <div className="flex space-x-3 mt-auto">
                <button
                  onClick={() =>
                    navigate(`/tasks/update/${task._id}`, { state: { task } })
                  }
                  disabled={task.status === "completed"}
                  className="flex-1 py-2 text-sm rounded bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50"
                >
                  Update
                </button>

                <button
                  onClick={() => handleComplete(task._id)}
                  disabled={task.status === "completed"}
                  className="flex-1 py-2 text-sm rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  Complete & Delete
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="flex-1 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
