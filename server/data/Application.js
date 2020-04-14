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
	applicant: (parent, args) => {},
	project: (parent, args) => {},
	accepted: (parent, args) => {},
	result: (parent, args) => {},
};

module.exports = {getApplications, addApplication, deleteApplication, acceptApplication, passApplication, ApplicationResolvers};
