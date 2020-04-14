const dbQuery = require("../config/db");
const { GraphQLError } = require("graphql");


const getOrganizations = function(year) {

};

const addOrganization = function(name) {

};

const deleteOrganization = function(orgID) {

};

const OrganizationResolvers = {
	id: () => {  }.
	name: () => "SOME TEXT",
	projects: () => "SOME TEXT",
	mentors: () => "SOME TEXT",
	OrgAdmins: () => "SOME TEXT",
};


module.exports = {getOrganizations, addOrganization, deleteOrganization, OrganizationResolvers};
