const applicants = require("../data/Applicants");
const applications = require("../data/Application");
const mentors = require("../data/Mentors");
const orgAdmins = require("../data/OrgAdmin");
const organizations = require("../data/Organization");
const projects = require("../data/Projects");
const superAdmins = require("../data/SuperAdmin");
const customTypes = require("./customTypes");
const auth = require("../config/auth");

const resolvers = {
  Query: {
    projects: (parent, args) =>
      projects.getProjects(
        args.absolute_year,
        args.org_id,
        args.mentor_id,
        args.applicant_id
      ),
    project: (parent, args) => {
      return { project_id: args.project_id };
    },
    organizations: (parent, args) =>
      organizations.getOrganizations(args.absolute_year),
    organization: (parent, args) => {
      return { org_id: args.org_id };
    },
    applications: (parent, args) =>
      applications.getApplications(
        args.absolute_year,
        args.project_id,
        args.org_id,
        args.applicant_id
      ),
    mentors: (parent, args) =>
      mentors.getMentors(args.absolute_year, args.org_id),
    mentor: (parent, args) => {
      return { mentor_id: args.mentor_id };
    },
    applicants: (parent, args) => applicants.getApplicants(args.absolute_year),
    applicant: (parent, args) => {
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
        args.email,
        args.password,
        args.first_name,
        args.middle_name,
        args.last_name,
        args.applicant_year
      ),
    addApplication: (parent, args) =>
      applications.addApplication(args.project_id, args.application_id),
    deleteApplication: (parent, args) =>
      applications.deleteApplication(args.project_id, args.application_id),
    acceptOrRejectApplication: (parent, args) =>
      applications.acceptApplication(
        args.project_id,
        args.application_id,
        args.accept
      ),
    passOrFailApplication: (parent, args) =>
      applications.passApplication(
        args.project_id,
        args.application_id,
        args.result
      ),
    addProject: (parent, args) =>
      projects.addProject(
        args.name,
        args.work,
        args.deliverables,
        args.prerequisites,
        args.absolute_year,
        args.project_start_date,
        args.project_end_date,
        args.org_id,
        args.mentor_ids
      ),
    deleteProject: (parent, args) => projects.deleteProject(args.project_id),
    updateProject: (parent, args) => {
      projects.updateProject(
        args.project_id,
        args.name,
        args.work,
        args.deliverables,
        args.project_start_date,
        args.project_end_date
      );
    },
    addApplicant: (parent, args) =>
      applicants.addApplicant(
        args.email,
        args.password,
        args.first_name,
        args.middle_name,
        args.last_name,
        args.applicant_year
      ),
    deleteApplicant: (parent, args) =>
      applicants.deleteApplicant(args.applicant_id),
    editApplicant: (parent, args) =>
      applicants.editApplicant(args.applicant_id, args.email, args.password),
    addMentor: (parent, args) =>
      mentors.addMentor(args.email, args.password, args.name, args.org_id),
    deleteMentor: (parent, args) => mentors.deleteMentor(args.mentor_id),
    addOrganization: (parent, args) =>
      organizations.addOrganization(args.org_name),
    deleteOrganization: (parent, args) =>
      organizations.deleteOrganization(args.org_id),
    addOrgAdmin: (parent, args) =>
      orgAdmins.addOrgAdmin(
        args.email,
        args.password,
        args.name,
        args.org_id,
        args.absolute_year
      ),
    deleteOrgAdmin: (parent, args) =>
      orgAdmins.deleteOrgAdmin(args.org_admin_id),
    addMentorToOrg: (parent, args) =>
      mentors.addMentorToOrg(args.mentor_id, args.org_id),
    removeMentorFromOrg: (parent, args) =>
      mentors.removeMentorFromOrg(args.mentor_id, args.org_id),
    addMentorToProject: (parent, args) =>
      mentors.addMentorToProject(args.mentor_id, args.project_id),
    removeMentorFromProject: (parent, args) =>
      mentors.removeMentorFromProject(args.mentor_id, args.project_id),
    addPrerequisites: (parent, args) =>
      projects.addPrerequisites(args.project_id, args.prerequisites),
    removePrerequisites: (parent, args) =>
      projects.removePrerequisites(args.project_id, args.prerequisites),
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
};

module.exports = { resolvers };
