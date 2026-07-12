/*
  API: GET /projects?type=personal
  Client projects share this UI but get +1 priority boost.
*/
import { useState } from "react";
import ProjectList from "../components/ProjectList";
import CreateProject from "../components/CreateProject";
import "../styles/projects.css";

function PersonalProjects() {
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const handleAddProject = () => {
    setShowCreate(true);
  };

  const handleCreate = (formData) => {
    /* API: POST /projects { type: "personal", ... } */
    const project = {
      id: `project-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      progress: { completed: 0, total: 0 },
      deadline: new Date(formData.targetDeadline).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      statusIndicator: "gray",
      priority: "medium",
      milestones: [],
    };
    setProjects((prev) => [...prev, project]);
    setShowCreate(false);
  };

  if (showCreate) {
    return (
      <CreateProject
        projectType="personal"
        onSubmit={handleCreate}
        onCancel={() => setShowCreate(false)}
      />
    );
  }

  return (
    <ProjectList
      projects={projects}
      setProjects={setProjects}
      title="Personal Projects"
      onAddProject={handleAddProject}
    />
  );
}

export default PersonalProjects;
