const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");

const checkOrgAdminOrg = (org_admin_id, org_id) => {
	return dbQuery("SELECT org_admin_id FROM org_admin_belongs_to WHERE org_admin_id = (?) AND org_id = (?)", [org_admin_id, org_id]).then((data) => {if(data) return true; return false;});
};

const checkOrgAdminMentor = (org_admin_id, mentor_id) => {
	return dbQuery("SELECT org_admin_id FROM org_admin_belongs_to INNER JOIN Mentor_belongs_to ON org_admin_belongs_to.org_id = Mentor_belongs_to.org_id WHERE org_admin_id = (?) AND mentor_id = (?)", [org_admin_id,mentor_id]).then((data) => { if(data) return true; return false;});
};

const getProjects = function (year, orgID, mentorID, applicantID) {
	if (
		orgID == null &&
		applicantID == null &&
		year == null &&
		mentorID != null
	) {
		return dbQuery("CALL get_projects_by_mentor(?)", [mentorID]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else if (
		mentorID == null &&
		applicantID == null &&
		year == null &&
		orgID != null
	) {
		return dbQuery("CALL get_projects_by_org(?)", [orgID]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else if (
		orgID == null &&
		mentorID == null &&
		year == null &&
		applicantID != null
	) {
		return dbQuery("CALL get_projects_by_applicant(?)", [applicantID]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else if (
		orgID == null &&
		mentorID == null &&
		applicantID == null &&
		year != null
	) {
		return dbQuery("CALL get_projects_by_year(?)", [year]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else if (
		orgID == null &&
		mentorID == null &&
		applicantID == null &&
		year == null
	) {
		return dbQuery("CALL get_projects_by_year(?)", [
			new Date().getFullYear(),
		]).then(
			(data) => data,
			(error) => new GraphQLError(error)
		);
	} else
		return new GraphQLError("Invalid arguments passed to Query projects");
};

const addProject = async function (
	name,
	work,
	deliverables,
	prerequisites,
	year,
	startDate,
	endDate,
	org_id,
	mentor_id,
	user
) {
	if(user.type == undefined || user.type == "applicant" || (user.type == "orgAdmin" && !(await checkOrgAdminOrg(user.id, org_id)))) {
		return new GraphQLError("Insufficient Permissions");
	}
	for(var i=0; i<mentor_id.length; i++) {
		if(!await checkOrgAdminMentor(user.id, mentor_id[i]))
		return new GraphQLError("Insufficient Permissions.");
	}
	if (year == null) year = new Date().getFullYear();
	const setAutoCommit = () => {
		return dbQuery("SET AUTOCOMMIT=0").then(
			() => startTransaction(),
			(err) => new GraphQLError(err)
		);
	};
	const startTransaction = () => {
		return dbQuery("BEGIN").then(
			() =>
				addProject(name, work, deliverables, year, startDate, endDate),
			(err) => new GraphQLError(err)
		);
	};
	const addProject = (name, work, deliverables, year, startDate, endDate) => {
		return dbQuery("CALL add_project(?,?,?,?,?,?)", [
			name,
			work,
			deliverables,
			year,
			startDate,
			endDate,
		]).then(
			(data) => addProjectToOrg(data[0].project_id, org_id),
			(error) => rollbackTransaction(error)
		);
	};
	const addProjectToOrg = (project_id, org_id) => {
		return dbQuery("CALL add_project_maintained_by(?,?,?)", [
			project_id,
			org_id,
			year,
		]).then(
			() => addMentorsToProject(project_id, mentor_id.length),
			(error) => rollbackTransaction(error)
		);
	};
	const addMentorsToProject = (project_id, mentor_id_length) => {
		if (mentor_id_length > 0)
			return dbQuery("CALL add_mentored_by(?,?,?)", [
				project_id,
				parseInt(mentor_id[mentor_id_length - 1]),
				year,
			]).then(
				() => addMentorsToProject(project_id, mentor_id_length - 1),
				(error) => rollbackTransaction(error)
			);
		else if (mentor_id_length == 0)
			return addPrerequisitesToProject(project_id, prerequisites.length);
	};
	const addPrerequisitesToProject = (project_id, prerequisites_length) => {
		if (prerequisites_length > 0)
			return dbQuery("CALL add_prerequisite(?,?)", [
				project_id,
				prerequisites[prerequisites_length - 1],
			]).then(
				() =>
					addPrerequisitesToProject(
						project_id,
						prerequisites_length - 1
					),
				(error) => rollbackTransaction(error)
			);
		else if (prerequisites_length == 0)
			return commitTransaction(project_id);
	};
	const commitTransaction = (project_id) => {
		return dbQuery("COMMIT").then(
			() => {
				return { project_id: project_id };
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

const deleteProject = function (projectID) {
	return dbQuery("CALL delete_project(?)", [projectID]).then(
		() => true,
		(error) => new GraphQLError(error)
	);
};

const updateProject = function (
	projectID,
	name,
	work,
	deliverables,
	startDate,
	endDate
) {
	const setAutoCommit = () => {
		return dbQuery("SET AUTOCOMMIT=0").then(
			() => startTransaction(),
			(err) => new GraphQLError(err)
		);
	};
	const startTransaction = () => {
		return dbQuery("BEGIN").then(
			() => updateName(name),
			(err) => new GraphQLError(err)
		);
	};
	const updateName = (name) => {
		if (name != null)
			return dbQuery(
				"UPDATE Project SET project_name = (?) WHERE project_id = ?",
				[name, projectID]
			).then(
				() => updateWork(work),
				(error) => rollbackTransaction(error)
			);
		else return updateWork(work);
	};
	const updateWork = (work) => {
		if (work != null)
			return dbQuery(
				"UPDATE Project SET work_to_be_done = (?) WHERE project_id = ?",
				[work, projectID]
			).then(
				() => updateWork(work),
				(error) => rollbackTransaction(error)
			);
		else return updateDeliverables(deliverables);
	};
	const updateDeliverables = (deliverables) => {
		if (deliverables != null)
			return dbQuery(
				"UPDATE Project SET deliverables = (?) WHERE project_id = ?",
				[deliverables, projectID]
			).then(
				() => updateStartDate(startDate),
				(error) => rollbackTransaction(error)
			);
		else return updateStartDate(startDate);
	};
	const updateStartDate = (startDate) => {
		if (startDate != null)
			return dbQuery(
				"UPDATE Project SET project_start_date = (?) WHERE project_id = ?",
				[startDate, projectID]
			).then(
				() => updateEndDate(endDate),
				(error) => rollbackTransaction(error)
			);
		else return updateEndDate(endDate);
	};
	const updateEndDate = (endDate) => {
		if (endDate != null)
			return dbQuery(
				"UPDATE Project SET project_end_date = (?) WHERE project_id = (?)",
				[endDate, projectID]
			).then(
				() => commitTransaction(projectID),
				(error) => rollbackTransaction(error)
			);
		else return commitTransaction(projectID);
	};
	const commitTransaction = (org_admin_id) => {
		return dbQuery("COMMIT").then(
			() => {
				return { org_admin_id: org_admin_id };
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

const addPrerequisites = function (projectID, prerequisites) {
	const startFunction = (prerequisites_length) => {
		if (prerequisites_length > 0)
			return dbQuery("CALL add_prerequisite(?,?)", [
				projectID,
				prerequisites[prerequisites_length - 1],
			]).then(
				() => startFunction(prerequisites - 1),
				(error) => new GraphQLError(error)
			);
		else if (prerequisites_length == 0) return projectID;
	};
	return startFunction(prerequisites.length);
};

const removePrerequisites = function (projectID, prerequisites) {
	const startFunction = (prerequisites_length) => {
		if (prerequisites_length > 0)
			return dbQuery("CALL delete_prerequisite(?,?)", [
				projectID,
				prerequisites[prerequisites_length - 1],
			]).then(
				() => startFunction(prerequisites - 1),
				(error) => new GraphQLError(error)
			);
		else if (prerequisites_length == 0) return projectID;
	};
	return startFunction(prerequisites.length);
};

const ProjectsResolvers = {
	id: (parent) =>
		dbQuery(
			"SELECT project_id FROM project WHERE Project.project_id = (?)",
			[parent.project_id]
		).then((data) =>
			data ? data.project_id : new GraphQLError("No such entry")
		),
	name: (parent) =>
		dbQuery(
			"SELECT project_name FROM project WHERE Project.project_id = (?)",
			[parent.project_id]
		).then((data) =>
			data ? data.project_name : new GraphQLError("No such entry")
		),
	work: (parent) =>
		dbQuery(
			"SELECT work_to_be_done FROM project WHERE Project.project_id = (?)",
			[parent.project_id]
		).then((data) =>
			data ? data.work_to_be_done : new GraphQLError("No such entry")
		),
	deliverables: (parent) =>
		dbQuery(
			"SELECT deliverables FROM project WHERE Project.project_id = (?)",
			[parent.project_id]
		).then((data) =>
			data ? data.deliverables : new GraphQLError("No such entry")
		),
	prerequisites: (parent) =>
		dbQuery("CALL get_prerequisites(?)", [parent.project_id]).then((data) =>
			data
				? data.map((value) => value.prerequisites)
				: new GraphQLError("No such entry")
		),
	absolute_year: (parent) =>
		dbQuery(
			"SELECT absolute_year FROM project WHERE Project.project_id = (?)",
			[parent.project_id]
		).then((data) =>
			data ? data.absolute_year : new GraphQLError("No such entry")
		),
	project_start_date: (parent) =>
		dbQuery(
			"SELECT project_start_date FROM project WHERE Project.project_id = (?)",
			[parent.project_id]
		).then((data) =>
			data ? data.project_start_date.toISOString().slice(0, 10) : new GraphQLError("No such entry")
		),
	project_end_date: (parent) =>
		dbQuery(
			"SELECT project_end_date FROM project WHERE Project.project_id = (?)",
			[parent.project_id]
		).then((data) =>
			data ? data.project_end_date.toISOString().slice(0, 10) : new GraphQLError("No such entry")
		),
	organization: (parent) =>
		dbQuery(
			"SELECT org_id FROM Maintained_By WHERE Maintained_By.project_id = (?)",
			[parent.project_id]
		).then((data) => (data ? data : new GraphQLError("No such entry"))),
	mentors: (parent) =>
		dbQuery("CALL get_mentors_by_project(?)", [
			parent.project_id,
		]).then((data) => (data ? data : new GraphQLError("No such entry"))),
	applications: (parent) =>
		dbQuery("CALL get_applications_by_project(?)", [
			parent.project_id,
		]).then((data) => (data ? data : new GraphQLError("No such entry"))),
};

module.exports = {
	getProjects,
	addProject,
	deleteProject,
	updateProject,
	addPrerequisites,
	removePrerequisites,
	ProjectsResolvers,
};
