import { useState, useEffect } from "react";
import SageLogo from "../assets/Sage_Logo_Brilliant_Green_RGB.svg";
import "../styles/admin.css";

function Admin() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  const [teams, setTeams] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);

  const [activeModal, setActiveModal] = useState(null); // "team" | "ticketType" | null
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingType, setEditingType] = useState(null);

  const [teamDraft, setTeamDraft] = useState("");
  const [typeNameDraft, setTypeNameDraft] = useState("");
  const [templateDraft, setTemplateDraft] = useState("");
  const [allowedTeamsDraft, setAllowedTeamsDraft] = useState([]);

  const correctPassword = "admin123";

  /* =====================
     Load / Save
     ===================== */

  useEffect(() => {
    setTeams(JSON.parse(localStorage.getItem("teams")) || []);
    setTicketTypes(JSON.parse(localStorage.getItem("ticketTypes")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("ticketTypes", JSON.stringify(ticketTypes));
  }, [ticketTypes]);

  /* =====================
     Locked state
     ===================== */

  if (!isUnlocked) {
    return (
      <div className="admin-page" style={{ maxWidth: 420, margin: "120px auto", textAlign: "center" }}>
        <h1>Admin</h1>

        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 16 }}
        />

        <button
          className="button-primary"
          onClick={() =>
            password === correctPassword
              ? setIsUnlocked(true)
              : alert("Incorrect password")
          }
        >
          Unlock
        </button>
      </div>
    );
  }

  /* =====================
     Helpers
     ===================== */

  const closeModal = () => {
    setActiveModal(null);
    setEditingTeam(null);
    setEditingType(null);
  };

  const openAddTeam = () => {
    setEditingTeam(null);
    setTeamDraft("");
    setActiveModal("team");
  };

  const openEditTeam = (team) => {
    setEditingTeam(team);
    setTeamDraft(team);
    setActiveModal("team");
  };

  const saveTeam = () => {
    if (!teamDraft.trim()) return;

    if (editingTeam) {
      setTeams(teams.map((t) => (t === editingTeam ? teamDraft : t)));
      setTicketTypes(
        ticketTypes.map((type) => ({
          ...type,
          allowedTeams: type.allowedTeams?.map((t) =>
            t === editingTeam ? teamDraft : t
          ),
        }))
      );
    } else {
      setTeams([...teams, teamDraft]);
    }

    closeModal();
  };

  const deleteTeam = (team) => {
    if (!window.confirm(`Delete team "${team}"?`)) return;

    setTeams(teams.filter((t) => t !== team));
    setTicketTypes(
      ticketTypes.map((type) => ({
        ...type,
        allowedTeams: type.allowedTeams?.filter((t) => t !== team),
      }))
    );
  };

  const openAddTicketType = () => {
    setEditingType(null);
    setTypeNameDraft("");
    setTemplateDraft("");
    setAllowedTeamsDraft([]);
    setActiveModal("ticketType");
  };

  const openEditTicketType = (type) => {
    setEditingType(type);
    setTypeNameDraft(type.name);
    setTemplateDraft(type.template || "");
    setAllowedTeamsDraft(type.allowedTeams || []);
    setActiveModal("ticketType");
  };

  const saveTicketType = () => {
    if (!typeNameDraft.trim()) return;

    if (editingType) {
      setTicketTypes(
        ticketTypes.map((t) =>
          t.id === editingType.id
            ? {
                ...t,
                name: typeNameDraft,
                template: templateDraft,
                allowedTeams: allowedTeamsDraft,
              }
            : t
        )
      );
    } else {
      setTicketTypes([
        ...ticketTypes,
        {
          id: crypto.randomUUID(),
          name: typeNameDraft,
          template: templateDraft,
          allowedTeams: allowedTeamsDraft,
        },
      ]);
    }

    closeModal();
  };

  const deleteTicketType = (type) => {
    if (!window.confirm(`Delete "${type.name}"?`)) return;
    setTicketTypes(ticketTypes.filter((t) => t.id !== type.id));
  };

  const toggleTeamAccess = (team) => {
    setAllowedTeamsDraft((prev) =>
      prev.includes(team)
        ? prev.filter((t) => t !== team)
        : [...prev, team]
    );
  };

  /* =====================
     Render
     ===================== */

  return (
    <div className="admin-page" style={{ maxWidth: 1200, margin: "20px auto", padding: "0 24px" }}>

      <h1>Admin Settings</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        {/* Ticket Types */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2>Ticket Types</h2>
            <button className="button-primary" onClick={openAddTicketType}>
              Add Ticket Type
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Teams</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ticketTypes.map((type) => (
                <tr key={type.id}>
                  <td>{type.name}</td>
                  <td>{type.allowedTeams?.length ? type.allowedTeams.join(", ") : "None"}</td>
                  <td align="right">
                    <button className="button-tertiary" onClick={() => openEditTicketType(type)}>
                      Edit
                    </button>
                    <button className="button-destructive" onClick={() => deleteTicketType(type)} style={{ marginLeft: 12 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Teams */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2>Teams</h2>
            <button className="button-primary" onClick={openAddTeam}>
              Add Team
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team}>
                  <td>{team}</td>
                  <td align="right">
                    <button className="button-tertiary" onClick={() => openEditTeam(team)}>
                      Edit
                    </button>
                    <button className="button-destructive" onClick={() => deleteTeam(team)} style={{ marginLeft: 12 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* =====================
         Modal
         ===================== */}
      {activeModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2>
              {activeModal === "team"
                ? editingTeam ? "Edit Team" : "Add Team"
                : editingType ? "Edit Ticket Type" : "Add Ticket Type"}
            </h2>

            {activeModal === "team" && (
              <>
                <div className="form-group">
                  <label>Team name</label>
                  <input value={teamDraft} onChange={(e) => setTeamDraft(e.target.value)} />
                </div>

                <div className="modal-actions">
                  <button className="button-secondary" onClick={closeModal}>Cancel</button>
                  <button className="button-primary" onClick={saveTeam}>Save</button>
                </div>
              </>
            )}

            {activeModal === "ticketType" && (
              <>
                <div className="form-group">
                  <label>Name</label>
                  <input value={typeNameDraft} onChange={(e) => setTypeNameDraft(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>HTML template</label>
                  <textarea rows={6} value={templateDraft} onChange={(e) => setTemplateDraft(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Teams with access</label>
                  <div className="admin-checkbox-list">
                    {teams.map((team) => (
                      <label key={team} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={allowedTeamsDraft.includes(team)}
                          onChange={() => toggleTeamAccess(team)}
                        />
                        <span>{team}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="button-secondary" onClick={closeModal}>Cancel</button>
                  <button className="button-primary" onClick={saveTicketType}>Save</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
