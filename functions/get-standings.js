const { Pool } = require('pg');
const pool = new Pool
({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NETLIFY_DEV ? false : { rejectUnauthorized: false },
});

pool.on('error', console.error);

exports.handler = async (event) => {
	try
	{
		const game_query = event.queryStringParameters?.game?.replace(/[^\w\-\s+]/g, '');

		if (!game_query)
			throw 'game empty';

		const standings_result = await pool.query({
			text: 'SELECT id as name, drivers, constructors FROM standings WHERE game = $1 ORDER BY sort',
			values: [game_query]
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
