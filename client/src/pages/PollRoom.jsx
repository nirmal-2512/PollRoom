import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const PollRoom = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPoll = async () => {
    try {
      const { data } = await api.get(`/api/polls/${id}`);
      setPoll(data);
    } catch {
      alert("Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  const vote = async (optionIndex) => {
    try {
      await api.post(`/api/polls/${id}/vote`, {
        optionIndex,
      });

      localStorage.setItem(`voted_${id}`, true);

      fetchPoll(); // refresh results
    } catch (err) {
      alert(err.response?.data?.message || "Voting failed");
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (!poll) return <h2 className="text-center mt-10">Poll not found</h2>;

  const alreadyVoted = localStorage.getItem(`voted_${id}`);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6">{poll.question}</h1>

      <div className="space-y-3">
        {poll.options.map((opt, i) => (
          <button
            key={i}
            disabled={alreadyVoted}
            onClick={() => vote(i)}
            className={`w-full p-3 rounded-lg border 
              ${
                alreadyVoted ? "bg-gray-200" : "hover:bg-blue-50 cursor-pointer"
              }`}
          >
            {opt.text} — {opt.votes} votes
          </button>
        ))}
      </div>

      {alreadyVoted && (
        <p className="text-green-600 mt-4 text-center">✅ You already voted</p>
      )}
    </div>
  );
};

export default PollRoom;
