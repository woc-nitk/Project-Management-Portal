const dbQuery = require("../config/db");
const { GraphQLError } = require("graphql");


const getMentors = function(year, orgID) {
	if(year == null) year = new Date().getFullYear();
	return dbQuery("CALL get_mentors_by_org(?)", [orgID]).then((data) => data);
};

const addMentor = function(email, name, password, org_id) {

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
