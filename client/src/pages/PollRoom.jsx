import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket/socket";
import { getVoterId } from "../utils/getVoterId";
import Results from "../components/Results";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PollRoom = () => {
  const { id: pollId } = useParams();

  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState("");

  // ✅ Check if already voted
  useEffect(() => {
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls")) || {};

    if (votedPolls[pollId]) {
      setHasVoted(true);
    }
  }, [pollId]);

  // ✅ Fetch Poll
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const { data } = await axios.get(`${API}/api/polls/${pollId}`);

        setPoll(data);
      } catch {
        setError("Poll not found");
      }
    };

    fetchPoll();
  }, [pollId]);

  // ✅ Socket Setup
  useEffect(() => {
    socket.connect();
    socket.emit("joinPoll", pollId);

    socket.on("voteUpdated", (updatedResults) => {
      setResults(updatedResults);
    });

    return () => {
      socket.off("voteUpdated");
      socket.disconnect();
    };
  }, [pollId]);

  // ✅ Vote Handler
  const handleVote = async (optionIndex) => {
    if (hasVoted) return;

    try {
      setLoading(true);

      const voterId = getVoterId();

      const { data } = await axios.post(`${API}/api/votes`, {
        pollId,
        optionIndex,
        voterId,
      });

      setResults(data);
      setHasVoted(true);

      // persist vote locally
      const votedPolls = JSON.parse(localStorage.getItem("votedPolls")) || {};

      votedPolls[pollId] = true;

      localStorage.setItem("votedPolls", JSON.stringify(votedPolls));
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You already voted on this poll.");
        setHasVoted(true);
      } else {
        setError("Voting failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate total votes
  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!poll) {
    return <div style={{ padding: "40px" }}>Loading poll...</div>;
  }

  return (
    <div className="bg-white max-w-2xl mx-auto p-8 rounded-2xl shadow space-y-6">
      <h1>{poll.question}</h1>

      {poll.options.map((option, index) => {
        const voteObj = results.find((r) => r.option === option);

        const votes = voteObj?.votes || 0;

        const percent = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;

        return (
          <div key={index} style={{ marginBottom: 20 }}>
            <button
              className="w-full border p-3 rounded-lg hover:bg-gray-100 transition"
              onClick={() => handleVote(index)}
              disabled={hasVoted || loading}
              style={{
                width: "100%",
                padding: "12px",
                cursor: hasVoted ? "not-allowed" : "pointer",
              }}
            >
              {option}
            </button>

            {/* Results Bar */}
            {hasVoted && (
              <div
                style={{
                  background: "#eee",
                  height: 10,
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    background: "#4caf50",
                  }}
                />
              </div>
            )}

            {hasVoted && (
              <small>
                {votes} votes ({percent}%)
              </small>
            )}
          </div>
        );
      })}

      {hasVoted && <Results results={results} />}
      ${percent > 50 ? "bg-green-600" : "bg-green-400"}

      {hasVoted && (
        <p style={{ color: "green" }}>✅ Your vote has been recorded</p>
      )}

      <p>Total votes: {totalVotes}</p>
    </div>
  );
};

export default PollRoom;
