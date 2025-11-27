import React, { useState } from "react";
import axios from "axios";

export default function ProjectList({ projects, people, refresh, API }) {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    owner_id: "",
  });
  const [sel, setSel] = useState(null);

  const create = () => {
    axios.post(`${API}/projects`, form).then(() => {
      refresh();
      setShowNew(false);
      setForm({});
    });
  };
  const assign = (prid, pid) => {
    axios.post(`${API}/projects/${prid}/people/${pid}`).then(refresh);
  };
  const unassign = (prid, pid) => {
    axios.delete(`${API}/projects/${prid}/people/${pid}`).then(refresh);
  };
  const update = () => {
    axios.put(`${API}/projects/${sel.id}`, form).then(() => {
      refresh();
      setSel(null);
      setForm({});
    });
  };
  const remove = (id) => {
    axios.delete(`${API}/projects/${id}`).then(refresh);
  };

  return (
    <>
      <h3>
        Projects{" "}
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
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="form-control mb-1"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="form-select mb-1"
            value={form.owner_id}
            onChange={(e) =>
              setForm({ ...form, owner_id: parseInt(e.target.value) })
            }
          >
            <option value="">Choose owner</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
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
        {projects.map((pr) => (
          <li key={pr.id} className="list-group-item">
            <strong>{pr.title}</strong> (
            {people.find((p) => p.id === pr.owner_id)?.name || "-"})
            <br />
            <small>{pr.description}</small>
            <div className="mt-1">
              <button
                className="btn btn-sm btn-outline-primary me-1"
                onClick={() => {
                  setSel(pr);
                  setForm(pr);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger me-1"
                onClick={() => remove(pr.id)}
              >
                Del
              </button>

              <select
                className="form-select-sm d-inline w-auto"
                onChange={(e) => assign(pr.id, parseInt(e.target.value))}
                value=""
              >
                <option value="">Add person</option>
                {people
                  .filter((p) => !pr.people.find((x) => x.id === p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
            <ul className="mt-1">
              {pr.people.map((p) => (
                <li key={p.id}>
                  {p.name} ({p.role}){" "}
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => unassign(pr.id, p.id)}
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {sel && (
        <div className="card p-2 mt-2">
          <h5>Edit Project</h5>
          <input
            className="form-control mb-1"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="form-control mb-1"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="form-select mb-1"
            value={form.owner_id}
            onChange={(e) =>
              setForm({ ...form, owner_id: parseInt(e.target.value) })
            }
          >
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
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
