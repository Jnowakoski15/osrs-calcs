interface Env {
  // bindings if needed
}

export const onRequestGet: PagesFunction<Env> = async () => {
  const WIKI_PRICES_URL = 'https://prices.runescape.wiki/api/v1/osrs/latest';

  try {
    const res = await fetch(WIKI_PRICES_URL, {
      headers: {
        'User-Agent': 'OSRSPortalStreamlined/1.0 (contact: github.com/Jnowakoski15/osrs-calcs)',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch OSRS Wiki prices' }), {
        status: res.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=180, s-maxage=300', // Cache at Cloudflare edge for 5 mins
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal proxy error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
