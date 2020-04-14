const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");


const getOrganizations = function(year) {
	return dbQuery("CALL get_orgs_by_year(?)", [year]).then((data) => data);
};

const addOrganization = function(name) {
	const year = new Date().getFullYear();
	return dbQuery("CALL add_organization(?,?)", [name, year]).then((data) => data[0], (error) => new GraphQLError(error));
};

const deleteOrganization = function(orgID) {
	return dbQuery("CALL delete_organization(?)", [orgID]).then(() => true, () => false);
};

const OrganizationResolvers = {
	id: (parent) => dbQuery("SELECT org_id FROM Organizations WHERE org_id = (?)", [parent.org_id]).then((data) => data ? data.org_id : new GraphQLError("No such entry")),
	name: (parent) => dbQuery("SELECT org_name FROM Organizations WHERE org_id = (?)", [parent.org_id]).then((data) => data ? data.org_name : new GraphQLError("No such entry")),
	projects: (parent) => dbQuery("CALL get_projects_by_org(?)", [parent.org_id]).then((data) => data ? data : new GraphQLError("No such entry")),
	mentors: (parent) => dbQuery("CALL get_mentors_by_org(?)", [parent.org_id]).then((data) => data ? data : new GraphQLError("No such entry")),
	OrgAdmins: (parent) => dbQuery("CALL get_org_admins_by_org_id(?)", [parent.org_id]).then((data) => data ? data : new GraphQLError("No such entry")),
};


module.exports = {getOrganizations, addOrganization, deleteOrganization, OrganizationResolvers};
