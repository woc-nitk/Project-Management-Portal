import { gql } from "apollo-boost";

// Queries

export const getProjectApplicationsQuery = gql`
  query($id: ID!) {
    project(project_id: $id) {
      id
      name
      project_start_date
      project_end_date
      applications {
        applicant {
          id
          first_name
        }
        proposal
      }
    }
  }
`;

export const getOrgMentorsQuery = gql`
  query($org_id: ID!) {
    mentors(org_id: $org_id) {
      name
      id
    }
  }
`;

export const getApplicantQuery = gql`
  query($id: ID!) {
    applicant(applicant_id: $id) {
      id
      first_name
      middle_name
      last_name
      email
      applicant_year
      applications {
        project {
          id
          name
          organization {
            name
          }
        }
        accepted
        result
        proposal
      }
    }
  }
`;

export const getMentorQuery = gql`
  query($id: ID!) {
    mentor(mentor_id: $id) {
      id
      name
      email
      organization {
        name
        id
      }
      projects {
        id
        name
      }
    }
  }
`;

export const getOrgAdminQuery = gql`
  query($id: ID!) {
    orgAdmin(org_admin_id: $id) {
      id
      name
      email
      organization {
        id
        name
        projects {
          id
          name
        }
      }
    }
  }
`;

export const getSuperAdminQuery = gql`
  query($id: ID!) {
    superAdmin(super_admin_id: $id) {
      id
      name
      email
    }
  }
`;

export const getProjectsQuery = gql`
  {
    projects {
      organization {
        id
        name
      }
      id
      name
      work
    }
  }
`;

export const getOrganizationsQuery = gql`
  {
    organizations {
      id
      name
      description
    }
  }
`;

export const getProjectQuery = gql`
  query($id: ID!) {
    project(project_id: $id) {
      id
      name
      work
      deliverables
      prerequisites
      organization {
        name
        id
      }
      mentors {
        id
        name
      }
    }
  }
`;

export const getOrganizationQuery = gql`
  query($org_id: ID!) {
    organization(org_id: $org_id) {
      id
      name
      description
      projects {
        id
        name
        work
      }
    }
  }
`;

// Mutations

export const addProjectMutation = gql`
  mutation(
    $name: CleanString!
    $work: CleanString!
    $deliverables: CleanString!
    $prerequisites: [CleanString!]!
    $absolute_year: Year!
    $project_start_date: Date!
    $project_end_date: Date!
    $org_id: ID!
    $mentor_ids: [ID!]!
  ) {
    addProject(
      name: $name
      work: $work
      deliverables: $deliverables
      prerequisites: $prerequisites
      absolute_year: $absolute_year
      project_start_date: $project_start_date
      project_end_date: $project_end_date
      org_id: $org_id
      mentor_ids: $mentor_ids
    ) {
      name
    }
  }
`;

export const passFailApplicationMutation = gql`
  mutation($p_id: ID!, $appl_id: ID!, $pass: Boolean!) {
    passOrFailApplication(
      project_id: $p_id
      applicant_id: $appl_id
      result: $pass
    ) {
      accepted
      result
    }
  }
`;

export const acceptRejectApplicationMutation = gql`
  mutation($p_id: ID!, $appl_id: ID!, $accept: Boolean!) {
    acceptOrRejectApplication(
      project_id: $p_id
      applicant_id: $appl_id
      accept: $accept
    ) {
      accepted
      result
    }
  }
`;

export const addMentorMutation = gql`
  mutation(
    $regNum: ID!
    $email: EmailAddress!
    $password: Password!
    $name: CleanString!
    $orgId: [ID!]!
  ) {
    addMentor(reg_num:$regNum, email: $email, password: $password, name: $name, org_id: $orgId) {
      name
      id
    }
  }
`;

export const addOrgAdminMutation = gql`
  mutation(
    $regNum: ID!
    $email: EmailAddress!
    $password: Password!
    $name: CleanString!
    $orgId: ID!
    $absolute_year: Year!
  ) {
    addOrgAdmin(
      reg_num:$regNum,
      email: $email
      password: $password
      name: $name
      org_id: $orgId
      absolute_year: $absolute_year
    ) {
      name
      id
    }
  }
`;

export const addOrgMutation = gql`
  mutation($orgName: CleanString!) {
    addOrganization(org_name: $orgName) {
      id
      name
    }
  }
`;

export const addApplicationMutation = gql`
  mutation($project_id: ID!, $applicant_id: ID!, $proposal: URL!) {
    addApplication(
      project_id: $project_id
      applicant_id: $applicant_id
      proposal: $proposal
    ) {
      proposal
    }
  }
`;

export const updateApplcation = gql`
  mutation($project_id: ID!, $applicant_id: ID!, $proposal: URL!) {
    updateProposal(
      project_id: $project_id
      applicant_id: $applicant_id
      proposal: $proposal
    ) {
      proposal
    }
  }
`;

export const refreshMutation = gql`
  mutation($refresh: String!) {
    renewAuth(refresh: $refresh) {
      id
      type
      auth
      refresh
    }
  }
`;

export const loginMutation = gql`
  mutation($email: EmailAddress!, $password: Password!) {
    login(email: $email, password: $password) {
      id
      type
      auth
      refresh
    }
  }
`;

export const logoutMutation = gql`
  mutation($refresh: String!) {
    logout(refresh: $refresh) 
  }
`;

export const signUpMutation = gql`
  mutation(
    $regNum: ID!
    $email: EmailAddress!
    $password: Password!
    $firstName: CleanString!
    $middleName: CleanString!
    $lastName: CleanString!
  ) {
    signUp(
      reg_num: $regNum
      email: $email
      password: $password
      first_name: $firstName
      middle_name: $middleName
      last_name: $lastName
    ) 
  }
`;

export const changePasswordMutation = gql`
  mutation($refresh: String!, $oldPassword: Password!, $newPassword: Password!) {
    changePassword(refresh: $refresh, oldPassword: $oldPassword, newPassword: $newPassword)  
  }
`;