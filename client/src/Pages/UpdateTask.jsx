import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api/api";

export default function UpdateTask() {
  const { taskId } = useParams();
  const location = useLocation();
  const taskData = location.state?.task;

  const [title, setTitle] = useState(taskData?.title || "");
  const [description, setDescription] = useState(taskData?.description || "");
  const [status, setStatus] = useState(taskData?.status || "to-do");
  const [priority, setPriority] = useState(taskData?.priority || "medium");
  const [duedate, setDuedate] = useState(
    taskData?.duedate ? taskData.duedate.split("T")[0] : ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Optional: If you don't want to rely on passed state, fetch task by ID here

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/task/update-a-task/${taskId}`, {
        title,
        description,
        status,
        priority,
        duedate: duedate || null,
      });
      navigate("/");
    } catch {
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl mb-6 font-semibold">Update Task</h2>

      <label className="block mb-4">
        Title <span className="text-red-600">*</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mt-1"
          disabled={loading}
        />
      </label>

      <label className="block mb-4">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border rounded px-3 py-2 mt-1"
          disabled={loading}
        />
      </label>

      <label className="block mb-4">
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          disabled={loading}
        >
          <option value="to-do">To-Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Completed</option>
        </select>
      </label>

      <label className="block mb-4">
        Priority
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          disabled={loading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label className="block mb-6">
        Due Date
        <input
          type="date"
          value={duedate}
          onChange={(e) => setDuedate(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          disabled={loading}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Update Task"}
      </button>
    </form>
  );
}
