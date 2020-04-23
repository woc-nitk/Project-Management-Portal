const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");

const checkProjectOrg = (project_id, org_admin_id) => {
	return dbQuery(
		"SELECT project_id FROM Maintained_By INNER JOIN Org_admin_belongs_to ON Maintained_By.org_id = Org_admin_belongs_to.org_id WHERE Maintained_By.project_id = (?) AND Org_admin_belongs_to.org_admin_id = (?)",
		[project_id, org_admin_id]
	).then((data) => {
		if (data) return true;
		return false;
	});
};

const checkProjectMentor = (project_id, mentor_id) => {
	return dbQuery(
		"SELECT project_id FROM Mentored_By WHERE project_id = (?) AND mentor_id = (?)",
		[project_id, mentor_id]
	).then((data) => {
		if (data) return true;
		return false;
	});
};

const getApplications = async function (
	year,
	projectID,
	orgID,
	applicantID,
	user
) {
	if (
		orgID == null &&
		applicantID == null &&
		year == null &&
		projectID != null &&
		((user.type == "orgAdmin" && checkProjectOrg(projectID, user.id)) ||
			(user.type == "mentor" && checkProjectMentor(projectID, user.id)) ||
			(await user.type) == "superAdmin")
	) {
		return dbQuery("CALL get_applications_by_project(?)", [projectID]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else if (
		projectID == null &&
		applicantID == null &&
		year == null &&
		orgID != null &&
		user.type !== "applicant" &&
		user.type !== "mentor"
	) {
		return dbQuery("CALL get_applications_by_org(?)", [orgID]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else if (
		orgID == null &&
		projectID == null &&
		year == null &&
		applicantID != null &&
		(user.type == "superAdmin" ||
			(user.type == "applicant" && user.id == applicantID))
	) {
		return dbQuery("CALL get_applications_by_applicant(?)", [
			applicantID
		]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else if (
		orgID == null &&
		projectID == null &&
		applicantID == null &&
		year != null &&
		user.type == "superAdmin"
	) {
		return dbQuery("CALL get_applications_by_year(?)", [year]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else
		return new GraphQLError(
			"Invalid arguments passed to Query applications"
		);
};

const addApplication = async function (projectID, applicantID, proposal, user) {
	if (
		(user.type == "applicant" && user.id == applicantID) ||
		(user.type == "orgAdmin" && checkProjectOrg(projectID, user.id)) ||
		user.type == "superAdmin"
	) {
		const year = new Date().getFullYear();
		return dbQuery("CALL add_application(?,?,?,?)", [
			projectID,
			applicantID,
			year,
			proposal
		]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const deleteApplication = async function (projectID, applicantID, user) {
	if (
		(user.type == "applicant" && user.id == applicantID) ||
		(user.type == "orgAdmin" && checkProjectOrg(projectID, user.id)) ||
		(await user.type) == "superAdmin"
	) {
		return dbQuery("CALL delete_application(?,?)", [
			projectID,
			applicantID
		]).then(
			() => true,
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const updateProposal = function (applicantID, projectID, proposal, user) {
	if (user.type == "applicant" && user.id == applicantID) {
		return dbQuery("CALL update_proposal(?,?,?)", [
			projectID,
			applicantID,
			new Date().getFullYear(),
			proposal
		]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const acceptorRejectApplication = async function (
	projectID,
	applicantID,
	accept,
	user
) {
	if (
		(user.type == "mentor" && checkProjectMentor(projectID, user.id)) ||
		(user.type == "orgAdmin" && checkProjectOrg(projectID, user.id)) ||
		(await user.type) == "superAdmin"
	) {
		const year = new Date().getFullYear();
		return dbQuery("CALL accept_or_reject_application(?,?,?,?)", [
			projectID,
			applicantID,
			year,
			accept
		]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const passApplication = async function (projectID, applicantID, result, user) {
	if (
		(user.type == "mentor" && checkProjectMentor(projectID, user.id)) ||
		(user.type == "orgAdmin" && checkProjectOrg(projectID, user.id)) ||
		(await user.type) == "superAdmin"
	) {
		const year = new Date().getFullYear();
		return dbQuery("CALL success_or_failure_application(?,?,?,?)", [
			projectID,
			applicantID,
			year,
			result
		]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const ApplicationResolvers = {
	applicant: (parent) =>
		dbQuery(
			"SELECT applicant_id FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)",
			[parent.applicant_id, parent.project_id]
		).then((data) => (data ? data : new GraphQLError("No such entry"))),
	project: (parent) =>
		dbQuery(
			"SELECT project_id FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)",
			[parent.applicant_id, parent.project_id]
		).then((data) => (data ? data : new GraphQLError("No such entry"))),
	accepted: (parent) =>
		dbQuery(
			"SELECT accepted FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)",
			[parent.applicant_id, parent.project_id]
		).then((data) =>
			data ? data.accepted : new GraphQLError("No such entry")
		),
	result: (parent) =>
		dbQuery(
			"SELECT result FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)",
			[parent.applicant_id, parent.project_id]
		).then((data) =>
			data ? data.result : new GraphQLError("No such entry")
		),
	absolute_year: (parent) =>
		dbQuery(
			"SELECT absolute_year FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)",
			[parent.applicant_id, parent.project_id]
		).then((data) =>
			data ? data.absolute_year : new GraphQLError("No such entry")
		),
	proposal: (parent) =>
		dbQuery(
			"SELECT proposal FROM Application WHERE Application.applicant_id = (?) AND Application.project_id = (?)",
			[parent.applicant_id, parent.project_id]
		).then((data) => (data ? data : new GraphQLError("No such entry")))
};

module.exports = {
	getApplications,
	addApplication,
	deleteApplication,
	acceptorRejectApplication,
	passApplication,
	updateProposal,
	ApplicationResolvers
};
