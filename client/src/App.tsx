import { useMemo, useState } from "react";
import "./styles.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";;

const SYMBOLS = ["+", "-", "×", "÷", "√", "π", "∞", "≈", "≥", "≤", "%"];
const COLORS = ["#ffffff", "#ffd84d", "#61e294", "#6aa9ff", "#ff7ac3"];

type Floater = {
  id: number;
  symbol: string;
  left: string;
  bottom: string;
  fontSize: string;
  color: string;
  delay: string;
};

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("Ready for lift-off! 🚀");
  const [loading, setLoading] = useState(false);

  const floaters: Floater[] = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        left: Math.random() * 100 + "vw",
        bottom: Math.random() * -30 + "vh",
        fontSize: 24 + Math.random() * 44 + "px",
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 8 + "s",
      })),
    []
  );

  const currentYear = new Date().getFullYear();

  const pulseStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus("Ready for lift-off! 🚀"), 1600);
  };

  const clearAll = () => {
    setQuestion("");
    setAnswer("");
    pulseStatus("All clear!");
  };

  const ask = async () => {
    const q = question.trim();
    if (!q || loading) {
      if (!q) pulseStatus("Type a question first!");
      return;
    }

    setLoading(true);
    setAnswer("");
    setStatus("Thinking among the stars… ✨");

    try {
      const res = await fetch(`${API_BASE}/api/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json();
      const result =
        data?.answer ?? data?.result ?? data?.output ?? "No answer field returned.";
      setAnswer(String(result));
      setStatus("Mission complete! ✅");
    } catch (err: any) {
      console.error(err);
      setStatus("Uh-oh!");
      setAnswer(
        "I had trouble talking to the MathsBrain engine.\n\n" +
          (err?.message || "Unknown error") +
          "\n\nMake sure the server is running on http://localhost:4000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      ask();
    }
  };

  return (
    <>
      {/* Background layers */}
      <div className="stars" />
      <div className="floaters" aria-hidden="true">
        {floaters.map((f) => (
          <span
            key={f.id}
            style={{
              left: f.left,
              bottom: f.bottom,
              fontSize: f.fontSize,
              color: f.color,
              animationDelay: f.delay,
            }}
          >
            {f.symbol}
          </span>
        ))}
      </div>

      {/* Header */}
      <header>
        <div className="container">
          <div className="brand" aria-label="MãthĜalãxy">
            <img class="logo-img" src="/brain-logo.png" alt="MathsBrain Galaxy logo" />
            <div>
              <div className="title">M ã t h - Ĝ a l ã x y</div>
              <div className="subtitle">
                Fly through space and discover the magic of math!
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main panel */}
      <main>
        <div className="container">
          <div className="panel">
            <div className="hero">
              <section className="card" aria-label="Ask a question">
                <h2 style={{ margin: "0 0 8px 0" }}>Ask your space question 🌌</h2>

                <div className="field" style={{ marginBottom: "12px" }}>
                  {/* little icon */}
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 19l9-7-9-7-9 7 9 7z" />
                  </svg>
                  <textarea
                    rows={5}
                    placeholder="Enter your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div className="row">
                  <button type="button" onClick={ask} disabled={loading}>
                    {loading ? "Thinking..." : "Ask ✨"}
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={clearAll}
                    disabled={loading && !answer}
                  >
                    Clear
                  </button>
                  <span className="pill">{status}</span>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <label className="label" htmlFor="answer-box">
                    Answer
                  </label>
                  <div
                    id="answer-box"
                    className="answer"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {answer}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer>
        Made for curious space explorers • © {currentYear} MathsBrain Galaxy
      </footer>
    </>
  );
}

export default App;
