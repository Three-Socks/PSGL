'use strict';

function getLeagueName (l_id)
{
	const tier_split = l_id.split('-');

	if (tier_split.length && tier_split[0] && tier_split[1])
	{
		return (tier_split[0] + ' ' + tier_split[1]).toUpperCase();
	}
	else
		return '';
}

const DISCORD_EPOCH = 1420070400000;
function convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH)
{
	return new Date(snowflake / 4194304 + epoch);
}

function getDiscordDate(url)
{
	const URLObj = new URL(url);

	if (URLObj)
	{
		const path_split = URLObj.pathname.split('/');

		if (path_split)
		{
			const date = convertSnowflakeToDate(path_split[path_split.length - 2]);
			return date.toDateString();
		}
	}

	return '';
}

// eslint-disable-next-line no-unused-vars
function season_fetch(standings_view, standings_json, page_url, page_title)
{
	standings_view.html('');

	const league_list = $('.league_list');

	function loadLeague(l_id)
	{
		const league = standings_json.find(({ name }) => name === l_id);

		if (league)
		{
			history.pushState({league: l_id}, '', '?league=' + l_id);

			const title = getLeagueName(l_id) + ' Standings';
			$('.category_header').text(title);
			document.title = title;


			standings_view.show();
			standings_view[0].scrollIntoView();
			league_list.hide();

			let standings_view_html = '';

			if (league.data)
			{
				const league_drivers = league.data.drivers;
				const last_updated_drivers = league.data.last_updated ? league.data.last_updated : getDiscordDate(league_drivers);
				const league_constructors = league.data.constructors;
				const last_updated_constructors = league.data.last_updated ? league.data.last_updated : getDiscordDate(league_constructors);

				if (league_drivers)
					standings_view_html += `<a href="${league_drivers}"><img src="${league_drivers}" alt="" style="width:100%" /></a>
					<div class="smalltext right">Last Updated: ${last_updated_drivers}</div>
					<hr>`;

				if (league_constructors)
					standings_view_html += `<a href="${league_constructors}"><img src="${league_constructors}" alt="" style="width:100%" /></a>
					<div class="smalltext right">Last Updated: ${last_updated_constructors}</div>
					<hr>`;
			}

			if (!standings_view_html)
				standings_view_html = '<div class="standings_header">To be determined</div>';

			standings_view.html(standings_view_html);
		}
	}

	let params = (new URL(document.location)).searchParams;
	let l_id = params.get('league');

	if (l_id && l_id != '')
		loadLeague(l_id);

	for (const tier of standings_json)
	{
		const tier_name_display = getLeagueName(tier.name);
		league_list.append(`
			<li id="${tier.name}" class="league_button">
				<a class="league_link" href="${page_url}/?league=${tier.name}">
					<span>${tier_name_display}</span>
				</a>
			</li>`);
	}

	$(document).on('click', '.league_link', function (event)
	{
		event.preventDefault();
		loadLeague(event.currentTarget.parentElement.id);
	});

	$(window).on('popstate', function()
	{
		$('.category_header').text(page_title);
		standings_view.hide();
		league_list.show();
	});
}