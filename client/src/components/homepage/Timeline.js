import React from "react";
import "./timeline.css";

export default function Timeline({ timelines }) {
  return timelines.map((timeline, idx) => {
    const dir = idx % 2 === 0 ? "left" : "right";
    return (
      <div className="timeline">
        <div className={"timeline_container " + dir}>
          <div className=" timeline_content">
            <h2>{timeline.event}</h2>
            <p>{timeline.date}</p>
          </div>
        </div>
      </div>
    );
  });
}

