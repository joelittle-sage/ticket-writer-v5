import { useState, useEffect } from "react";

function TicketGenerator() {
  const [teams, setTeams] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("");

  const [rawInput, setRawInput] = useState("");
  const [generatedTicket, setGeneratedTicket] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // Load config from localStorage
  useEffect(() => {
    setTeams(JSON.parse(localStorage.getItem("teams")) || []);
    setTicketTypes(JSON.parse(localStorage.getItem("ticketTypes")) || []);
  }, []);

  const availableTicketTypes = ticketTypes.filter(
    (type) =>
      selectedTeam &&
      type.allowedTeams &&
      type.allowedTeams.includes(selectedTeam)
  );

  const selectedType = ticketTypes.find(
    (type) => type.id === selectedTypeId
  );

  // ✅ DEFINE THIS (THIS WAS MISSING)
  const hasContent =
    selectedTeam ||
    selectedTypeId ||
    rawInput ||
    generatedTicket; 

  const handleGenerateTicket = async () => {
    if (!selectedType) return;

    setIsGenerating(true);
    setError("");
    setGeneratedTicket("");
    setCopied(false);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a product analyst writing high-quality Jira tickets in HTML. Only return valid HTML. Do not include explanations.",
              },
              {
                role: "user",
                content: `
Ticket template:
${selectedType.template}

User input:
${rawInput}

Rewrite the user input into the template. Preserve headings and structure. Return HTML only.
                `,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "OpenAI error");
      }

      setGeneratedTicket(data.choices[0].message.content);
    } catch (err) {
      setError("Ticket generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setSelectedTeam("");
    setSelectedTypeId("");
    setRawInput("");
    setGeneratedTicket("");
    setError("");
  };

  // ✅ CORRECT Jira-safe copy (simulates user selection)
  const copyAsHtml = () => {
    const preview = document.querySelector(".preview");
    if (!preview) return;

    const range = document.createRange();
    range.selectNodeContents(preview);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }

    selection.removeAllRanges();
  };

  return (
    <div style={{ maxWidth: "800px", margin: "10px auto" }}>
      <h1>Ticket Writer</h1>

      {/* Team */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
        <label>Team</label>
        <select
          value={selectedTeam}
          onChange={(e) => {
            setSelectedTeam(e.target.value);
            setSelectedTypeId("");
            setGeneratedTicket("");
          }}
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      {/* Ticket Type */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
        <label>Ticket Type</label>
        <select
          value={selectedTypeId}
          onChange={(e) => {
            setSelectedTypeId(e.target.value);
            setGeneratedTicket("");
          }}
          disabled={!selectedTeam}
        >
          <option value="">Select a ticket type</option>
          {availableTicketTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Raw input */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
        <label>Request details</label>
        <textarea
          rows={8}
          placeholder="Paste an email, description, or notes here…"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          disabled={!selectedTypeId}
        />
      </div>

      {/* Generate */}
      <div
  style={{
    marginBottom: "50px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  }}
>
  <button
    className="button-primary"
    onClick={handleGenerateTicket}
    disabled={!selectedTypeId || !rawInput || isGenerating}
  >
    Generate Ticket
  </button>

<button
  className="button-secondary"
  onClick={handleClear}
  disabled={!hasContent || isGenerating}
>
  Clear
</button>

</div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Loader */}
      {isGenerating && (
        <div style={{ display: "flex", justifyContent: "center", padding: "56px 0" }}>
          <svg
            width="50"
            height="50"
            viewBox="0 0 100 100"
            style={{ animation: "spinner-rotate 1s linear infinite" }}
          >
            <circle cx="50" cy="50" r="40" fill="none" stroke="#0B3D1A" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#00D639"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="90 160"
            />
          </svg>

          <style>
            {`
              @keyframes spinner-rotate {
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {/* Preview */}
      {!isGenerating && generatedTicket && (
        <div style={{ marginTop: "32px" }}>
          <div className="preview-wrapper">
            <div
              className="preview"
              dangerouslySetInnerHTML={{ __html: generatedTicket }}
            />
          </div>

          <button
            className="button-secondary"
            onClick={copyAsHtml}
            style={{ marginTop: "40px", marginBottom: "40px" }}
          >
            {copied ? "Copied ✓" : "Copy Ticket"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TicketGenerator;
