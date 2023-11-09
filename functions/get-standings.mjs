import { createDirectus, staticToken, rest, readItems } from '@directus/sdk';
export default async ({ url }) =>
{
	const urlObj = new URL(url);
	try
	{
		const client = createDirectus(process.env.DIRECTUS_URL).with(staticToken(process.env.DIRECTUS_STATIC_TOKEN)).with(rest());
		const standingsResult = await client.request(readItems('standings', {
			fields: [
				'id', 'last_updated',
				'drivers.id', 'drivers.filename_download',
				'constructors.id', 'constructors.filename_download',
				'results.id', 'results.filename_download'
			],
			filter: {
				game: {
					name: {
						_eq: urlObj.searchParams.get('game'),
					},
				},
			},
			sort: 'sort',
			limit: 100
		}));

		const assetsUrl = process.env.DIRECTUS_URL + '/assets/';
		const responseData = standingsResult.map(standing =>
		{
			const getAssetUrl = asset => (asset ? `${assetsUrl}${asset.id}/${asset.filename_download}` : null);

			return {
				name: standing.id,
				drivers: getAssetUrl(standing.drivers),
				constructors: getAssetUrl(standing.constructors),
				results: getAssetUrl(standing.results),
				lastUpdated: standing.last_updated,
			};
		});

		const responseBody = JSON.stringify(responseData);

		return new Response(responseBody, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
	catch (e)
	{
		console.error(e);
		return new Response({ status: 500 });
	}
};