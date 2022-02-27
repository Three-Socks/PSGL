const { Pool } = require('pg');
const pool = new Pool
({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NETLIFY_DEV ? false : { rejectUnauthorized: false },
});

pool.on('error', console.error);

const getTierMatchName = (title) =>
{
	const tier_match = title.match(/(PC|PS)\s?\b|\b\s?(F\d+)\b/gi);

	if (tier_match?.[0] && tier_match?.[1])
		return tier_match[1].trim().toLowerCase().replace('f', '') + '-' + tier_match[0].trim().toLowerCase();
	else
		console.error('no tier match', 'tier_match = ', tier_match);

	return '';
};

exports.handler = async (event) => {
	try
	{
		const title_query = event.queryStringParameters?.league;
		console.log('title_query', title_query);

		if (!title_query)
			throw 'title_query false';

		const standings_name = getTierMatchName(title_query);
		console.log('standings_name', standings_name);

		if (!standings_name)
			throw 'standings_name false';

		const standings_result = await pool.query({
			text: 'SELECT * FROM standings WHERE name = $1 LIMIT 1',
			values: [standings_name],
		});

		if (!standings_result.rowCount)
			throw 'standings_result rowCount false';

		const standings_url = standings_result.rows[0]?.data?.drivers;
		console.log('standings_url', standings_url);

		if (!standings_url)
			throw 'standings_url false';

		return {
			statusCode: 200,
			body: standings_url,
		};
	}
	catch (error)
	{
		console.log(error);
		return { statusCode: 500, body: '' };
	}
};
