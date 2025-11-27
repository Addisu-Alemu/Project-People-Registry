import React, { useState } from "react";
import axios from "axios";
export default function PersonList({ people, refresh, API }) {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [sel, setSel] = useState(null);
  const create = () => {
    axios.post(`${API}/people`, form).then(() => {
      refresh();
      setShowNew(false);
      setForm({});
    });
  };
  const update = () => {
    axios.put(`${API}/people/${sel.id}`, form).then(() => {
      refresh();
      setSel(null);
      setForm({});
    });
  };
  const remove = (id) => {
    axios.delete(`${API}/people/${id}`).then(refresh);
  };
  return (
    <>
      <h3>
        People{" "}
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setShowNew(true)}
        >
          +
        </button>
        <a
          className="btn btn-sm btn-outline-success ms-2"
          href="http://localhost:8000/export/projects"
        >
          📥 CSV
        </a>
      </h3>
      {showNew && (
        <div className="card p-2 mb-2">
          <input
            className="form-control mb-1"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="form-control mb-1"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-control mb-1"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <button className="btn btn-success btn-sm" onClick={create}>
            Save
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowNew(false)}
          >
            Cancel
          </button>
        </div>
      )}
      <ul className="list-group">
        {people.map((p) => (
          <li key={p.id} className="list-group-item">
            {p.name} ({p.role}) — {p.email}
            <div className="mt-1">
              <button
                className="btn btn-sm btn-outline-primary me-1"
                onClick={() => {
                  setSel(p);
                  setForm(p);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => remove(p.id)}
              >
                Del
              </button>
            </div>
          </li>
        ))}
      </ul>
      {sel && (
        <div className="card p-2 mt-2">
          <h5>Edit Person</h5>
          <input
            className="form-control mb-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="form-control mb-1"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-control mb-1"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <button className="btn btn-success btn-sm" onClick={update}>
            Save
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSel(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
