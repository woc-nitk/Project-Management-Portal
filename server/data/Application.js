const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");


const getApplications = function(year, projectID, orgID, applicantID) {
	
};

const addApplication = function(projectID, applicantID) {
	const year = new Date().getFullYear();
	return dbQuery("CALL add_applicant(?,?,?)", [projectID, applicantID, year]).then((data) => data, (error) => new GraphQLError(error));
};

const deleteApplication = function(projectID, applicantID, year) {

};

const acceptorRejectApplication = function(projectID, applicantID, accept) {
	const year = new Date().getFullYear();
	return dbQuery("CALL accept_or_reject_application(?,?,?,?)", [projectID, applicantID, year, accept]).then((data) => data, (error) => new GraphQLError(error));
};

const passApplication = function(projectID, applicantID, result) {
	const year = new Date().getFullYear();
	return dbQuery("CALL success_or_failure_application(?,?,?,?)", [projectID, applicantID, year, result]).then((data) => data, (error) => new GraphQLError(error))
};

const ApplicationResolvers = {
	applicant: (parent) => dbQuery("SELECT applicant_id FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.applicant_id : new GraphQLError("No such entry")),
	project: (parent) => dbQuery("SELECT project_id FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.project_id : new GraphQLError("No such entry")),
	accepted: (parent) => dbQuery("SELECT accepted FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.accepted : new GraphQLError("No such entry")),
	result: (parent) => dbQuery("SELECT result FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.result : new GraphQLError("No such entry")),
	year: (parent) => dbQuery("SELECT absolute_year FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)", [parent.applicant_id, parent.project_id]).then((data) => data ? data.absolute_year : new GraphQLError("No such entry")),
};

module.exports = {getApplications, addApplication, deleteApplication, acceptorRejectApplication, passApplication, ApplicationResolvers};
