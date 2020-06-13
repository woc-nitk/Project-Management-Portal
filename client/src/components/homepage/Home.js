import React, { useContext } from "react";
import Timeline from "./Timeline";
import { UserContext } from "../../store/UserContext";

const timeline = [
    {event: "Projects announced", date:"April 15, 2020"},
    {event: "Student application period", date:"April 15-20, 2020"},
    {event: "Students selected", date:"April 30, 2020"},
    {event: "Students begin working on projects", date:"May 1, 2020"},
    {event: "Student evaluation period", date:"June 1-3, 2020"},
    {event: "Results announced", date:"June 5, 2020"}
]

const Home = () => {
  const [user, setUser] = useContext(UserContext);
  // console.log(user);
  return (
    <>
    <div className="home">
      <h1>NITK<br></br>Winter of Code</h1>
    </div>
    <br></br>
    <h1 style={{textAlign:"center", fontSize:"36px"}}>Timeline</h1>
    <Timeline timelines={timeline}/>
    </>
  );
};

export default Home;
