const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");
const auth = require("../config/auth");

const getApplicants = (year, user) => {
	if (user.type == "superAdmin") {
		if (year == null) year = new Date().getFullYear();
		return dbQuery("CALL get_applicants_by_year(?)", [year]).then(
			(data) => data
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const deleteApplicant = function (applicantID, user) {
	if (user.type == "superAdmin") {
		return dbQuery("CALL delete_applicant(?)", [applicantID]).then(
			() => true,
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const addApplicant = function (
	reg_num,
	email,
	password,
	firstName,
	middleName,
	lastName,
	user
) {
	if (user.type == "superAdmin") {
		const year = new Date().getFullYear();
		password = auth.hash(password);
		return dbQuery("CALL add_applicant(?,?,?,?,?,?,?)", [
			reg_num,
			email,
			firstName,
			middleName,
			lastName,
			password,
			year
		]).then(
			(data) => data[0],
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const editApplicant = function (applicantID, email, password, user) {
	if (
		user.type == "superAdmin" ||
		(user.type == "applicant" && user.id == applicantID)
	) {
		const year = new Date().getFullYear();
		return dbQuery("CALL update_applicant(?,?,?,?)", [
			applicantID,
			email,
			password,
			year
		]).then(
			(data) => data[0],
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

var ApplicantResolvers = {
	id: (parent) =>
		dbQuery(
			"SELECT applicant_id FROM applicants WHERE applicant_id = (?)",
			[parent.applicant_id]
		).then((data) =>
			data ? data.applicant_id : new GraphQLError("No such entry")
		),
	email: (parent) =>
		dbQuery("SELECT email FROM applicants WHERE applicant_id = (?)", [
			parent.applicant_id
		]).then((data) =>
			data ? data.email : new GraphQLError("No such entry")
		),
	first_name: (parent) =>
		dbQuery("SELECT first_name FROM applicants WHERE applicant_id = (?)", [
			parent.applicant_id
		]).then((data) =>
			data ? data.first_name : new GraphQLError("No such entry")
		),
	middle_name: (parent) =>
		dbQuery("SELECT middle_name FROM applicants WHERE applicant_id = (?)", [
			parent.applicant_id
		]).then((data) =>
			data ? data.middle_name : new GraphQLError("No such entry")
		),
	last_name: (parent) =>
		dbQuery("SELECT last_name FROM applicants WHERE applicant_id = (?)", [
			parent.applicant_id
		]).then((data) =>
			data ? data.last_name : new GraphQLError("No such entry")
		),
	applicant_year: (parent) =>
		dbQuery(
			"SELECT applicant_year FROM applicants WHERE applicant_id = (?)",
			[parent.applicant_id]
		).then((data) =>
			data ? data.applicant_year : new GraphQLError("No such entry")
		),
	absolute_year: (parent) =>
		dbQuery(
			"SELECT absolute_year FROM applicants WHERE applicant_id = (?)",
			[parent.applicant_id]
		).then((data) =>
			data ? data.absolute_year : new GraphQLError("No such entry")
		),
	applications: (parent) =>
		dbQuery("CALL get_applications_by_applicant(?)", [
			parent.applicant_id
		]).then((data) => (data ? data : new GraphQLError("No such entry")))
};

module.exports = {
	getApplicants,
	deleteApplicant,
	addApplicant,
	editApplicant,
	ApplicantResolvers
};
