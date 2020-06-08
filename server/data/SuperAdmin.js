const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");

const getSuperAdmins = function (year) {
	if (year == null) year = new Date().getFullYear();
	return dbQuery("CALL get_super_admins_by_year(?)", [year]).then(
		(data) => data
	);
};

const SuperAdminResolvers = {
	id: (parent) =>
		dbQuery(
			"SELECT super_admin_id FROM Super_Admins WHERE super_admin_id = (?)",
			[parent.super_admin_id]
		).then((data) =>
			data ? data.super_admin_id : new GraphQLError("No such entry")
		),
	email: (parent) =>
		dbQuery("SELECT email FROM Super_Admins WHERE super_admin_id = (?)", [
			parent.super_admin_id
		]).then((data) =>
			data ? data.email : new GraphQLError("No such entry")
		),
	name: (parent) =>
		dbQuery(
			"SELECT super_admin_name FROM Super_Admins WHERE super_admin_id = (?)",
			[parent.super_admin_id]
		).then((data) =>
			data ? data.super_admin_name : new GraphQLError("No such entry")
		),
	absolute_year: (parent) =>
		dbQuery(
			"SELECT absolute_year FROM Super_Admins WHERE super_admin_id = (?)",
			[parent.super_admin_id]
		).then((data) =>
			data ? data.absolute_year : new GraphQLError("No such entry")
		)
};

module.exports = { getSuperAdmins, SuperAdminResolvers };
