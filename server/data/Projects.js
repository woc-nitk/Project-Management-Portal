const dbQuery = require("../config/db");
const { GraphQLError } = require("graphql");


const getProjects = function(year, orgID, mentorID, applicantID) {

};

const addProject = function(name, work, deliverables, prerequisites, absoluteYear, startDate, endDate, organization, mentors) {

};

const deleteProject = function(projectID) {

};

const updateProject = function(projectID, name, work, deliverables, prerequisites, startDate, endDate, organization, mentors) {

};

const ProjectsResolvers = {
	id: () => {  },
	name: () => {  },
	work: () => {  },
	deliverables: () => {  },
	prerequisites: () => {  },
	absolute_year: () => {  },
	project_start_date: () => {  },
	project_end_date: () => {  },
	organization: () => {  },
	mentors: () => {  },
	applications: () => {  },
};


module.exports = { getProjects, addProject, deleteProject, updateProject, ProjectsResolvers};
