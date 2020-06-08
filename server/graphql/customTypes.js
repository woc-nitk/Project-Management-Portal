const { GraphQLError, GraphQLScalarType, Kind } = require("graphql");
const testCleanString = (string) => /^([a-zA-Z]+\s*)+$/.test(string);
const testYear = (year) => /^20\d{2}$/.test(year);
const testEmailAddress = (emailAddress) =>
	/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress);
const testPassword = (password) =>
	/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,}$/.test(password);
const testDateRegex = (date) =>
	/^(20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(date);
const testURL = (url) =>
	/^(https?):\/\/[^\s$.?#].[^\s]*$/.test(url);
const isLeapYear = (year) =>
	(year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
const testDate = (date) => {
	if (testDateRegex(date) && typeof date === "string") {
		const year = parseInt(date.split("-")[0]);
		const month = parseInt(date.split("-")[1]);
		const day = parseInt(date.split("-")[2]);
		if (
			(!oddMonths.includes(month) && day >= 31) ||
			(month == 2 && day > 29)
		)
			return new GraphQLError("Invalid Date");
		else if (!isLeapYear(year) && month == 2 && day == 29)
			return new GraphQLError("Invalid Date");
		else return date;
	}
	return new GraphQLError("Invalid Date");
};
const oddMonths = [1, 3, 5, 7, 8, 10, 12];

const serializeYear = (year) => {
	if (typeof year === "number" && testYear(year)) {
		return year;
	}
	throw new GraphQLError("Invalid year");
};

const parseYearValue = (value) => {
	let v = parseInt(value, 10);
	if (testYear(v)) {
		return v;
	}
	throw new GraphQLError("Invalid year format");
};

const parseYearLiteral = (ast) => {
	if (testYear(parseInt(ast.value)) && ast.kind == Kind.INT) {
		return parseInt(ast.value);
	}
	throw new GraphQLError("Invalid year format");
};

const Year = new GraphQLScalarType({
	name: "Year",
	description: "Year in 4 digits format",
	parseLiteral: parseYearLiteral,
	parseValue: parseYearValue,
	serialize: serializeYear
});

const serializeEmail = (email) => {
	if (typeof email === "string" && testEmailAddress(email)) {
		return email;
	}
	throw new GraphQLError("Invalid Email address");
};

const parseEmailValue = (email) => {
	if (testEmailAddress(email)) {
		return email;
	}
	throw new GraphQLError("Invalid Email address");
};

const parseEmailLiteral = (ast) => {
	if (testEmailAddress(ast.value) && ast.kind == Kind.STRING) {
		return ast.value;
	}
	throw new GraphQLError("Invalid Email address");
};

const EmailAddress = new GraphQLScalarType({
	name: "EmailAddress",
	description: "Email Address scalar",
	parseLiteral: parseEmailLiteral,
	parseValue: parseEmailValue,
	serialize: serializeEmail
});

const serializeCleanString = (string) => {
	if (typeof string === "string" && testCleanString(string)) {
		return string;
	}
	throw new GraphQLError("Invalid text");
};

const parseCleanStringValue = (string) => {
	if (testCleanString(string)) {
		return string;
	}
	throw new GraphQLError("Invalid text");
};

const parseCleanStringLiteral = (ast) => {
	if (testCleanString(ast.value) && ast.kind == Kind.STRING) {
		return ast.value;
	}
	throw new GraphQLError("Invalid text");
};

const CleanString = new GraphQLScalarType({
	name: "CleanString",
	description: "A clean string to be used for processing.",
	parseLiteral: parseCleanStringLiteral,
	parseValue: parseCleanStringValue,
	serialize: serializeCleanString
});

const serializePassword = (password) => {
	if (typeof password === "string" && testPassword(password)) {
		return password;
	}
	throw new GraphQLError("Invalid password");
};

const parsePasswordValue = (password) => {
	if (testPassword(password)) {
		return password;
	}
	throw new GraphQLError("Invalid password");
};

const parsePasswordLiteral = (ast) => {
	if (testPassword(ast.value) && ast.kind == Kind.STRING) {
		return ast.value;
	}
	throw new GraphQLError("Invalid password");
};

const Password = new GraphQLScalarType({
	name: "Password",
	description: "Password type",
	parseLiteral: parsePasswordLiteral,
	parseValue: parsePasswordValue,
	serialize: serializePassword
});

const serializeDate = (date) => {
	return testDate(date);
};

const parseDateValue = (date) => {
	return testDate(date);
};

const parseDateLiteral = (ast) => {
	if (ast.kind == Kind.STRING) return testDate(ast.value);
	else return new GraphQLError("Invalid Date literal");
};

const Date = new GraphQLScalarType({
	name: "Date",
	description: "A scalar representing date in the format YYYY-MM-DD",
	parseLiteral: parseDateLiteral,
	parseValue: parseDateValue,
	serialize: serializeDate
});

const serializeURL = (url) => {
	if (typeof url === "string" && testURL(url)) {
		return url;
	}
	console.log(url);
	console.log(typeof url === "string");
	throw new GraphQLError("Invalid URL - " + testURL(url));
};

const parseURLValue = (url) => {
	if (testURL(url)) {
		return url;
	}
	throw new GraphQLError("Invalid URL");
};

const parseURLLiteral = (ast) => {
	if (testURL(ast.value) && ast.kind == Kind.STRING) {
		return ast.value;
	}
	throw new GraphQLError("Invalid URL");
};

const URL = new GraphQLScalarType({
	name: "URL",
	description: "Scalar for URLs",
	parseLiteral: parseURLLiteral,
	parseValue: parseURLValue,
	serialize: serializeURL
});

module.exports = { Year, EmailAddress, CleanString, Password, Date, URL };
