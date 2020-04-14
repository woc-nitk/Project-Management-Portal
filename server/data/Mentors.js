const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");


const getMentors = function(year, orgID) {
	if(year == null) year = new Date().getFullYear();
	return dbQuery("CALL get_mentors_by_org(?)", [orgID]).then((data) => data);
};

const addMentor = function(email, name, password, org_id) {
	const year = new Date().getFullYear();
	const setAutoCommit = dbQuery("SET AUTOCOMMIT=0;").then(() => startTransaction());
	const startTransaction = () => dbQuery("START TRANSACTION;").then(() => mentor(), () => new GraphQLError("Failed to start transaction"));
	const mentor = () => dbQuery("CALL add_mentor(?,?,?,?);", [email, name, password, year]).then((data) => mentorOrgDetails(data[0]), (error) => rollbackTransaction(error));
	const mentorOrgDetails = (data) => dbQuery("CALL add_mentor_belongs_to(?,?,?);", [data.mentor_id, org_id, year]).then(() => commitTransaction(data), () => rollbackTransaction());
	const commitTransaction = (data) => dbQuery("COMMIT;").then((data) => data, (error) => new GraphQLError(error));
	const rollbackTransaction = (error) => dbQuery("ROLLBACK;").then((error) => new GraphQLError(error));
	return setAutoCommit;
};

const deleteMentor = function(mentorID) {

};

const MentorResolvers = {
	id: (parent) => dbQuery("SELECT mentor_id FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data ? data.mentor_id : new GraphQLError("No such entry")),  
	email: (parent) => dbQuery("SELECT email FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data ? data.email : new GraphQLError("No such entry")), 
	name: (parent) => dbQuery("SELECT mentor_name FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data ? data.mentor_name  : new GraphQLError("No such entry")),
	absolute_year: (parent) => dbQuery("SELECT absolute_year FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data ? data.absolute_year : new GraphQLError("No such entry")),
	organization: (parent) => dbQuery("CALL get_mentors_orgs(?)", [parent.mentor_id]).then((data) => data ? data : new GraphQLError("No such entry")),
	projects: (parent) => dbQuery("CALL get_projects_by_mentor(?)", [parent.mentor_id]).then((data) => data? data : new GraphQLError("No such entry")),
};

module.exports = {getMentors, addMentor, deleteMentor, MentorResolvers};
