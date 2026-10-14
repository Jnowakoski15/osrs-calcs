interface Env {
  // bindings
}

const SKILL_ORDER = [
  'overall',
  'attack',
  'defence',
  'strength',
  'hitpoints',
  'ranged',
  'prayer',
  'magic',
  'cooking',
  'woodcutting',
  'fletching',
  'fishing',
  'firemaking',
  'crafting',
  'smithing',
  'mining',
  'herblore',
  'agility',
  'thieving',
  'slayer',
  'farming',
  'runecraft',
  'hunter',
  'construction',
];

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const player = url.searchParams.get('player');

  if (!player || player.trim() === '') {
    return new Response(JSON.stringify({ error: 'Player name (rsn) is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const cleanPlayer = player.trim();
  const JAGEX_HISCORES_URL = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(
    cleanPlayer
  )}`;

  try {
    const res = await fetch(JAGEX_HISCORES_URL, {
      headers: {
        'User-Agent': 'OSRSPortalStreamlined/1.0 (contact: github.com/Jnowakoski15/osrs-calcs)',
      },
    });

    if (res.status === 404) {
      return new Response(JSON.stringify({ error: `Player "${cleanPlayer}" not found on OSRS Hiscores` }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Jagex Hiscores returned HTTP ${res.status}` }), {
        status: res.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const text = await res.text();
    const lines = text.trim().split('\n');

    const skills: Record<string, { rank: number; level: number; xp: number }> = {};

    for (let i = 0; i < SKILL_ORDER.length && i < lines.length; i++) {
      const line = lines[i]?.trim();
      if (!line) continue;
      const [rankStr, levelStr, xpStr] = line.split(',');
      const rank = parseInt(rankStr, 10) || 0;
      const level = parseInt(levelStr, 10) || 1;
      const xp = parseInt(xpStr, 10) || 0;

      skills[SKILL_ORDER[i]] = { rank, level, xp };
    }

    const responsePayload = {
      rsn: cleanPlayer,
      lastUpdated: Date.now(),
      skills,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache player hiscores for 5-10 mins
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Error fetching hiscores' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
