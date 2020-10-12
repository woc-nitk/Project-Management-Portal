import React from "react";
import { getAT, setAT } from '../../store/auth';



export default function About() {
  return (
    <>
      <div className=" about container">
        <h1
          style={{
            fontSize: "36px",
            marginTop: "60px",
            marginBottom: "5px",
          }}
        >
          About NITK Winter of Code
      </h1>

        <h2>Aim</h2>
        <p>Winter of Code aims at helping students get started with open source projects that directly impact peoples' lives.</p>
        <p>Winter of Code has a philosophy very similar to larger programs like GSoC and Outreachy. Winter of Code is designed to acclimatize people to the steps involved in taking up various projects in large organizations like VLC, Mozilla, etc, through GSoC and other programs.</p>
        <p>Participants will learn how to work in teams, the importance of effective communication, and most importantly, working with large codebases. They will also learn the intricate workflows and good coding practices.</p>

        <h2>Program Overview</h2>
        <p>Winter of Code is a program in NITK focused on introducing student developers in NITK to open source software development. Students can work with projects proposed by the other clubs or by open source organizations over the winter break. This program also plans to introduce to students the rigorous process of developing a project proposal similar to that of GSoC.</p>
        <p>A team of students will act as an organizing committee for the Winter of Code. The organizing committee will ensure that the program is conducted smoothly and will also develop a website for the event. The organizing committee is responsible for creating a basic filter for project proposals.</p>

        <h2>Target Audience</h2>
        <p>Anyone who is interested in contributing to open source! There will be students from all years and so projects of varying difficulty are needed.</p>

        <h2>Projects</h2>
        <p>Projects of different levels of difficulty, catering to different skill sets and expertise, will be available. The projects will cover different domains, as much as possible. The projects can be proposed by students (BTech, MTech, and MCA), and by the various clubs at NITK willing to mentor students. The projects will be accepted by the organizing committee based on their proposals. New projects, as well as projects with an existing codebase, are allowed.</p>
        <p>Mentors must submit projects which can be worked on for a minimum period of one month. Each project must have 2 mentors. If an organization (any club) proposes projects, the organization must have an organization coordinator. Projects should be divided into small tasks/issues.</p>
        <p>Students can apply to projects either by filling a google form or completing a small task, which is at the discretion of the mentors. A student can apply to a maximum of 2 projects.</p>

        <h2>Incentives:</h2>
        <ul>
          <li>Hands-on experience with open source!</li>
          <li>Understanding and experience of how Google Summer of Code is!</li>
          <li>An amazing opportunity to utilize the winter holidays through an impactful project</li>
          <li>Certificate at the end of completion, both for mentors and students. (Mentors can decide if students are eligible for certificates)</li>
        </ul>
      </div>
    </>
  );
}
