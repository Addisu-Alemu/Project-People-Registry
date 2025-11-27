import React, { useEffect } from "react";
import useDarkMode from "./hooks/useDarkMode";
import ProjectList from "./components/ProjectList";
import PersonList from "./components/PersonList";
import axios from "axios";
const API = "http://localhost:8000";

function App() {
  const [dark, toggleDark] = useDarkMode();
  const [projects, setProjects] = React.useState([]);
  const [people, setPeople] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const fetchProjects = () =>
    axios.get(`${API}/projects`).then((r) => setProjects(r.data));
  const fetchPeople = () =>
    axios.get(`${API}/people`).then((r) => setPeople(r.data));
  useEffect(() => {
    fetchProjects();
    fetchPeople();
  }, []);

  const projFilter = (p) =>
    p.title.toLowerCase().includes(search.toLowerCase());
  const peopFilter = (p) => p.name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Project-People Registry</h1>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={toggleDark}
        >
          {dark ? "🌙" : "☀️"}
        </button>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Search projects or people…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="row">
        <div className="col-md-6">
          <ProjectList
            projects={projects.filter(projFilter)}
            people={people}
            refresh={fetchProjects}
            API={API}
          />
        </div>
        <div className="col-md-6">
          <PersonList
            people={people.filter(peopFilter)}
            refresh={fetchPeople}
            API={API}
          />
        </div>
      </div>
    </div>
  );
}
export default App;
