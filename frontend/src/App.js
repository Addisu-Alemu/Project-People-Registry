import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectList from "./components/ProjectList";
import PersonList from "./components/PersonList";
const API = "http://localhost:8000";
function App() {
  const [projects, setProjects] = useState([]);
  const [people, setPeople] = useState([]);
  const fetchProjects = () =>
    axios.get(`${API}/projects`).then((r) => setProjects(r.data));
  const fetchPeople = () =>
    axios.get(`${API}/people`).then((r) => setPeople(r.data));
  useEffect(() => {
    fetchProjects();
    fetchPeople();
  }, []);
  return (
    <div className="container mt-4">
      <h1>Project-People Registry</h1>
      <div className="row">
        <div className="col-md-6">
          <ProjectList
            projects={projects}
            people={people}
            refresh={fetchProjects}
            API={API}
          />
        </div>
        <div className="col-md-6">
          <PersonList people={people} refresh={fetchPeople} API={API} />
        </div>
      </div>
    </div>
  );
}
export default App;
