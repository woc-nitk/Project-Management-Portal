const bcrypt = require("bcrypt");
const { GraphQLError } = require("graphql");
const { dbQuery } = require("./db");

const hash = (password) => bcrypt.hashSync(password, 10);
const compare = (password, passwordHash) =>
  bcrypt.compareSync(password, passwordHash);

const login = (email, password) => {
  const year = new Date().getFullYear();
  const checkMentor = (email, password) => {
    return dbQuery(
      "SELECT mentor_id, mentor_password FROM Mentors WHERE email = (?) AND absolute_year = (?)",
      [email, year]
    ).then(
      (data) => {
        if (data && compare(password, data.mentor_password))
          return { id: data.mentor_id, type: "mentor" };
        else return new GraphQLError("Account not found");
      },
      (error) => new GraphQLError(error)
    );
  };
  const checkOrgAdmin = (email, password) => {
    return dbQuery(
      "SELECT org_admin_id, org_admin_password FROM Org_Admins WHERE email = (?) AND absolute_year = (?)",
      [email, year]
    ).then(
      (data) => {
        if (data && compare(password, data.org_admin_password))
          return { id: data.org_admin_id, type: "orgAdmin" };
        else return checkMentor(email, password);
      },
      (error) => new GraphQLError(error)
    );
  };
  const checkSuperAdmin = (email, password) => {
    return dbQuery(
      "SELECT super_admin_id, super_admin_password FROM Super_Admins WHERE email = (?) AND absolute_year = (?)",
      [email, year]
    ).then(
      (data) => {
        if (data && compare(password, data.super_admin_password))
          return { id: data.super_admin_id, type: "superAdmin" };
        else return checkOrgAdmin(email, password);
      },
      (error) => new GraphQLError(error)
    );
  };
  const checkApplicant = (email, password) => {
    return dbQuery(
      "SELECT applicant_id, applicant_password FROM Applicants WHERE email = (?) AND absolute_year = (?)",
      [email, year]
    ).then(
      (data) => {
        if (data && compare(password, data.applicant_password))
          return { id: data.applicant_id, type: "applicant" };
        else return checkSuperAdmin(email, password);
      },
      (error) => new GraphQLError(error)
    );
  };
  return checkApplicant(email, password);
};

const signUp = (
  email,
  password,
  firstName,
  middleName,
  lastName,
  applicantYear
) => {
  const year = new Date().getFullYear();
  password = hash(password);
  const val = dbQuery("CALL add_applicant(?,?,?,?,?,?,?)", [
    email,
    firstName,
    middleName,
    lastName,
    applicantYear,
    password,
    year,
  ]).then(
    (data) => data[0],
    (error) => new GraphQLError(error)
  );
  return { id: val, type: "applicant" };
};

module.exports = { login, signUp, hash, compare };
