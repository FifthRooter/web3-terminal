import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Modal({ onClose, articleTitle }) {
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    async function fetchGptResponse() {
      const prompt = `Write a fun, engaging paragraph summary of the following news title (~60 words), and add an appropriate emoji at the end of it:\n${articleTitle}\n`;
      const { data } = await axios.post("/api/openaiApi", {
        prompt,
      });
      setResponseText(data);
    }

    fetchGptResponse();
  }, [articleTitle]);

  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{responseText}</p>
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
