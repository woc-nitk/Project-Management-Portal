const applicants = require("../data/Applicants");
const applications = require("../data/Application");
const mentors = require("../data/Mentors");
const orgAdmins = require("../data/OrgAdmin");
const organizations = require("../data/Organization");
const projects = require("../data/Projects");
const superAdmins = require("../data/SuperAdmin");
const customTypes = require("./customTypes");

const resolvers = {
	Query: {
		projects: (parent, args, context, info) => { projects.getProjects(); },
	    project: (parent, args, context, info) => { return { "project_id": args.project_id }; },
		organizations: (parent, args, context, info) => { organizations.getOrganizations(); },
		organization: (parent, args, context, info) => { return { "org_id": args.org_id }; },
	    applications: (parent, args, context, info) => { applications.getApplications(); },
	    mentors: (parent, args, context, info) => mentors.getMentors(args.year, args.org_id),
	    mentor: (parent, args, context, info) => { return { "mentor_id": args.mentor_id }; },
	    applicants: (parent, args, context, info) => applicants.getApplicants(args.year),
	    applicant: (parent, args, context, info) => { return { "applicant_id": args.applicant_id }; } ,
	    orgAdmins: (parent, args, context, info) => { orgAdmins.getOrgAdmins(); },
	    superAdmins: (parent, args, context, info) => superAdmins.getSuperAdmins(args.year),
	    superAdmin: (parent, args, context, info) => { return { "superAdmin_id": args.superAdmin_id }; }
	},
	Mutation: {
		addApplication: (parent, args, context, info) => { applications.addApplication(); },
	    deleteApplication: (parent, args, context, info) => { applications.deleteApplication(); },
	    acceptApplication: (parent, args, context, info) => { applications.acceptApplication(); },
	    passApplication: (parent, args, context, info) => { applications.passApplication(); },
		addProject: (parent, args, context, info) => { projects.addProject(); },
		deleteProject: (parent, args, context, info) => { projects.deleteProject(); },
		updateProject: (parent, args, context, info) => { projects.updateProject(); },
		addApplicant: (parent, args, context, info) => applicants.addApplicant(args.email, args.password, args.first_name, args.middle_name, args.last_name, args.applicant_year),
		deleteApplicant: (parent, args, context, info) => applicants.deleteApplicant(args.applicant_id),
		editApplicant: (parent, args, context, info) => applicants.editApplicant(args.applicant_id, args.email, args.password),
		addMentor: (parent, args, context, info) => { mentors.addMentor(); },
		deleteMentor: (parent, args, context, info) => { mentors.deleteMentor(); },
		addOrganization: (parent, args, context, info) => { organizations.addOrganization(); },
		deleteOrganization: (parent, args, context, info) => { organizations.deleteOrganization(); },
		addOrgAdmin: (parent, args, context, info) => { orgAdmins.addOrgAdmin(); },
		deleteOrgAdmin: (parent, args, context, info) => { orgAdmins.deleteOrgAdmin(); }
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
};

module.exports = { resolvers };


