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
		projects: (parent, args) => { projects.getProjects(); },
	    project: (parent, args) => { return { "project_id": args.project_id }; },
		organizations: (parent, args) => organizations.getOrganizations(args.year),
		organization: (parent, args) => { return { "org_id": args.org_id }; },
	    applications: (parent, args) => { applications.getApplications(); },
	    mentors: (parent, args) => mentors.getMentors(args.year, args.org_id),
	    mentor: (parent, args) => { return { "mentor_id": args.mentor_id }; },
	    applicants: (parent, args) => applicants.getApplicants(args.year),
		applicant: (parent, args) => { return { "applicant_id": args.applicant_id }; } ,
		orgAdmin: (parent, args) => { return { "org_admin_id": args.org_admin_id }; } ,
	    orgAdmins: (parent, args) => orgAdmins.getOrgAdmins(args.org_id),
	    superAdmins: (parent, args) => superAdmins.getSuperAdmins(args.year),
	    superAdmin: (parent, args) => { return { "superAdmin_id": args.superAdmin_id }; }
	},
	Mutation: {
		addApplication: (parent, args) => applications.addApplication(args.project_id, args.application_id),
	    deleteApplication: (parent, args) => applications.deleteApplication(args.project_id, args.application_id),
	    acceptOrRejectApplication: (parent, args) => applications.acceptApplication(args.project_id, args.application_id, args.accept),
	    passOrFailApplication: (parent, args) => applications.passApplication(args.project_id, args.application_id, args.result),
		addProject: (parent, args) => { projects.addProject(); },
		deleteProject: (parent, args) => { projects.deleteProject(); },
		updateProject: (parent, args) => { projects.updateProject(); },
		addApplicant: (parent, args) => applicants.addApplicant(args.email, args.password, args.first_name, args.middle_name, args.last_name, args.applicant_year),
		deleteApplicant: (parent, args) => applicants.deleteApplicant(args.applicant_id),
		editApplicant: (parent, args) => applicants.editApplicant(args.applicant_id, args.email, args.password),
		addMentor: (parent, args) => mentors.addMentor(args.email, args.password, args.name, args.org_id),
		deleteMentor: (parent, args) => { mentors.deleteMentor(); },
		addOrganization: (parent, args) => organizations.addOrganization(args.org_name),
		deleteOrganization: (parent, args) => organizations.deleteOrganization(args.org_id),
		addOrgAdmin: (parent, args) => { orgAdmins.addOrgAdmin(); },
		deleteOrgAdmin: (parent, args) => { orgAdmins.deleteOrgAdmin(); }
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


