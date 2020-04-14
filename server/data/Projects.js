const { dbQuery } = require("../config/db");
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
	id: (parent) => dbQuery("SELECT project_id FROM Project WHERE Project.project_id = (?)", [parent.project_id]).then((data) => data ? data.project_id : new GraphQLError("No such entry")),
	name: (parent) => dbQuery("SELECT project_name FROM Project WHERE Project.project_id = (?)", [parent.project_id]).then((data) => data ? data.project_name : new GraphQLError("No such entry")),
	work: (parent) => dbQuery("SELECT project_id FROM Project WHERE Project.project_id = (?)", [parent.project_id]).then((data) => data ? data.project_id : new GraphQLError("No such entry")),
	deliverables: (parent) => dbQuery("SELECT project_id FROM Project WHERE Project.project_id = (?)", [parent.project_id]).then((data) => data ? data.project_id : new GraphQLError("No such entry")),
	prerequisites: (parent) => dbQuery("CALL get_prerequisites(?)", [parent.project_id]).then((data) => data ? data : new GraphQLError("No such entry")), 
	absolute_year: (parent) => dbQuery("SELECT absolute_year FROM Project WHERE Project.project_id = (?)", [parent.project_id]).then((data) => data ? data.absolute_year : new GraphQLError("No such entry")),
	project_start_date: (parent) => dbQuery("SELECT project_start_date FROM Project WHERE Project.project_id = (?)", [parent.project_id]).then((data) => data ? data.project_start_date : new GraphQLError("No such entry")),
	project_end_date: (parent) => dbQuery("SELECT project_end_date FROM Project WHERE Project.project_id = (?)", [parent.project_id]).then((data) => data ? data.project_end_date : new GraphQLError("No such entry")),
	organization: (parent) => dbQuery("SELECT org_id FROM Maintained_By WHERE Maintained_By.project_id = (?)", [parent.project_id]).then((data) => data ? data.org_id : new GraphQLError("No such entry")),
	mentors: (parent) => dbQuery("CALL get_mentors_by_project(?)", [parent.project_id]).then((data) => data ? data : new GraphQLError("No such entry")),  
	applications: (parent) => dbQuery("CALL get_applications_by_project(?)", [parent.project_id]).then((data) => data ? data : new GraphQLError("No such entry")),
};


module.exports = { getProjects, addProject, deleteProject, updateProject, ProjectsResolvers};
