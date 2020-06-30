const bcrypt = require("bcrypt");
const { GraphQLError } = require("graphql");
const { dbQuery } = require("./db");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const uuid = require("uuid");
env.config();


const redisClient = require("redis").createClient(
	{
		port: process.env.REDIS_PORT,
		host: process.env.REDIS_HOST,
		password: process.env.REDIS_PASSWORD
	}
);

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
	reg_num,
	email,
	password,
	firstName,
	middleName,
	lastName,
	applicantYear
) => {
	const year = new Date().getFullYear();
	return dbQuery("CALL add_applicant(?,?,?,?,?,?,?,?)", [
		reg_num,
		email,
		firstName,
		middleName,
		lastName,
		applicantYear,
		hash(password),
		year
	]).then(
		(data) => {
			return true;
		},
		(error) => new GraphQLError(error)
	);
};

const logOut = (refresh) => {
	return redisClient.hdel(refresh, "token", (error, result) => {
		if(error) return new GraphQLError(error);
		return result;
	});
};

const changePassword = (refresh, oldPassword, newPassword) => {
	return new Promise((resolve, reject) =>
		redisClient.hget(refresh, "token", (error, result) => {
			if (error) return reject(new GraphQLError(error));
			if(result == null) return reject(new GraphQLError("Refresh token expired."));
			const deets = jwt.decode(result);
			const year = new Date().getFullYear();
			if(deets.type == "applicant") {
				return resolve(dbQuery(
					"SELECT applicant_password FROM Applicants WHERE applicant_id = (?) AND absolute_year = (?)",
					[deets.id, year]
				).then(
					(data) => {
						if (data && compare(oldPassword, data.applicant_password)) {
							redisClient.hdel(refresh, "token", (error, result) => {
								if(error) return new GraphQLError(error);
								return result;
							});
							return dbQuery("UPDATE Applicants SET applicant_password = (?) WHERE applicant_id = (?) AND absolute_year = (?)",
								[hash(newPassword), deets.id, year]
							).then((data) => true, (error) => new GraphQLError(error));
						} else return new GraphQLError("Old Password incorrect!");
					},
					(error) => new GraphQLError(error)
				));
			}
			if(deets.type == "mentor") {
				return resolve(dbQuery(
					"SELECT mentor_password FROM Mentors WHERE mentor_id = (?) AND absolute_year = (?)",
					[deets.id, year]
				).then(
					(data) => {
						if (data && compare(oldPassword, data.mentor_password)) {
							redisClient.hdel(refresh, "token", (error, result) => {
								if(error) return new GraphQLError(error);
								return result;
							});
							return dbQuery("UPDATE Mentors SET mentor_password = (?) WHERE mentor_id = (?) AND absolute_year = (?)",
								[hash(newPassword), deets.id, year]
							).then((data) => true, (error) => new GraphQLError(error));
						} else return new GraphQLError("Old Password incorrect!");
					},
					(error) => new GraphQLError(error)
				));
			}
			if(deets.type == "orgAdmin") {
				return resolve(dbQuery(
					"SELECT org_admin_password FROM Org_Admins WHERE org_admin_id = (?) AND absolute_year = (?)",
					[deets.id, year]
				).then(
					(data) => {
						if (data && compare(oldPassword, data.org_admin_password)) {
							redisClient.hdel(refresh, "token", (error, result) => {
								if(error) return new GraphQLError(error);
								return result;
							});
							return dbQuery("UPDATE Org_Admins SET org_admin_password = (?) WHERE org_admin_id = (?) AND absolute_year = (?)",
								[hash(newPassword), deets.id, year]
							).then((data) => true, (error) => new GraphQLError(error));
						} else return new GraphQLError("Old Password incorrect!");
					},
					(error) => new GraphQLError(error)
				));
			}
			if(deets.type == "superAdmin") {
				return resolve(dbQuery(
					"SELECT super_admin_password FROM Super_Admins WHERE super_admin_id = (?) AND absolute_year = (?)",
					[deets.id, year]
				).then(
					(data) => {
						if (data && compare(oldPassword, data.super_admin_password)) {
							redisClient.hdel(refresh, "token", (error, result) => {
								if(error) return new GraphQLError(error);
								return result;
							});
							return dbQuery("UPDATE Super_Admins SET super_admin_password = (?) WHERE super_admin_id = (?) AND absolute_year = (?)",
								[hash(newPassword), deets.id, year]
							).then((data) => true, (error) => new GraphQLError(error));
						} else return new GraphQLError("Old Password incorrect!");
					},
					(error) => new GraphQLError(error)
				));
			}
		})
	);
}

module.exports = {
	login,
	signUp,
	hash,
	compare,
	generatejwt,
	verifyjwt,
	generateNewJwt,
	logOut,
	changePassword
};
