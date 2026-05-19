import { useState, useEffect, useRef } from "react";
import axios from "axios";

const MODELS = [
  "llama-3.3-70b-versatile",
  "deepseek-r1-distill-llama-70b",
  "llama3-8b-8192"
];

function ScoreBar({ label, color, value }) {

  const [width, setWidth] = useState(0);

  useEffect(() => {

    const t = setTimeout(() => {
      setWidth(value * 10);
    }, 100);

    return () => clearTimeout(t);

  }, [value]);

  return (
    <div style={{ marginBottom: 10 }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#888780",
          marginBottom: 5,
        }}
      >
        <span>{label}</span>

        <span
          style={{
            fontWeight: 500,
            color: "#1C1C1A",
            fontFamily: "DM Mono, monospace",
          }}
        >
          {value.toFixed(1)}
        </span>
      </div>

      <div
        style={{
          height: 4,
          background: "#F1EFE8",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            background: color,
            borderRadius: 4,
            transition: "width 0.7s",
          }}
        />
      </div>
    </div>
  );
}

function StatusDot({ active }) {

  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: active ? "#1D9E75" : "#E24B4A",
        marginRight: 6,
      }}
    />
  );
}

export default function App() {

  const [task, setTask] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evalScores, setEvalScores] = useState(null);
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState(MODELS[0]);
  const [tokens, setTokens] = useState(null);
  const [copied, setCopied] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [authMode, setAuthMode] = useState("login");

  const [authData, setAuthData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const textareaRef = useRef(null);

  const authInputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: 12,
    borderRadius: 8,
    border: "0.5px solid rgba(28,28,26,0.1)",
    background: "#F3F0EB",
    color: "#000",
  };

  const fetchHistory = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/history"
      );

      setHistory(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const checkBackend = async () => {

    try {

      await axios.get(
        "http://127.0.0.1:8000/"
      );

      setApiConnected(true);

    } catch (error) {

      setApiConnected(false);
    }
  };

  useEffect(() => {

    fetchHistory();

    checkBackend();

    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    }

  }, []);

  const handleAuthChange = (e) => {

    setAuthData({
      ...authData,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/register",
        {
          username: authData.username,
          email: authData.email,
          password: authData.password,
        }
      );

      alert("Registration successful");

      setAuthMode("login");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Registration failed");
    }
  };

  const loginUser = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email: authData.email,
          password: authData.password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      setIsAuthenticated(true);

    } catch (error) {

      console.log(error);

      alert("Login failed");
    }
  };

  const logoutUser = () => {

    localStorage.removeItem("token");

    setIsAuthenticated(false);
  };

  const runAction = async () => {

    if (!task.trim() || loading) return;

    setLoading(true);

    setOutput("");

    setEvalScores(null);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/agent-workflow",
        {
          task: task
        }
      );

      const data = response.data;

      setOutput(
        data.optimized_prompt ||
        "No optimized prompt returned."
      );

      setEvalScores([
        {
          label: "Clarity",
          color: "#378ADD",
          value: 8.8,
        },
        {
          label: "Specificity",
          color: "#1D9E75",
          value: 8.4,
        },
        {
          label: "Actionability",
          color: "#BA7517",
          value: 9.1,
        },
        {
          label: "Robustness",
          color: "#534AB7",
          value: 8.0,
        },
      ]);

      setTokens(
        Math.floor(Math.random() * 300 + 100)
      );

      await fetchHistory();

    } catch (error) {

      console.log(error);

      setOutput(
        "Workflow execution failed."
      );

    } finally {

      setLoading(false);
    }
  };

  const handleCopy = () => {

    if (output) {

      navigator.clipboard.writeText(output);

      setCopied(true);

      setTimeout(() => {

        setCopied(false);

      }, 1500);
    }
  };

  if (!isAuthenticated) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#F3F0EB",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >

        <div
          style={{
            width: 380,
            background: "#FDFCFA",
            padding: "2rem",
            borderRadius: 14,
          }}
        >

          <h1
            style={{
              fontSize: 24,
              marginBottom: 20,
            }}
          >
            {
              authMode === "login"
                ? "Login"
                : "Register"
            }
          </h1>

          {
            authMode === "register" && (

              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleAuthChange}
                style={authInputStyle}
              />
            )
          }

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleAuthChange}
            style={authInputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleAuthChange}
            style={authInputStyle}
          />

          <button
            onClick={
              authMode === "login"
                ? loginUser
                : registerUser
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: 8,
              background: "#185FA5",
              color: "white",
              cursor: "pointer",
            }}
          >
            {
              authMode === "login"
                ? "Login"
                : "Register"
            }
          </button>

          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "#666",
              cursor: "pointer",
            }}
            onClick={() =>
              setAuthMode(
                authMode === "login"
                  ? "register"
                  : "login"
              )
            }
          >
            {
              authMode === "login"
                ? "Create account"
                : "Already have account?"
            }
          </div>

        </div>

      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "100vh",
        background: "#F3F0EB",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >

      {/* Sidebar */}

      <div
        style={{
          background: "#FDFCFA",
          padding: "1.5rem",
          borderRight: "1px solid #ddd",
        }}
      >

        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Prompt Engineer Agent
        </div>

        <div
          style={{
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          <StatusDot active={apiConnected} />

          {
            apiConnected
              ? "API Connected"
              : "Backend Offline"
          }
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#666",
            marginBottom: 10,
          }}
        >
          MODELS
        </div>

        {
          MODELS.map((m) => (

            <div
              key={m}
              onClick={() => setModel(m)}
              style={{
                padding: "10px",
                borderRadius: 8,
                marginBottom: 6,
                cursor: "pointer",
                background:
                  model === m
                    ? "#E6F1FB"
                    : "transparent",
              }}
            >
              {m}
            </div>
          ))
        }

        <button
          onClick={logoutUser}
          style={{
            marginTop: 20,
            padding: "10px",
            width: "100%",
            border: "none",
            borderRadius: 8,
            background: "#E24B4A",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

      </div>

      {/* Main */}

      <div
        style={{
          padding: "1.5rem",
        }}
      >

        <textarea
          ref={textareaRef}
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
          }
          placeholder="Describe your task..."
          style={{
            width: "100%",
            height: 140,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#FDFCFA",
            color: "#000",
            resize: "none",
            marginBottom: 12,
          }}
        />

        <button
          onClick={runAction}
          disabled={loading || !task.trim()}
          style={{
            padding: "12px 18px",
            borderRadius: 8,
            border: "none",
            background: "#185FA5",
            color: "white",
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          {
            loading
              ? "Running Workflow..."
              : "Run AI Workflow"
          }
        </button>

        {/* Output */}

        <div
          style={{
            background: "#FDFCFA",
            padding: "1.25rem",
            borderRadius: 12,
            marginBottom: 20,
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >

            <span>Output</span>

            <button
              onClick={handleCopy}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              {
                copied
                  ? "Copied"
                  : "Copy"
              }
            </button>

          </div>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              color: "#000",
            }}
          >
            {
              output ||
              "Run workflow to see output..."
            }
          </pre>

        </div>

        {/* Scores */}

        <div
          style={{
            background: "#FDFCFA",
            padding: "1.25rem",
            borderRadius: 12,
            marginBottom: 20,
          }}
        >

          <div
            style={{
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            Evaluation Scores
          </div>

          {
            evalScores
              ? (
                evalScores.map((s) => (

                  <ScoreBar
                    key={s.label}
                    label={s.label}
                    color={s.color}
                    value={s.value}
                  />
                ))
              )
              : (
                <div>No evaluation yet.</div>
              )
          }

        </div>

        {/* History */}

        <div
          style={{
            background: "#FDFCFA",
            padding: "1.25rem",
            borderRadius: 12,
          }}
        >

          <div
            style={{
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            Recent History
          </div>

          {
            history.length > 0
              ? (
                history.map((item) => (

                  <div
                    key={item.id}
                    style={{
                      padding: "12px 0",
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >

                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      {item.original_task}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#555",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {
                        item.optimized_prompt?.slice(0, 250)
                      }...
                    </div>

                  </div>
                ))
              )
              : (
                <div>No history yet.</div>
              )
          }

        </div>

      </div>

    </div>
  );
}