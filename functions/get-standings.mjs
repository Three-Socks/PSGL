/* import { createDirectus, staticToken, rest, readItems } from '@directus/sdk';
export default async ({ url }) =>
{
	const urlObj = new URL(url);
	try
	{
		const client = createDirectus(process.env.DIRECTUS_URL).with(staticToken(process.env.DIRECTUS_STATIC_TOKEN)).with(rest());
		const standingsResult = await client.request(readItems('standings', {
			fields: [
				'id', 'last_updated',
				'drivers.id', 'drivers.filename_download', 'drivers.width', 'drivers.height',
				'constructors.id', 'constructors.filename_download', 'constructors.width', 'constructors.height',
				'results.id', 'results.filename_download', 'results.width', 'results.height'
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

			const createAssetObject = asset => ({
				src: getAssetUrl(asset),
				width: asset && asset.width,
				height: asset && asset.height
			});

			return {
				name: standing.id,
				drivers: createAssetObject(standing.drivers),
				constructors: createAssetObject(standing.constructors),
				results: createAssetObject(standing.results),
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
}; */