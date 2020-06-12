import React from "react";
import { Link } from "react-router-dom";

export default function Projects({ projects }) {
  return (
    <div className="container">
      <ul>
        {projects.map((project, idx) => {
          return (
            <li key={idx}>
              <Link to={`admin/project/${project.id}`}>
                <p>{project.name}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
