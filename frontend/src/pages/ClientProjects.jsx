/*
  API: GET /projects?type=client
  Same UI as Personal Projects.
  Client projects have inherent +1 priority boost (high→urgent, medium→high).
*/
import { useState } from "react";
import ProjectList from "../components/ProjectList";
import CreateProject from "../components/CreateProject";
import "../styles/projects.css";

function ClientProjects() {
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const handleAddProject = () => {
    setShowCreate(true);
  };

  const handleCreate = (formData) => {
    /* API: POST /projects { type: "client", ... } */
    const project = {
      id: `project-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      progress: { completed: 0, total: 0 },
      deadline: new Date(formData.targetDeadline).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      statusIndicator: "gray",
      priority: "high",
      milestones: [],
    };
    setProjects((prev) => [...prev, project]);
    setShowCreate(false);
  };

  if (showCreate) {
    return (
      <CreateProject
        projectType="client"
        onSubmit={handleCreate}
        onCancel={() => setShowCreate(false)}
      />
    );
  }

  return (
    <ProjectList
      projects={projects}
      setProjects={setProjects}
      title="Client Projects"
      onAddProject={handleAddProject}
    />
  );
}

export default ClientProjects;
