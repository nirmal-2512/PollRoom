import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const { data } = await api.get("/api/polls/my");
      setPolls(data);
    };

    fetchPolls();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Link
        to="/create"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + New Poll
      </Link>

      <div className="mt-6 space-y-4">
        {polls.length === 0 ? (
          <p className="text-gray-500">No polls created yet.</p>
        ) : (
          polls.map((poll) => {
            const pollLink = `${window.location.origin}/poll/${poll._id}`;

            const copyLink = async () => {
              try {
                await navigator.clipboard.writeText(pollLink);
                alert("Link copied!");
              } catch {
                alert("Failed to copy link");
              }
            };

            return (
              <div
                key={poll._id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
              >
                {/* Poll Title */}
                <Link
                  to={`/poll/${poll._id}`}
                  className="font-semibold text-lg hover:text-blue-600"
                >
                  {poll.question}
                </Link>

                {/* Copy Button */}
                <button
                  onClick={copyLink}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Copy Link
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
