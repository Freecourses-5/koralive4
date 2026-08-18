const API_BASE = "https://v3.football.api-sports.io";

const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE"]);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "Content-Type, Accept"
    }
  });
}

function currentSeason(date = new Date().toISOString().slice(0, 10)) {
  const month = Number(date.slice(5, 7));
  const year = Number(date.slice(0, 4));
  return month >= 7 ? year : year - 1;
}

async function apiFootball(path, env) {
  const key = env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY is not configured.");

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "x-apisports-key": key,
      "accept": "application/json"
    }
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`API-Football returned invalid JSON (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(`API-Football HTTP ${response.status}`);
  }

  if (data?.errors && Object.keys(data.errors).length) {
    const errors = Array.isArray(data.errors)
      ? data.errors.join(", ")
      : Object.values(data.errors).join(", ");
    throw new Error(errors || "API-Football returned an error.");
  }

  return data;
}

function normalizeFixture(item) {
  const f = item?.fixture || {};
  const l = item?.league || {};
  const t = item?.teams || {};
  const g = item?.goals || {};
  const s = f?.status || {};
  const code = s.short || "";
  const live = LIVE_STATUSES.has(code);
  const finished = FINISHED_STATUSES.has(code);

  return {
    id: String(f.id ?? ""),
    date: f.date || null,
    state: live ? "in" : finished ? "post" : "pre",
    completed: finished,
    home: {
      id: t.home?.id ?? null,
      name: t.home?.name || "Home",
      logo: t.home?.logo || ""
    },
    away: {
      id: t.away?.id ?? null,
      name: t.away?.name || "Away",
      logo: t.away?.logo || ""
    },
    homeScore: g.home ?? null,
    awayScore: g.away ?? null,
    league: l.name || "",
    leagueId: l.id ?? null,
    shortDetail: live
      ? `${s.long || code}${s.elapsed ? ` • ${s.elapsed}'` : ""}`
      : s.long || code,
    detail: s.long || "",
    venue: f.venue?.name || "",
    link: null
  };
}

async function handleApi(url, env) {
  const path = url.pathname;
  const p = url.searchParams;

  if (path === "/api/health") {
    return json({ ok: true, service: "kora-live-api", provider: "api-football" });
  }

  if (path === "/api/matches" || path === "/api/fixtures") {
    const date = p.get("date") || new Date().toISOString().slice(0, 10);
    const timezone = p.get("timezone") || "Africa/Cairo";
    const data = await apiFootball(
      `/fixtures?date=${encodeURIComponent(date)}&timezone=${encodeURIComponent(timezone)}`,
      env
    );

    return json({
      ok: true,
      date,
      matches: Array.isArray(data.response) ? data.response.map(normalizeFixture) : []
    });
  }

  if (path === "/api/live") {
    const data = await apiFootball("/fixtures?live=all", env);
    return json({
      ok: true,
      matches: Array.isArray(data.response) ? data.response.map(normalizeFixture) : []
    });
  }

  if (path === "/api/lineups") {
    const id = p.get("id") || p.get("fixture");
    if (!id) return json({ ok: false, error: "Missing match id." }, 400);
    const data = await apiFootball(`/fixtures/lineups?fixture=${encodeURIComponent(id)}`, env);
    return json({ ok: true, fixture: id, lineups: Array.isArray(data.response) ? data.response : [] });
  }

  if (path === "/api/match" || path === "/api/summary") {
    const id = p.get("id") || p.get("event");
    if (!id) return json({ ok: false, error: "Missing match id." }, 400);

    const data = await apiFootball(`/fixtures?id=${encodeURIComponent(id)}`, env);
    return json({ ok: true, match: data.response?.[0] || null });
  }

  if (path === "/api/leagues") {
    const search = p.get("search");
    const endpoint = search
      ? `/leagues?search=${encodeURIComponent(search)}`
      : "/leagues?current=true";
    const data = await apiFootball(endpoint, env);
    return json({ ok: true, leagues: data.response || [] });
  }

  if (path === "/api/teams") {
    const league = p.get("league");
    if (!league) return json({ ok: false, error: "Missing league parameter." }, 400);
    const season = p.get("season") || currentSeason();
    const data = await apiFootball(
      `/teams?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`,
      env
    );
    return json({ ok: true, league, season, teams: data.response || [] });
  }

  if (path === "/api/team") {
    const id = p.get("id");
    if (!id) return json({ ok: false, error: "Missing team id." }, 400);
    const data = await apiFootball(`/teams?id=${encodeURIComponent(id)}`, env);
    return json({ ok: true, team: data.response?.[0] || null });
  }

  if (path === "/api/standings") {
    const league = p.get("league");
    if (!league) return json({ ok: false, error: "Missing league parameter." }, 400);
    const season = p.get("season") || currentSeason();
    const data = await apiFootball(
      `/standings?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`,
      env
    );
    return json({ ok: true, league, season, standings: data.response || [] });
  }

  if (path === "/api/search") {
    const q = (p.get("q") || "").trim();
    if (q.length < 3) {
      return json({ ok: false, error: "Search query must be at least 3 characters." }, 400);
    }
    const [teamsData, leaguesData] = await Promise.all([
      apiFootball(`/teams?search=${encodeURIComponent(q)}`, env),
      apiFootball(`/leagues?search=${encodeURIComponent(q)}`, env)
    ]);
    return json({
      ok: true,
      teams: teamsData.response || [],
      leagues: leaguesData.response || []
    });
  }

  if (path === "/api/news") {
    return json({
      ok: false,
      error: "News is not implemented because the supplied API specification does not define a news provider."
    }, 501);
  }

  return json({ ok: false, error: "API endpoint not found." }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, OPTIONS",
          "access-control-allow-headers": "Content-Type, Accept"
        }
      });
    }

    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(url, env);
      } catch (error) {
        return json({
          ok: false,
          error: error?.message || "Unexpected server error."
        }, 502);
      }
    }

    // If this Worker also has an Assets binding, serve the website files.
    if (env.ASSETS) return env.ASSETS.fetch(request);

    return new Response("Kora Live API Worker is running.", {
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
