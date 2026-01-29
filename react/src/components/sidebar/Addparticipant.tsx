import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Addparticipant.scss";

interface AddParticipantProps {
  chatId: number | null;
  onClose: () => void;
  onSubmit: (data: { username: string }) => Promise<void>;
}

export const AddParticipant: React.FC<AddParticipantProps> = ({
  chatId,
  onClose,
  onSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId) {
      setError("No active chat selected.");
      return;
    }
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({ username: username.trim() });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add participant");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="add-participant-overlay" onClick={onClose}>
      <div className="add-participant-container" onClick={(e) => e.stopPropagation()}>
        <h2>Add Participant</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Enter Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
