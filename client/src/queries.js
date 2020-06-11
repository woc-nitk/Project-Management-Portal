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
          name
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
      projects {
        id
        name
      }
    }
  }
`;

// Mutations

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
    $email: EmailAddress!
    $password: Password!
    $name: CleanString!
    $orgId: [ID!]!
  ) {
    addMentor(email: $email, password: $password, name: $name, org_id: $orgId) {
      name
      id
    }
  }
`;

export const addOrgAdminMutation = gql`
  mutation(
    $email: EmailAddress!
    $password: Password!
    $name: CleanString!
    $orgId: [ID!]!
  ) {
    addOrgAdmin(
      email: $email
      password: $password
      name: $name
      org_id: $orgId
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

export const signUpMutation = gql`
  mutation(
    $email: EmailAddress!
    $password: Password!
    $firstName: CleanString!
    $middleName: CleanString!
    $lastName: CleanString!
    $year: Int!
  ) {
    signUp(
      email: $email
      password: $password
      first_name: $firstName
      middle_name: $middleName
      last_name: $lastName
      applicant_year: $year
    ) {
      auth
      refresh
    }
  }
`;
