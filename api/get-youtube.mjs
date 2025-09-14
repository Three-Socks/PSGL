export default async function handler(_, res)
{
	try
	{
		const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=9&playlistId=${encodeURIComponent(process.env.YT_PLAYLIST)}&key=${encodeURIComponent(process.env.YT_API)}`;
		const youtubeFetch = await fetch(url);
		if (!youtubeFetch.ok)
		{
			throw new Error('Fetch failed with status ' + youtubeFetch.status);
		}

		const youtubeJson = await youtubeFetch.json();
		if (!youtubeJson)
		{
			throw new Error('JSON parsing failed');
		}

		const videoItems = (youtubeJson.items || []).map(video => ({
			videoId: video.snippet?.resourceId?.videoId || null,
			thumbnail: video.snippet?.thumbnails?.medium?.url || null,
			title: (video.snippet?.title || '')
				.replace('PSGL l', '')
				.replace('PSGL |', ''),
		}));

		res.setHeader('Vercel-CDN-Cache-Control', 'max-age=43200'); // 12h on Vercel edge cache
		res.setHeader('CDN-Cache-Control', 'max-age=600'); // 10m on downstream CDNs
		res.setHeader('Cache-Control', 'max-age=60'); // 1m in browsers

		return res.status(200).json(videoItems);
	}
	catch (err)
	{
		console.error(err);
		return res.status(500).end();
	}
}
