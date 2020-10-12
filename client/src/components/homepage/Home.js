import React from "react";
import { Link } from "react-router-dom";
import Timeline from "./Timeline";

const timeline = [
  { event: "Deadline to submit project proposals by mentors", date: "October 21" },
  { event: "List of selected Projects released. Students start discussing project details with mentors", date: "October 24" },
  { event: "Students start submitting project proposals", date: "October 30" },
  { event: "Last day for Students to submit project proposals", date: "November 14" },
  { event: "List of selected students released", date: "December 1" },
  { event: "Coding phase begins", date: "December 3" },
  { event: "Mid-Evaluation", date: "December 18" },
  { event: "Final code reviews", date: "January 3" }
]

const Home = () => {
  return (
    <>
      <div className="home">
        <div className="text">
          <h1>NITK<br />Winter of Code</h1>
          <p>Kickstart your open source journey</p>
          <a role="button" target="_blank" href="https://forms.gle/xFr4yWz5XL2qrkDe9" rel="noreferrer noopenner">Propose a project</a>
        </div>
      </div>
      <br />
      <h1 style={{ textAlign: "center", fontSize: "36px" }}>Timeline</h1>
      <Timeline timelines={timeline} />
    </>
  );
};

export default Home;
