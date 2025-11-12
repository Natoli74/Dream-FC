import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { getCountryFlag, isValidCountry } from "./countries";
import "./App.css";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Router component
function App() {
  const [route, setRoute] = useState("home");
  const [selectedId, setSelectedId] = useState(null);

  const navigate = (path, id = null) => {
    setRoute(path);
    setSelectedId(id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <Header navigate={navigate} currentRoute={route} />
      <main className="main-content">
        {route === "home" && <HomePage navigate={navigate} />}
        {route === "create" && <CreatePage navigate={navigate} />}
        {route === "gallery" && <GalleryPage navigate={navigate} />}
        {route === "detail" && (
          <DetailPage navigate={navigate} playerId={selectedId} />
        )}
        {route === "edit" && (
          <EditPage navigate={navigate} playerId={selectedId} />
        )}
      </main>
      <Footer />
    </div>
  );
}

// Header component
function Header({ navigate, currentRoute }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo" onClick={() => navigate("home")}>
          ⚽ Dream FC
        </h1>
        <nav className="nav">
          <button
            className={`nav-btn ${currentRoute === "home" ? "active" : ""}`}
            onClick={() => navigate("home")}
          >
            Home
          </button>
          <button
            className={`nav-btn ${currentRoute === "create" ? "active" : ""}`}
            onClick={() => navigate("create")}
          >
            Create Player
          </button>
          <button
            className={`nav-btn ${currentRoute === "gallery" ? "active" : ""}`}
            onClick={() => navigate("gallery")}
          >
            My Squad
          </button>
        </nav>
      </div>
    </header>
  );
}

// Home page
function HomePage({ navigate }) {
  const [stats, setStats] = useState({ total: 0, avgSkill: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data, error } = await supabase.from("players").select("skill");

    if (data) {
      const total = data.length;
      const avgSkill =
        total > 0
          ? Math.round(data.reduce((sum, p) => sum + p.skill, 0) / total)
          : 0;
      setStats({ total, avgSkill });
    }
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h2 className="hero-title">Build Your Dream Soccer Team</h2>
        <p className="hero-subtitle">
          Create, manage, and showcase your ultimate football squad
        </p>
        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate("create")}
          >
            Add New Player
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("gallery")}
          >
            View Squad
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Players</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgSkill}</div>
          <div className="stat-label">Average Skill</div>
        </div>
      </div>
    </div>
  );
}

// Create page
function CreatePage({ navigate }) {
  const [formData, setFormData] = useState({
    name: "",
    position: "Forward",
    skill: 50,
    nationality: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.nationality.trim()) {
      setMessage("Please fill in all fields");
      return;
    }

    // Validate nationality
    if (!isValidCountry(formData.nationality)) {
      setMessage(
        "Please enter a valid country name (e.g., Brazil, Spain, USA)"
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("players")
      .insert([formData])
      .select();

    setLoading(false);

    if (error) {
      setMessage("Error creating player: " + error.message);
    } else {
      setMessage("Player created successfully!");
      setTimeout(() => {
        navigate("gallery");
      }, 1000);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title">Create New Player</h2>
        <form onSubmit={handleSubmit} className="player-form">
          <div className="form-group">
            <label>Player Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter player name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Position *</label>
            <div className="position-grid">
              {["Forward", "Midfielder", "Defender", "Goalkeeper"].map(
                (pos) => (
                  <button
                    key={pos}
                    type="button"
                    className={`position-btn ${
                      formData.position === pos ? "active" : ""
                    }`}
                    onClick={() => setFormData({ ...formData, position: pos })}
                  >
                    {pos}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Skill Level: {formData.skill}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={formData.skill}
              onChange={(e) =>
                setFormData({ ...formData, skill: parseInt(e.target.value) })
              }
              className="skill-slider"
            />
            <div className="skill-labels">
              <span>Beginner</span>
              <span>Professional</span>
              <span>World Class</span>
            </div>
          </div>

          <div className="form-group">
            <label>Nationality *</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) =>
                setFormData({ ...formData, nationality: e.target.value })
              }
              placeholder="Enter nationality (e.g., Brazil, Spain, USA)"
              className="form-input"
            />
            {formData.nationality && (
              <div className="nationality-preview">
                {getCountryFlag(formData.nationality)} {formData.nationality}
                {!isValidCountry(formData.nationality) && (
                  <span className="validation-warning"> - Invalid country</span>
                )}
              </div>
            )}
          </div>

          {message && (
            <div
              className={`message ${
                message.includes("Error") ? "error" : "success"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Player"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Gallery page
function GalleryPage({ navigate }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setPlayers(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (data) => {
    if (data.length === 0) return;

    const positions = data.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {});

    const avgSkill = Math.round(
      data.reduce((sum, p) => sum + p.skill, 0) / data.length
    );

    const topPlayer = data.reduce(
      (top, p) => (p.skill > top.skill ? p : top),
      data[0]
    );

    setStats({ positions, avgSkill, topPlayer });
  };

  const getTeamRating = () => {
    if (!stats.avgSkill) return "Building";
    if (stats.avgSkill >= 80) return "⭐⭐⭐ Elite Squad";
    if (stats.avgSkill >= 60) return "⭐⭐ Strong Team";
    return "⭐ Rising Stars";
  };

  if (loading) {
    return <div className="loading">Loading squad...</div>;
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h2>My Squad</h2>
        {players.length > 0 && (
          <div className="team-rating">{getTeamRating()}</div>
        )}
      </div>

      {players.length > 0 && (
        <div className="squad-stats">
          <div className="stat-item">
            <span className="stat-label">Total Players:</span>
            <span className="stat-value">{players.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Skill:</span>
            <span className="stat-value">{stats.avgSkill}</span>
          </div>
          {stats.positions &&
            Object.entries(stats.positions).map(([pos, count]) => (
              <div key={pos} className="stat-item">
                <span className="stat-label">{pos}s:</span>
                <span className="stat-value">
                  {count} ({Math.round((count / players.length) * 100)}%)
                </span>
              </div>
            ))}
        </div>
      )}

      {players.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <h3>No Players Yet</h3>
          <p>Start building your dream team by adding your first player</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("create")}
          >
            Add First Player
          </button>
        </div>
      ) : (
        <div className="players-grid">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}

// Player card component
function PlayerCard({ player, navigate }) {
  const getSkillColor = (skill) => {
    if (skill >= 80) return "#10b981";
    if (skill >= 60) return "#3b82f6";
    if (skill >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getPositionEmoji = (position) => {
    const emojis = {
      Forward: "⚡",
      Midfielder: "🎯",
      Defender: "🛡️",
      Goalkeeper: "🧤",
    };
    return emojis[position] || "⚽";
  };

  // Generate unique avatar based on player name and position
  const getPlayerAvatar = (name, position) => {
    // Different avatar styles based on position
    const styleMap = {
      Forward: "adventurer",
      Midfielder: "avataaars",
      Defender: "bottts",
      Goalkeeper: "micah",
    };
    const style = styleMap[position] || "avataaars";
    const seed = encodeURIComponent(name + position);
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=8a2be2,ff00ff,2d1b4e&scale=80`;
  };

  return (
    <div className="player-card" onClick={() => navigate("detail", player.id)}>
      <div className="player-avatar-container">
        <img
          src={getPlayerAvatar(player.name, player.position)}
          alt={player.name}
          className="player-card-avatar"
        />
      </div>
      <div className="card-header">
        <div className="position-badge">
          <span className="position-emoji">
            {getPositionEmoji(player.position)}
          </span>
          <span>{player.position}</span>
        </div>
        <button
          className="edit-btn-small"
          onClick={(e) => {
            e.stopPropagation();
            navigate("edit", player.id);
          }}
        >
          ✏️
        </button>
      </div>
      <h3 className="player-name">{player.name}</h3>
      <div className="player-flag">
        <span className="flag-emoji">{getCountryFlag(player.nationality)}</span>
        {player.nationality}
      </div>
      <div className="skill-bar">
        <div
          className="skill-fill"
          style={{
            width: `${player.skill}%`,
            backgroundColor: getSkillColor(player.skill),
          }}
        />
      </div>
      <div className="skill-text">Skill: {player.skill}/100</div>
    </div>
  );
}

// Detail page
function DetailPage({ navigate, playerId }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayer();
  }, [playerId]);

  const loadPlayer = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (data) {
      setPlayer(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading player...</div>;
  }

  if (!player) {
    return (
      <div className="empty-state">
        <h3>Player not found</h3>
        <button className="btn btn-primary" onClick={() => navigate("gallery")}>
          Back to Squad
        </button>
      </div>
    );
  }

  const getPositionEmoji = (position) => {
    const emojis = {
      Forward: "⚡",
      Midfielder: "🎯",
      Defender: "🛡️",
      Goalkeeper: "🧤",
    };
    return emojis[position] || "⚽";
  };

  const getSkillLevel = (skill) => {
    if (skill >= 90) return "World Class";
    if (skill >= 80) return "Elite";
    if (skill >= 70) return "Professional";
    if (skill >= 60) return "Semi-Pro";
    if (skill >= 40) return "Amateur";
    return "Beginner";
  };

  // Generate unique avatar based on player name and position
  const getPlayerAvatar = (name, position) => {
    const styleMap = {
      Forward: "adventurer",
      Midfielder: "avataaars",
      Defender: "bottts",
      Goalkeeper: "micah",
    };
    const style = styleMap[position] || "avataaars";
    const seed = encodeURIComponent(name + position);
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=8a2be2,ff00ff,2d1b4e&scale=80`;
  };

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate("gallery")}>
            ← Back to Squad
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("edit", player.id)}
          >
            Edit Player
          </button>
        </div>

        <div className="detail-content">
          <div className="player-avatar">
            <img
              src={getPlayerAvatar(player.name, player.position)}
              alt={player.name}
              className="detail-avatar-img"
            />
          </div>

          <h2 className="detail-name">{player.name}</h2>

          <div className="detail-badges">
            <span className="badge badge-position">{player.position}</span>
            <span className="badge badge-nationality">
              <span className="flag-emoji">
                {getCountryFlag(player.nationality)}
              </span>
              {player.nationality}
            </span>
          </div>

          <div className="detail-stats">
            <div className="detail-stat-card">
              <div className="detail-stat-label">Skill Rating</div>
              <div className="detail-stat-value">{player.skill}/100</div>
              <div className="detail-stat-sublabel">
                {getSkillLevel(player.skill)}
              </div>
            </div>
          </div>

          <div className="detail-info">
            <div className="info-row">
              <span className="info-label">Position:</span>
              <span className="info-value">{player.position}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nationality:</span>
              <span className="info-value">
                <span className="flag-emoji">
                  {getCountryFlag(player.nationality)}
                </span>
                {player.nationality}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Added:</span>
              <span className="info-value">
                {new Date(player.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit page
function EditPage({ navigate, playerId }) {
  const [formData, setFormData] = useState({
    name: "",
    position: "Forward",
    skill: 50,
    nationality: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPlayer();
  }, [playerId]);

  const loadPlayer = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (data) {
      setFormData({
        name: data.name,
        position: data.position,
        skill: data.skill,
        nationality: data.nationality,
      });
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.nationality.trim()) {
      setMessage("Please fill in all fields");
      return;
    }

    // Validate nationality
    if (!isValidCountry(formData.nationality)) {
      setMessage(
        "Please enter a valid country name (e.g., Brazil, Spain, USA)"
      );
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("players")
      .update(formData)
      .eq("id", playerId);

    setSaving(false);

    if (error) {
      setMessage("Error updating player: " + error.message);
    } else {
      setMessage("Player updated successfully!");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this player?")) {
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerId);

    setSaving(false);

    if (error) {
      setMessage("Error deleting player: " + error.message);
    } else {
      navigate("gallery");
    }
  };

  if (loading) {
    return <div className="loading">Loading player...</div>;
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="edit-header">
          <button
            className="back-btn"
            onClick={() => navigate("detail", playerId)}
          >
            ← Back
          </button>
          <h2 className="form-title">Edit Player</h2>
        </div>

        <form onSubmit={handleUpdate} className="player-form">
          <div className="form-group">
            <label>Player Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter player name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Position *</label>
            <div className="position-grid">
              {["Forward", "Midfielder", "Defender", "Goalkeeper"].map(
                (pos) => (
                  <button
                    key={pos}
                    type="button"
                    className={`position-btn ${
                      formData.position === pos ? "active" : ""
                    }`}
                    onClick={() => setFormData({ ...formData, position: pos })}
                  >
                    {pos}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Skill Level: {formData.skill}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={formData.skill}
              onChange={(e) =>
                setFormData({ ...formData, skill: parseInt(e.target.value) })
              }
              className="skill-slider"
            />
            <div className="skill-labels">
              <span>Beginner</span>
              <span>Professional</span>
              <span>World Class</span>
            </div>
          </div>

          <div className="form-group">
            <label>Nationality *</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) =>
                setFormData({ ...formData, nationality: e.target.value })
              }
              placeholder="Enter nationality (e.g., Brazil, Spain, USA)"
              className="form-input"
            />
            {formData.nationality && (
              <div className="nationality-preview">
                {getCountryFlag(formData.nationality)} {formData.nationality}
                {!isValidCountry(formData.nationality) && (
                  <span className="validation-warning"> - Invalid country</span>
                )}
              </div>
            )}
          </div>

          {message && (
            <div
              className={`message ${
                message.includes("Error") ? "error" : "success"
              }`}
            >
              {message}
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Player"}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="footer">
      <p>Dream FC - Build Your Ultimate Soccer Team</p>
    </footer>
  );
}

export default App;
