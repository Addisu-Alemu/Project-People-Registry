import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BulkAssignModal({
  show,
  onClose,
  project,
  people,
  assignedIds,
  API,
  onDone,
}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [show]); // reset on open

  const toggle = (pid) =>
    setSelected((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    );

  const submit = () => {
    axios
      .post(`${API}/projects/${project.id}/bulk/people`, selected)
      .then(() => {
        onDone();
        onClose();
      });
  };
  if (!show) return null;

  const available = people.filter((p) => !assignedIds.includes(p.id));

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,.45)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Bulk assign to <strong>{project.title}</strong>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {available.length === 0 && <p>No more people to assign.</p>}
            {available.map((p) => (
              <div key={p.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggle(p.id)}
                />
                <label className="form-check-label">
                  {p.name} ({p.role})
                </label>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-sm btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-sm btn-success"
              onClick={submit}
              disabled={selected.length === 0}
            >
              Assign {selected.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
