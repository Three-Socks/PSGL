import fetch from 'node-fetch';

exports.handler = async () => {
	try
	{
		let youtube_fetch = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=9&playlistId=' + process.env.YT_PLAYLIST + '&key=' + process.env.YT_API);
		const youtube_json = JSON.parse(await youtube_fetch.text());

		if (!youtube_json)
			throw 'youtube_json empty';

		const video_items = [];

		for (const video of youtube_json.items)
			video_items.push({
				videoId: video.snippet.resourceId.videoId,
				thumbnail: video.snippet.thumbnails.medium.url,
				title: video.snippet.title.replace('PSGL l', '').replace('PSGL |', '')
			});

		return {
			statusCode: 200,
			body: JSON.stringify(video_items),
		};
	}
	catch (error)
	{
		console.log(error);
		return { statusCode: 500, body: '' };
	}
};
