import { gql } from "apollo-boost";

// Queries

export const getApplicantQuery = gql`
  query($id: ID!){
    applicant(applicant_id: $id){
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
    $first_name: CleanString!
    $middle_name: CleanString!
    $last_name: CleanString!
    $applicant_year: Int!
  ) {
    signUp(
      email: $email
      password: $password
      first_name: $first_name
      middle_name: $middle_name
      last_name: $last_name
      applicant_year: $applicant_year
    ) {
      id
      type
      auth
      refresh
    }
  }
`;
