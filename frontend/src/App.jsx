import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("summarize");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [listening, setListening] = useState(false);



  const clearAll = () => {
    setText("");
    setResult("");
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    alert("Copied to Clipboard!");
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    setListening(true);

    recognition.onstart = () => {
      console.log("Recognition Started");
    };

    recognition.onspeechstart = () => {
      console.log("Speech detected");
    };

    recognition.onspeechend = () => {
      console.log("Speech ended");
    };


    recognition.onresult = (event) => {
      console.log("RESULT EVENT:", event);

      const transcript =
        event.results[0][0].transcript;

      console.log("Transcript:", transcript);

      setText(transcript);
    };

    recognition.onerror = (event) => {
      console.log("Speech Error:", event.error);
    };

    recognition.onend = () => {
      console.log("Recognition Ended");
      setListening(false);
    };
  }




  const processText = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            mode,
          }),
        }
      );

      const data = await response.json();

      setResult(data.result);

      setHistory((prev) => [
        {
          mode,
          input: text,
          output: data.result,
        },
        ...prev,
      ]);
    } catch (error) {
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
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
        <p className="counter">
          Characters: {text.length}
        </p>
        <br />
        <br />

        <div className="button-group">
          <button
            onClick={processText}
            disabled={loading || !text.trim()}
          >
            {loading ? "Processing..." : "Process Text"}
          </button>

          <button onClick={clearAll}>
            Clear
          </button>

          <button onClick={copyResult}>
            Copy
          </button>

          <button onClick={startListening}>
            {listening
              ? "🎙️ Listening..."
              : "🎙️ Voice Input"}
          </button>
        </div>
        <div className="output">
          <h3>✨ AI Response</h3>
          <p>{result || "Your result will appear here..."}</p>
        </div>
        {history.length > 0 && (
          <div className="history">
            <h3>📜 History</h3>

            {history.map((item, index) => (
              <div className="history-item" key={index}>
                <strong>
                  {item.mode.charAt(0).toUpperCase() + item.mode.slice(1)}
                </strong>
                <p>
                  <b>Input:</b> {item.input}
                </p>

                <p>
                  <b>Output:</b> {item.output}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


