const dbQuery = require("../config/db");
const { GraphQLError } = require("graphql");


const getOrgAdmins = function(orgID, year) {

};

const addOrgAdmins = function(email, name, password, absoluteYear, organization) {

};

const deleteOrgAdmin = function(orgAdminID) {

};


const OrgAdminResolvers = {
	id: () => {  },
	email: () => {  }, 
	name: () => {  },
	absolute_year: () => {  },
	organization: () => {  },
};

module.exports = {getOrgAdmins, addOrgAdmins, deleteOrgAdmin, OrgAdminResolvers};
