const mysql = require("mysql");
const env = require("dotenv");

env.config();

const connectionPool = mysql.createPool({
	connectionLimit: 20, // can be increased as per requirements
	host: process.env.HOST,
	database: process.env.DATABASE_NAME,
	user: process.env.DATABASE_USERNAME,
	password: process.env.PASSWORD,
});


const queryFunction = (query, params) => { return new Promise((resolve, reject) => {
	connectionPool.getConnection( 
		function(error, connection) {
			if (error) {
				reject(error);
			}
			const dbQueryFunction = (query, params) => {
				return new Promise((resolve, reject) => {
					connection.query(query, params, function(error, rows) {
						if (error) {
							console.log(error.sqlMessage);
							reject(error.sqlMessage);
						}
						// else if(rows.OkPacket != undefined) {
						// 	console.log(query + " ----- |" + params + "| ----- ");
						// 	console.log(rows[0]);
						// 	resolve(rows[0]);
						// }
						else {
							console.log(query + " ----- |" + params + "| ----- ");
							// console.log("No OkPacket found");
							console.log((rows[0]));
							// console.log("No OkPacket found");
							resolve(rows[0]);
						}
						
					});
				}); 
			};
			resolve(dbQueryFunction(query, params));    
		});
}); };


module.exports = queryFunction;
