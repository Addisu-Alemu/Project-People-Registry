import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectList from "./components/ProjectList";
import PersonList from "./components/PersonList";
const API = "http://localhost:8000";

function App() {
  const [projects, setProjects] = useState([]);
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState(""); // ← new

  const fetchProjects = () =>
    axios.get(`${API}/projects`).then((r) => setProjects(r.data));
  const fetchPeople = () =>
    axios.get(`${API}/people`).then((r) => setPeople(r.data));

  useEffect(() => {
    fetchProjects();
    fetchPeople();
  }, []);

  // filter helpers
  const projFilter = (p) =>
    p.title.toLowerCase().includes(search.toLowerCase());
  const peopFilter = (p) => p.name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="container mt-4">
      <h1>Project-People Registry</h1>

      {/* Search box */}
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
