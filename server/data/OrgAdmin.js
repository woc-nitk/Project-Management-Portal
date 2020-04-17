const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");


const getOrgAdmins = function(orgID) {
	return dbQuery("CALL get_org_admins_by_org_id(?)", [orgID]).then((data) => data);
};

const addOrgAdmin = function(email, password, name, org_id, year) {
	if(year == null) year = new Date().getFullYear();
	const setAutoCommit = () =>  { return dbQuery("SET AUTOCOMMIT=0").then(() => startTransaction(), (err) => new GraphQLError(err)); };
	const startTransaction = () => { return dbQuery("BEGIN").then(() => addOrgAdmin(email, name, password, year), (err) => new GraphQLError(err)); };
	const addOrgAdmin = (email, name, password, year) => { return dbQuery("CALL add_org_admin(?,?,?,?)", [email, name, password, year]).then((data) => addOrgAdminOrg(data[0].org_admin_id), (error) => rollbackTransaction(error)); };
	const addOrgAdminOrg = (org_admin_id) => { return dbQuery("CALL add_org_admin_belongs_to(?,?)",[parseInt(org_id), org_admin_id]).then(() => commitTransaction(org_admin_id), (error) => rollbackTransaction(error)); };
	const commitTransaction = (org_admin_id) => { return dbQuery("COMMIT").then(() => { return { "org_admin_id": org_admin_id }; }, (error) => new GraphQLError(error)); };
	const rollbackTransaction = (error) => { return dbQuery("ROLLBACK").then(() => new GraphQLError(error), (error) => new GraphQLError(error)); };
	return setAutoCommit();
};

const deleteOrgAdmin = function(orgAdminID) {
	return dbQuery("CALL delete_org_admin(?)", [orgAdminID]).then(() => true, (error) => new GraphQLError(error));
};


const OrgAdminResolvers = {
	id: (parent) => dbQuery("SELECT org_admin_id FROM Org_Admins WHERE org_admin_id = (?)", [parent.org_admin_id]).then((data) => data ? data.org_admin_id : new GraphQLError("No such entry")),
	email: (parent) => dbQuery("SELECT email FROM Org_Admins WHERE org_admin_id = (?)", [parent.org_admin_id]).then((data) => data ? data.email : new GraphQLError("No such entry")), 
	name: (parent) => dbQuery("SELECT org_admin_name FROM Org_Admins WHERE org_admin_id = (?)", [parent.org_admin_id]).then((data) => data ? data.org_admin_name : new GraphQLError("No such entry")),
	absolute_year: (parent) => dbQuery("SELECT absolute_year FROM Org_Admins WHERE org_admin_id = (?)", [parent.org_admin_id]).then((data) => data ? data.absolute_year : new GraphQLError("No such entry")),
	organization: (parent) => dbQuery("CALL get_org_admins_orgs(?)", [parent.org_admin_id]).then((data) => data ? data : new GraphQLError("No such entry")),
};

module.exports = {getOrgAdmins, addOrgAdmin, deleteOrgAdmin, OrgAdminResolvers};
