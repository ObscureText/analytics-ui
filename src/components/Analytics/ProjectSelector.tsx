import React from "react";
import { FolderKanban, Layers } from "lucide-react";

interface ProjectSelectorProps {
    projects: string[];
    selectedProject: string;
    onSelectProject: (project: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects, selectedProject, onSelectProject }) => {
    return (
        <div className="project-tabs">
            <button
                className={`project-tab ${selectedProject === "ALL" ? "active" : ""}`}
                onClick={() => onSelectProject("ALL")}
            >
                <Layers size={16} />
                <span>All Projects</span>
            </button>

            {projects.map((p) => (
                <button
                    key={p}
                    className={`project-tab ${selectedProject === p ? "active" : ""}`}
                    onClick={() => onSelectProject(p)}
                >
                    <FolderKanban size={16} />
                    <span>{p}</span>
                </button>
            ))}
        </div>
    );
};

export default ProjectSelector;
