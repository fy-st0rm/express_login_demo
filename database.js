const host = "localhost";
const user = "root";
const password = "";
const database_name = "users";

const mysql = require("mysql");
const mysql_pool = mysql.createPool({
	host: host,
	user: user,
	password: password,
	database: database_name,
	connectionLimit: 10,
	supportBigNumbers: true
});

exports.query = (query, args, callback) => {
	mysql_pool.getConnection((err, conn) => {
		if (err) {
			console.log(err);
			callback(true);
			return;
		}

		conn.query(query, args, (err, results) => {
			conn.release();

			if (err) {
				console.log(err);
				callback(true);
				return;
			}

			callback(false, results);
		});
	});
};

