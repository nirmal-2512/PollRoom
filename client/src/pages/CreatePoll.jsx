import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/api/polls", {
        question,
        options: options.filter(Boolean),
      });

      navigator.clipboard.writeText(
        `${window.location.origin}/poll/${data._id}`,
      );

      navigate(`/poll/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create poll");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white max-w-lg mx-auto p-8 rounded-2xl shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">Create a Poll</h2>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border p-3 rounded-lg"
        placeholder="Poll question"
      />

      {options.map((opt, i) => (
        <input
          key={i}
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[i] = e.target.value;
            setOptions(newOptions);
          }}
          className="w-full border p-3 rounded-lg"
          placeholder={`Option ${i + 1}`}
        />
      ))}

      <button
        type="button"
        onClick={() => setOptions([...options, ""])}
        className="text-blue-600 font-medium"
      >
        + Add Option
      </button>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        Create Poll
      </button>
    </form>
  );
};

export default CreatePoll;
