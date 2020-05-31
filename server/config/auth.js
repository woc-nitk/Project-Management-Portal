const bcrypt = require("bcrypt");
const { GraphQLError } = require("graphql");
const { dbQuery } = require("./db");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const uuid = require("uuid");
const redisClient = require("redis").createClient();
env.config();

const redisSet = (auth, refresh) => {
	redisClient.hset(refresh, "token", auth);
	redisClient.expire(refresh, 60 * 60 * 24);
};

const hash = (password) => bcrypt.hashSync(password, 10);
const compare = (password, passwordHash) =>
	bcrypt.compareSync(password, passwordHash);

const generatejwt = (ID, type) =>
	jwt.sign({ id: ID, type: type }, process.env.APP_SECRET, {
		expiresIn: "1hr"
	});

const verifyjwt = (auth) => {
	const result = jwt.verify(
		auth,
		process.env.APP_SECRET,
		(error, decoded) => {
			if (error) return new GraphQLError(error);
			return decoded;
		}
	);
	return result;
};

const generateNewJwt = (refresh) => {
	return new Promise((resolve, reject) =>
		redisClient.hget(refresh, "token", (error, result) => {
			if (error) return reject(new GraphQLError(error));
			if(result == null) return reject(new GraphQLError("Refresh token expired."));
			const decoded = jwt.decode(result);
			const newjwt = generatejwt(
				decoded.id,
				decoded.type,
				(error, result) => {
					if (error) return new GraphQLError(error);
					return result;
				}
			);
			const newRefresh = uuid.v4();
			redisSet(newjwt, newRefresh);
			const data = { auth: newjwt, refresh: newRefresh, type: decoded.type, id: decoded.id };
			console.log(data);
			return resolve(data);
		})
	);
};

const login = (email, password) => {
	const year = new Date().getFullYear();
	const checkMentor = (email, password) => {
		return dbQuery(
			"SELECT mentor_id, mentor_password FROM Mentors WHERE email = (?) AND absolute_year = (?)",
			[email, year]
		).then(
			(data) => {
				if (data && compare(password, data.mentor_password)) {
					const jwt = generatejwt(data.mentor_id, "mentor");
					const refresh = uuid.v4();
					redisSet(jwt, refresh);
					return { auth: jwt, refresh: refresh, type: "mentor", id: data.mentor_id };
				} else return new GraphQLError("Invalid Credentials");
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
				if (data && compare(password, data.org_admin_password)) {
					const jwt = generatejwt(data.org_admin_id, "orgAdmin");
					const refresh = uuid.v4();
					redisSet(jwt, refresh);
					return { auth: jwt, refresh: refresh, type: "orgAdmin", id: data.org_admin_id };
				} else return checkMentor(email, password);
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
				if (data && compare(password, data.super_admin_password)) {
					const jwt = generatejwt(data.super_admin_id, "superAdmin");
					const refresh = uuid.v4();
					redisSet(jwt, refresh);
					return { auth: jwt, refresh: refresh, type: "superAdmin", id: data.super_admin_id };
				} else return checkOrgAdmin(email, password);
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
				if (data && compare(password, data.applicant_password)) {
					const jwt = generatejwt(data.applicant_id, "applicant");
					const refresh = uuid.v4();
					redisSet(jwt, refresh);
					return { auth: jwt, refresh: refresh, type: "applicant", id: data.applicant_id };
				} else return checkSuperAdmin(email, password);
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
	return dbQuery("CALL add_applicant(?,?,?,?,?,?,?)", [
		email,
		firstName,
		middleName,
		lastName,
		applicantYear,
		password,
		year
	]).then(
		(data) => {
			const authToken = generatejwt(data[0].applicant_id, "applicant");
			const refreshToken = uuid.v4();
			redisSet(authToken, refreshToken);
			return { auth: authToken, refresh: refreshToken };
		},
		(error) => new GraphQLError(error)
	);
};

module.exports = {
	login,
	signUp,
	hash,
	compare,
	generatejwt,
	verifyjwt,
	generateNewJwt
};
