const { Pool } = require('pg');
const pool = new Pool
({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NETLIFY_DEV ? false : { rejectUnauthorized: false },
});

pool.on('error', console.error);

exports.handler = async () => {
	try
	{
		const standings_result = await pool.query({
			text: 'SELECT * FROM standings ORDER BY NULLIF(regexp_replace(name, \'\\D\', \'\', \'g\'), \'\')::int'
		});

		if (!standings_result.rowCount)
			throw 'standings row empty';

		return {
			statusCode: 200,
			body: JSON.stringify(standings_result.rows),
		};
	}
	catch (error)
	{
		console.log(error);
		return { statusCode: 500, body: '' };
	}
};
