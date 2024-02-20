'use strict';

function getLeagueName(l_id)
{
	const tier_split = l_id.split('-');

	if (tier_split.length && tier_split[0] && tier_split[1])
	{
		return (tier_split[0] + ' ' + tier_split[1]).toUpperCase();
	}
	else
		return '';
}

// eslint-disable-next-line no-unused-vars
function season_fetch(standings_view, standings_json, page_url, page_title)
{
	standings_view.innerHTML = '';

	const league_list = document.querySelector('.league_list');

	function loadLeague(l_id)
	{
		const league = standings_json.find(({ name }) => name === l_id.replace('-', ' '));

		if (league)
		{
			history.pushState({ league: l_id }, '', '?league=' + l_id);

			const title = getLeagueName(l_id) + ' | ' + page_title;
			document.querySelector('.category_header').textContent = title;
			document.title = title;

			standings_view.style.display = 'block';
			//standings_view.scrollIntoView();
			league_list.style.display = 'none';

			let standings_view_html = '';

			for (const standings of [league.drivers, league.constructors, league.results])
			{
				if (standings.src)
				{
					const dimensions = standings.width && standings.height ? ` width="${standings.width}" height="${standings.height}"` : '';
					standings_view_html += `<a href="${standings.src}"><img src="${standings.src}" alt=""${dimensions} style="width:100%" /></a>`;

					const last_updated_date = league.lastUpdated && new Date(league.lastUpdated).toLocaleString() || null;
					if (last_updated_date)
						standings_view_html += `<div class="smalltext right">Last Updated: ${last_updated_date}</div>`;

					standings_view_html += '<hr>';
				}
			}

			if (!standings_view_html)
				standings_view_html = '<div class="standings_header">To be determined</div>';

			standings_view.innerHTML = standings_view_html;
		}
	}

	const params = (new URL(document.location)).searchParams;
	const l_id = params.get('league');

	if (l_id && l_id != '')
		loadLeague(l_id);

	for (const tier of standings_json)
	{
		const tier_name_id = tier.name.replace(' ', '-');
		league_list.insertAdjacentHTML('beforeend', `
			<li id="${tier_name_id}" class="league_button${tier.name.length > 6 ? (tier.name.length > 8 ? ' league_text_small' : ' league_text_a_bit_small') : ''}">
				<a class="league_link" href="${page_url}/?league=${tier_name_id}">
					<span>${tier.name}</span>
				</a>
			</li>`);
	}

	document.addEventListener('click', function(event)
	{
		if (event.target.matches('.league_link'))
		{
			event.preventDefault();
			loadLeague(event.target.parentElement.id);
		}
	});

	window.addEventListener('popstate', function()
	{
		document.querySelector('.category_header').textContent = page_title;
		standings_view.style.display = 'none';
		league_list.style.display = 'flex';
	});
}
