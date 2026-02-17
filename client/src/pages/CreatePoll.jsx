import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/api/polls", {
        question,
        options: options.filter((opt) => opt.trim() !== ""),
      });

      // copy share link
      const shareUrl = `${window.location.origin}/poll/${data._id}`;
      await navigator.clipboard.writeText(shareUrl);

      alert("Poll created! Link copied.");

      navigate(`/poll/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create poll");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white max-w-xl mx-auto mt-10 p-8 rounded-2xl shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">Create Poll</h2>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Poll Question"
        className="w-full border p-3 rounded-lg"
        required
      />

      {options.map((opt, i) => (
        <input
          key={i}
          value={opt}
          onChange={(e) => handleOptionChange(e.target.value, i)}
          placeholder={`Option ${i + 1}`}
          className="w-full border p-3 rounded-lg"
          required
        />
      ))}

      <button type="button" onClick={addOption} className="text-blue-600">
        + Add Option
      </button>

      <button className="w-full bg-green-600 text-white py-3 rounded-lg">
        Create Poll
      </button>
    </form>
  );
};

export default CreatePoll;
