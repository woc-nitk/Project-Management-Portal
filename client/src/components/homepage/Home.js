import React from "react";
import Timeline from "./Timeline";

const timeline = [
    {event: "Projects announced", date:"April 15, 2020"},
    {event: "Student application period", date:"April 15-20, 2020"},
    {event: "Students selected", date:"April 30, 2020"},
    {event: "Students begin working on projects", date:"May 1, 2020"},
    {event: "Student evaluation period", date:"June 1-3, 2020"},
    {event: "Results announced", date:"June 5, 2020"}
]

const Home = () => {
  return (
    <>
      <h1>NITK Winter of Code</h1>
      <Timeline timelines={timeline}/>
    </>
  );
};

export default Home;
