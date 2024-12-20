import React, { useState } from "react";
import "../styles/InputSection.css";
import axios from "axios";
import { useRebybRedux } from "rebyb-redux";
import { InitialState } from "../Store";
import { useNavigate, useParams } from "react-router-dom";

const InputSection: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    dispatch,
    store: { markdowns },
  } = useRebybRedux<InitialState>();
  const submit = async () => {
    try {
      setPrompt("");
      // dispatch("markdown", "### Generating...");
      dispatch("markdowns", [
        ...markdowns,
        {
          user: prompt,
          model: "### Generating...",
          createdAt: new Date(),
        },
      ]);
      const { data } = await axios.post("/api/ask-gemini", {
        prompt,
        id,
      });
      // console.log({ data });
      const answer = data.answer;
      dispatch("markdowns", [
        ...markdowns,
        {
          user: prompt,
          model: answer,
          createdAt: new Date(),
        },
      ]);
      if (data.savedChat) {
        navigate(`/chat/${data.savedChat._id}`);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to generate response. Please try again.");
      navigate("/unauthorized");
    }
  };

  return (
    <div className="p-2.5 border-t border-black bg-gray-100 sticky bottom-0 w-full shadow-md rounded-lg z-10">
      <textarea
        placeholder="Type a message..."
        className="w-full p-2.5 text-base bg-transparent border-none outline-none resize-none rounded-md"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={
          // extract \n
          prompt.split("\n").length + Math.floor(prompt.length / 50) > 10
            ? 10
            : prompt.split("\n").length + Math.floor(prompt.length / 50)
        } // Adjust the default number of rows
      />
      <div onClick={submit} className="flex justify-end mt-2">
        <button className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
          Send
        </button>
      </div>
    </div>
  );
};

export default InputSection;
