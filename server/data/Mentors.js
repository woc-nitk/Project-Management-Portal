const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");
const auth = require("../config/auth");

const checkOrgAdminOrg = (org_admin_id, org_id) => {
	return dbQuery("SELECT org_admin_id FROM org_admin_belongs_to WHERE org_admin_id = (?) AND org_id = (?)", [org_admin_id, org_id]).then((data) => {if(data) return true; return false;});
};

const checkOrgAdminMentor = (org_admin_id, mentor_id) => {
	return dbQuery("SELECT org_admin_id FROM org_admin_belongs_to INNER JOIN mentor_belongs_to ON org_admin_belongs_to.org_id = mentor_belongs_to.org_id WHERE org_admin_id = (?) AND mentor_id = (?)", [org_admin_id,mentor_id]).then((data) => { if(data) return true; return false;});
};

const checkOrgAdminProject = (org_admin_id, project_id) => {
	const check = (project_id_length) => { if(project_id_length > 0) return dbQuery("SELECT org_admin_id FROM org_admin_belongs_to INNER JOIN Maintained_By ON org_admin_belongs_to.org_id = maintained_By.org_id WHERE org_admin_id = (?) AND project_id = (?)", [org_admin_id, project_id[project_id_length-1]]).then((data) => { if(data) return check(project_id_length-1); return false;}); else if(project_id_length == 0) return true; };
	return check(project_id.length);
};

const getMentors = function (year, orgID, user) {
	if(user.type == "orgAdmin" || user.type == "superAdmin") {
		if (year == null) year = new Date().getFullYear();
		return dbQuery("CALL get_mentors_by_org(?)", [orgID]).then((data) => data);
	}
	else return new GraphQLError("Insufficient permissions");
};

const addMentor = async function (reg_num, email, password, name, org_id, user) {
	if( !((user.type == "orgAdmin" && org_id.length == 1 && await checkOrgAdminOrg(user.id, org_id)) || user.type == "superAdmin")) {
		console.log(user);
		return new GraphQLError("Insufficient permissions.");
	}
	const year = new Date().getFullYear();
	password = auth.hash(password);
	const setAutoCommit = () => {
		return dbQuery("SET AUTOCOMMIT=0").then(
			() => startTransaction(),
			(err) => new GraphQLError(err)
		);
	};
	const startTransaction = () => {
		return dbQuery("BEGIN").then(
			() => addMentorToMentors(email, name, password, year),
			(err) => new GraphQLError(err)
		);
	};
	const addMentorToMentors = (email, name, password, year) => {
		return dbQuery("CALL add_mentor(?,?,?,?,?)", [
			reg_num,
			email,
			name,
			password,
			year
		]).then(
			(data) => addMentorOrgs(data[0].mentor_id, org_id.length),
			(error) => rollbackTransaction(error)
		);
	};
	const addMentorOrgs = (mentor_id, org_id_length) => {
		if (org_id_length > 0)
			return dbQuery("CALL add_mentor_belongs_to(?,?,?)", [
				mentor_id,
				parseInt(org_id[org_id_length - 1]),
				new Date().getFullYear()
			]).then(
				() => addMentorOrgs(mentor_id, org_id_length - 1),
				(error) => rollbackTransaction(error)
			);
		else if (org_id_length == 0) return commitTransaction(mentor_id);
	};
	const commitTransaction = (mentor_id) => {
		return dbQuery("COMMIT").then(
			() => {
				return { mentor_id: mentor_id };
			},
			(error) => new GraphQLError(error)
		);
	};
	const rollbackTransaction = (error) => {
		return dbQuery("ROLLBACK").then(
			() => new GraphQLError(error),
			(error) => new GraphQLError(error)
		);
	};
	return setAutoCommit();
};

const deleteMentor = async function (mentorID, user) {
	if(!((user.type == "orgAdmin" && await checkOrgAdminMentor(user.id, mentorID)) || user.type == "superAdmin")) {
		return new GraphQLError("Insufficient permissions.");
	}
	return dbQuery("CALL delete_mentor(?)", [mentorID]).then(
		() => true,
		(error) => new GraphQLError(error)
	);
};

const addMentorToOrg = async function (mentor_id, org_id, user) {
	if(!((user.type == "orgAdmin" && org_id.length == 1 && await checkOrgAdminOrg(user.id,org_id)) || user.type == "superAdmin")) {
		return new GraphQLError("Insufficient permissions.");
	}
	const startFunction = (org_id_length) => {
		if (org_id_length > 0)
			return dbQuery("CALL add_mentor_belongs_to(?,?)", [
				mentor_id,
				parseInt(org_id[org_id_length - 1])
			]).then(
				() => startFunction(org_id_length - 1),
				(error) => new GraphQLError(error)
			);
		else if (org_id_length == 0) return mentor_id;
	};
	return startFunction(org_id.length);
};

const removeMentorFromOrg = async function (mentor_id, org_id, user) {
	if(!((user.type == "orgAdmin" && org_id.length == 1 && await checkOrgAdminOrg(user.id,org_id)) || user.type == "superAdmin")) {
		return new GraphQLError("Insufficient permissions.");
	}
	const startFunction = (org_id_length) => {
		if (org_id_length > 0)
			return dbQuery("CALL delete_mentor_belongs_to(?,?)", [
				mentor_id,
				parseInt(org_id[org_id_length - 1])
			]).then(
				() => startFunction(org_id_length - 1),
				(error) => new GraphQLError(error)
			);
		else if (org_id_length == 0) return mentor_id;
	};
	return startFunction(org_id.length);
};

const addMentorToProject = async function (mentor_id, project_id, user) {
	if(!((user.type == "orgAdmin" && await checkOrgAdminProject(user.id,project_id)) || user.type == "superAdmin")) {
		return new GraphQLError("Insufficient permissions.");
	}
	const startFunction = (project_id_length) => {
		if (project_id_length > 0)
			return dbQuery("CALL add_mentored_by(?,?)", [
				mentor_id,
				parseInt(project_id[project_id_length - 1])
			]).then(
				() => startFunction(project_id_length - 1),
				(error) => new GraphQLError(error)
			);
		else if (project_id_length == 0) return mentor_id;
	};
	return startFunction(project_id.length);
};

const removeMentorFromProject = async function (mentor_id, project_id, user) {
	if(!((user.type == "orgAdmin" && await checkOrgAdminProject(user.id,project_id)) || user.type == "superAdmin")) {
		return new GraphQLError("Insufficient permissions.");
	}
	const startFunction = (project_id_length) => {
		if (project_id_length > 0)
			return dbQuery("CALL delete_mentored_by(?,?)", [
				mentor_id,
				parseInt(project_id[project_id_length - 1])
			]).then(
				() => startFunction(project_id_length - 1),
				(error) => new GraphQLError(error)
			);
		else if (project_id_length == 0) return mentor_id;
	};
	return startFunction(project_id.length);
};

const MentorResolvers = {
	id: (parent) =>
		dbQuery("SELECT mentor_id FROM mentors WHERE Mentors.mentor_id = (?)", [
			parent.mentor_id
		]).then((data) =>
			data ? data.mentor_id : new GraphQLError("No such entry")
		),
	email: (parent) =>
		dbQuery("SELECT email FROM mentors WHERE Mentors.mentor_id = (?)", [
			parent.mentor_id
		]).then((data) =>
			data ? data.email : new GraphQLError("No such entry")
		),
	name: (parent) =>
		dbQuery(
			"SELECT mentor_name FROM mentors WHERE Mentors.mentor_id = (?)",
			[parent.mentor_id]
		).then((data) =>
			data ? data.mentor_name : new GraphQLError("No such entry")
		),
	absolute_year: (parent) =>
		dbQuery(
			"SELECT absolute_year FROM mentors WHERE Mentors.mentor_id = (?)",
			[parent.mentor_id]
		).then((data) =>
			data ? data.absolute_year : new GraphQLError("No such entry")
		),
	organization: (parent) =>
		dbQuery("CALL get_mentors_orgs(?)", [parent.mentor_id]).then((data) =>
			data ? data : new GraphQLError("No such entry")
		),
	projects: (parent) =>
		dbQuery("CALL get_projects_by_mentor(?)", [
			parent.mentor_id
		]).then((data) => (data ? data : new GraphQLError("No such entry")))
};

module.exports = {
	getMentors,
	addMentor,
	deleteMentor,
	addMentorToOrg,
	removeMentorFromOrg,
	addMentorToProject,
	removeMentorFromProject,
	MentorResolvers
};
