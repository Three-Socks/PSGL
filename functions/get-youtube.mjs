export default async () =>
{
	try
	{
		const youtubeFetch = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=9&playlistId=' + process.env.YT_PLAYLIST + '&key=' + process.env.YT_API);
		if (!youtubeFetch.ok)
			throw new Error('Fetch failed with status ' + youtubeFetch.status);

		const youtubeJson = await youtubeFetch.json();
		if (!youtubeJson)
			throw new Error('JSON parsing failed');

		const videoItems = [];
		for (const video of youtubeJson.items)
			videoItems.push({
				videoId: video.snippet.resourceId.videoId,
				thumbnail: video.snippet.thumbnails.medium.url,
				title: video.snippet.title.replace('PSGL l', '').replace('PSGL |', '')
			});

		return new Response(JSON.stringify(videoItems), {
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