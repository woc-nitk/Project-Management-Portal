const dbQuery = require("../config/db");
const { GraphQLError } = require("graphql");


const getMentors = function(year, orgID) {
	if(year == null) year = new Date().getFullYear();
	return dbQuery("CALL get_mentors_by_org(?,?)", [orgID, year]).then((data) => data);
};

const addMentor = function(email, name, password, org_id) {

};

const deleteMentor = function(mentorID) {

};

const MentorResolvers = {
	id: (parent) => parent.mentor_id, 
	email: (parent) => dbQuery("SELECT email FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data.email), 
	name: (parent) => dbQuery("SELECT mentor_name FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data.mentor_name),
	absolute_year: (parent) => dbQuery("SELECT absolute_year FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data.absolute_year),
	organization: (parent) => dbQuery("SELECT org_id FROM Mentor_belongs_to WHERE Mentors.mentor_id = (?) AND Mentors.absolute_year = (?)", [parent.mentor_id, parent.absolute_year]).then((data) => data),
	projects: (parent) => dbQuery("SELECT project_id FROM Mentored_by WHERE Mentors.mentor_id = (?) AND Mentors.absolute_year = (?)", [parent.mentor_id, parent.absolute_year]).then((data) => data),
};

module.exports = {getMentors, addMentor, deleteMentor, MentorResolvers};
