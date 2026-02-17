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
        {polls.map((poll) => (
          <Link
            key={poll._id}
            to={`/poll/${poll._id}`}
            className="block bg-white p-4 rounded-xl shadow"
          >
            {poll.question}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
