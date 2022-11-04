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
		const league = standings_json.find(({ name }) => name === l_id.replace('-', ' '));

		if (league)
		{
			history.pushState({league: l_id}, '', '?league=' + l_id);

			const title = getLeagueName(l_id) + ' | ' + page_title;
			$('.category_header').text(title);
			document.title = title;

			standings_view.show();
			standings_view[0].scrollIntoView();
			league_list.hide();

			let standings_view_html = '';

			if (league.drivers)
			{
				const last_updated_date = league.last_updated ? league.last_updated : getDiscordDate(league.drivers);
				standings_view_html += `<a href="${league.drivers}"><img src="${league.drivers}" alt="" style="width:100%" /></a>
				<div class="smalltext right">Last Updated: ${last_updated_date}</div>
				<hr>`;
			}

			if (league.constructors)
			{
				const last_updated_date = league.last_updated ? league.last_updated : getDiscordDate(league.constructors);
				standings_view_html += `<a href="${league.constructors}"><img src="${league.constructors}" alt="" style="width:100%" /></a>
				<div class="smalltext right">Last Updated: ${last_updated_date}</div>
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
		const tier_name_id = tier.name.replace(' ', '-');
		league_list.append(`
			<li id="${tier_name_id}" class="league_button${tier.name.length > 6 ? ' league_text_small' : ''}">
				<a class="league_link" href="${page_url}/?league=${tier_name_id}">
					<span>${tier.name}</span>
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