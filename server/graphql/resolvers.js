const applicants = require("../data/Applicants");
const applications = require("../data/Application");
const mentors = require("../data/Mentors");
const orgAdmins = require("../data/OrgAdmin");
const organizations = require("../data/Organization");
const projects = require("../data/Projects");
const superAdmins = require("../data/SuperAdmin");
const customTypes = require("./customTypes");
const auth = require("../config/auth");
const { GraphQLError } = require("graphql");

const resolvers = {
	Query: {
		projects: (parent, args, context) =>
			projects.getProjects(
				args.absolute_year,
				args.org_id,
				args.mentor_id,
				args.applicant_id,
				context.user
			),
		project: (parent, args) => {
			return { project_id: args.project_id };
		},
		organizations: (parent, args) =>
			organizations.getOrganizations(args.absolute_year),
		organization: (parent, args) => {
			return { org_id: args.org_id };
		},
		applications: (parent, args, context) =>
			applications.getApplications(
				args.absolute_year,
				args.project_id,
				args.org_id,
				args.applicant_id,
				context.user
			),
		mentors: (parent, args, context) =>
			mentors.getMentors(args.absolute_year, args.org_id, context.user),
		mentor: (parent, args) => {
			return { mentor_id: args.mentor_id };
		},
		applicants: (parent, args, context) =>
			applicants.getApplicants(args.absolute_year, context.user),
		applicant: (parent, args, context) => {
			if (
				context.user == undefined ||
				(context.user.type == "applicant" &&
					args.applicant_id != context.user.id)
			)
				return new GraphQLError("Insufficient permissions");

			return { applicant_id: args.applicant_id };
		},
		orgAdmin: (parent, args) => {
			return { org_admin_id: args.org_admin_id };
		},
		orgAdmins: (parent, args) => orgAdmins.getOrgAdmins(args.org_id),
		superAdmins: (parent, args) =>
			superAdmins.getSuperAdmins(args.absolute_year),
		superAdmin: (parent, args) => {
			return { super_admin_id: args.super_admin_id };
		},
	},
	Mutation: {
		login: (parent, args) => auth.login(args.email, args.password),
		signUp: (parent, args) =>
			auth.signUp(
				args.reg_num,
				args.email,
				args.password,
				args.first_name,
				args.middle_name,
				args.last_name
			),
		logout: (parent, args) => auth.logOut(args.refresh),
		changePassword: (parent, args) => auth.changePassword(args.refresh, args.oldPassword, args.newPassword),
		renewAuth: (parent, args) => auth.generateNewJwt(args.refresh),
		addApplication: (parent, args, context) =>
			applications.addApplication(
				args.project_id,
				args.applicant_id,
				args.proposal,
				context.user
			),
		deleteApplication: (parent, args, context) =>
			applications.deleteApplication(
				args.project_id,
				args.applicant_id,
				context.user
			),
		acceptOrRejectApplication: (parent, args, context) =>
			applications.acceptorRejectApplication(
				args.project_id,
				args.applicant_id,
				args.accept,
				context.user
			),
		passOrFailApplication: (parent, args, context) =>
			applications.passApplication(
				args.project_id,
				args.applicant_id,
				args.result,
				context.user
			),
		addProject: (parent, args, context) =>
			projects.addProject(
				args.name,
				args.work,
				args.deliverables,
				args.prerequisites,
				args.absolute_year,
				args.project_start_date,
				args.project_end_date,
				args.org_id,
				args.mentor_ids,
				context.user
			),
		deleteProject: (parent, args, context) =>
			projects.deleteProject(args.project_id, context.user),
		updateProject: (parent, args, context) =>
			projects.updateProject(
				args.project_id,
				args.name,
				args.work,
				args.deliverables,
				args.project_start_date,
				args.project_end_date,
				context.user
			),
		addApplicant: (parent, args, context) =>
			applicants.addApplicant(
				args.reg_num,
				args.email,
				args.password,
				args.first_name,
				args.middle_name,
				args.last_name,
				context.user
			),
		deleteApplicant: (parent, args, context) =>
			applicants.deleteApplicant(args.applicant_id, context.user),
		editApplicant: (parent, args, context) =>
			applicants.editApplicant(
				args.applicant_id,
				args.email,
				args.password,
				context.user
			),
		addMentor: (parent, args, context) =>
			mentors.addMentor(
				args.reg_num,
				args.email,
				args.password,
				args.name,
				args.org_id,
				context.user
			),
		deleteMentor: (parent, args, context) =>
			mentors.deleteMentor(args.mentor_id, context.user),
		addOrganization: (parent, args, context) =>
			organizations.addOrganization(args.org_name, args.description, context.user),
		deleteOrganization: (parent, args, context) =>
			organizations.deleteOrganization(args.org_id, context.user),
		addOrgAdmin: (parent, args, context) =>
			orgAdmins.addOrgAdmin(
				args.reg_num,
				args.email,
				args.password,
				args.name,
				args.org_id,
				args.absolute_year,
				context.user
			),
		deleteOrgAdmin: (parent, args, context) =>
			orgAdmins.deleteOrgAdmin(args.org_admin_id, context.user),
		addMentorToOrg: (parent, args, context) =>
			mentors.addMentorToOrg(args.mentor_id, args.org_id, context.user),
		removeMentorFromOrg: (parent, args, context) =>
			mentors.removeMentorFromOrg(
				args.mentor_id,
				args.org_id,
				context.user
			),
		addMentorToProject: (parent, args, context) =>
			mentors.addMentorToProject(
				args.mentor_id,
				args.project_id,
				context.user
			),
		removeMentorFromProject: (parent, args, context) =>
			mentors.removeMentorFromProject(
				args.mentor_id,
				args.project_id,
				context.user
			),
		addPrerequisites: (parent, args, context) =>
			projects.addPrerequisites(
				args.project_id,
				args.prerequisites,
				context.user
			),
		removePrerequisites: (parent, args, context) =>
			projects.removePrerequisites(
				args.project_id,
				args.prerequisites,
				context.user
			),
		updateProposal: (parent, args, context) =>
			applications.updateProposal(
				args.applicant_id,
				args.project_id,
				args.proposal,
				context.user
			),
	},
	Applicant: applicants.ApplicantResolvers,
	Application: applications.ApplicationResolvers,
	Mentor: mentors.MentorResolvers,
	OrgAdmin: orgAdmins.OrgAdminResolvers,
	Organization: organizations.OrganizationResolvers,
	Project: projects.ProjectsResolvers,
	SuperAdmin: superAdmins.SuperAdminResolvers,
	Year: customTypes.Year,
	CleanString: customTypes.CleanString,
	EmailAddress: customTypes.EmailAddress,
	Password: customTypes.Password,
	Date: customTypes.Date,
	URL: customTypes.URL,
};

module.exports = { resolvers };
