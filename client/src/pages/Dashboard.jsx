import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (!user) return; // ✅ prevents crash

    const fetchPolls = async () => {
      try {
        const res = await api.get("/api/polls/my");
        setPolls(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPolls();
  }, [user]);

  // ✅ Prevent render before auth loads
  if (!user) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Polls</h1>

        <Link
          to="/create"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Create Poll
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          No polls yet — create one 🚀
        </div>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => (
            <div
              key={poll._id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition"
            >
              <span className="font-semibold">{poll.question}</span>

              <Link
                to={`/poll/${poll._id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
