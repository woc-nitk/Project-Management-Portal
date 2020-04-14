const dbQuery = require("../config/db");
const { GraphQLError } = require("graphql");


const getOrgAdmins = function(orgID) {
	return dbQuery("CALL get_org_admins_by_org_id(?)", [orgID]).then((data) => data);
};

const addOrgAdmins = function(email, name, password, absoluteYear, organization) {

};

const deleteOrgAdmin = function(orgAdminID) {

};


const OrgAdminResolvers = {
	id: (parent) => dbQuery("SELECT org_admin_id FROM Org_Admins WHERE org_admin_id = (?)", [parent.org_admin_id]).then((data) => data ? data.org_admin_id : new GraphQLError("No such entry")),
	email: (parent) => dbQuery("SELECT email FROM Org_Admins WHERE org_admin_id = (?)", [parent.org_admin_id]).then((data) => data ? data.email : new GraphQLError("No such entry")), 
	name: (parent) => dbQuery("SELECT org_admin_name FROM Org_Admins WHERE org_admin_id = (?)", [parent.org_admin_id]).then((data) => data ? data.org_admin_name : new GraphQLError("No such entry")),
	absolute_year: (parent) => dbQuery("SELECT absolute_year FROM Org_Admins WHERE org_admin_id = (?)", [parent.org_admin_id]).then((data) => data ? data.absolute_year : new GraphQLError("No such entry")),
	organization: (parent) => dbQuery("CALL get_org_admins_orgs(?)", [parent.org_admin_id]).then((data) => data ? data : new GraphQLError("No such entry")),
};

module.exports = {getOrgAdmins, addOrgAdmins, deleteOrgAdmin, OrgAdminResolvers};
