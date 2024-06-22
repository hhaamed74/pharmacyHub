import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }
  }, []);

  useEffect(() => {
    // Save only question texts in localStorage
    localStorage.setItem(
      "chatHistory",
      JSON.stringify(
        chatHistory.map((entry) => ({
          question: entry.question,
          date: entry.date,
        }))
      )
    );
  }, [chatHistory]);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    setLoading(true);
    try {
      const res = await axios.post(
        "https://e-pharmacyhub-edarcdhhakcaeaad.eastus-01.azurewebsites.net/api/Gemini/Text",
        null,
        {
          params: { message },
          headers: { Accept: "text/plain" },
        }
      );

      const content = res.data.candidates
        ? res.data.candidates[0].content
        : "No response";

      const responseText = formatResponse(content);
      const newChatEntry = {
        question: message,
        answer: responseText,
        date: getCurrentDate(),
      };

      setChatHistory([...chatHistory, newChatEntry]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (content) => {
    if (typeof content === "object") {
      // If content is an object (likely code), stringify it
      return JSON.stringify(content, null, 2);
    } else {
      // Otherwise, treat it as plain text
      return content;
    }
  };

  const getTodayAndYesterdayQuestions = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const todayStr = today.toLocaleDateString();
    const yesterdayStr = yesterday.toLocaleDateString();

    return chatHistory.filter(
      (entry) => entry.date === todayStr || entry.date === yesterdayStr
    );
  };

  return (
    <div className="chat-page">
      <div className="sidebar">
        <h3 style={caresStyle}>Questions</h3>
        {getTodayAndYesterdayQuestions().map((entry, index) => (
          <div key={index} className="sidebar-entry">
            <div>{entry.date}</div>
            <div>{entry.question}</div>
          </div>
        ))}
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <h2 style={caresStyle}>Chat with PharmacyHub</h2>
        </div>
        <div className="chat-body">
          {chatHistory.map((entry, index) => (
            <div key={index} className="chat-entry">
              <div className="chat-question">You: {entry.question}</div>
              <div className="chat-answer">
                Bot:{" "}
                {typeof entry.answer === "object" ? (
                  <pre className="code">{entry.answer}</pre>
                ) : (
                  <p className="normal-text">{entry.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

const caresStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#27b43e",
  backgroundColor: "#e5e0e021",
  padding: "10px 20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  width: "fit-content",
};

export default Chat;
