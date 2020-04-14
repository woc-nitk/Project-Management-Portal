const dbQuery = require("../config/db");
const { GraphQLError } = require("graphql");


const getApplications = function(year, projectID, orgID, applicantID) {
	
};

const addApplication = function(projectID, applicantID) {

};

const deleteApplication = function(projectID, applicantID, year) {

};

const acceptApplication = function(projectID, applicantID) {

};

const passApplication = function(projectID, applicantID) {

};

const ApplicationResolvers = {
	applicant: (parent) => dbQuery("SELECT applicant_id FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.applicant_id : new GraphQLError("No such entry")),
	project: (parent) => dbQuery("SELECT project_id FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.project_id : new GraphQLError("No such entry")),
	accepted: (parent) => dbQuery("SELECT accepted FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.accepted : new GraphQLError("No such entry")),
	result: (parent) => dbQuery("SELECT result FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.result : new GraphQLError("No such entry")),
	year: (parent) => dbQuery("SELECT absolute_year FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.absolute_year : new GraphQLError("No such entry")),
};

module.exports = {getApplications, addApplication, deleteApplication, acceptApplication, passApplication, ApplicationResolvers};
