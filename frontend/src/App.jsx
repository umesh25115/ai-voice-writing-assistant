import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("summarize");
  const [loading, setLoading] = useState(false);

  const processText = async () => {
    setLoading(true);

    const response = await fetch(
      "http://127.0.0.1:8000/process",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          mode: mode,
        }),
      }
    );

    const data = await response.json();

    setResult(data.result);
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="hero">
        <h1>🎙️ AI Voice & Writing Assistant</h1>
        <br />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="summarize">Summarize</option>
          <option value="grammar">Grammar Fix</option>
          <option value="formal">Formal Tone</option>
          <option value="expand">Expand Text</option>
        </select>

        <br />
        <br />

        <textarea
          rows="6"
          cols="50"
          placeholder="Enter your text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <br />
        <br />

        <button
          onClick={processText}
          disabled={loading}
        >
          {loading ? "Processing..." : "Process Text"}
        </button>
        <div className="output">
          <h3>✨ AI Response</h3>
          <p>{result || "Your result will appear here..."}</p>
        </div>
      </div>
    </div>
  );
}

export default App;

