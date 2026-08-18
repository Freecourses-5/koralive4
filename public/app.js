/* ---------------- i18n ---------------- */
const DICT = {
  ar: {
    brand: "كورة لايف",
    eyebrow_hero: "لوحة النتائج المباشرة",
    hero_title: "نتائج مباريات كرة القدم، لحظة بلحظة.",
    hero_desc: "تابع مباريات اليوم والنتائج المباشرة من مصدر بيانات رياضي موثوق.",
    hero_stat_label: "مباراة اليوم",
    live_now: "مباراة مباشرة الآن",
    date_label: "التاريخ",
    today: "اليوم",
    search_placeholder: "ابحث عن فريق...",
    section_eyebrow: "مركز المباريات",
    section_title: "مباريات اليوم",
    filter_all: "الكل",
    filter_live: "مباشر",
    filter_scheduled: "لم تبدأ",
    filter_finished: "انتهت",
    state_loading: "جاري تحميل المباريات...",
    state_empty: "لا توجد مباريات مطابقة لهذا البحث أو الفلتر.",
    state_empty_favorites: "مفيش بطولات مفضلة لسه. دوس على ⭐ جنب أي بطولة عشان تضيفها.",
    scope_all: "الكل",
    scope_favorites: "المفضلة",
    scope_top: "أهم المباريات",
    state_error: "تعذّر تحميل المباريات، حاول مرة أخرى.",
    status_live: "مباشر",
    status_finished: "انتهت",
    venue_label: "الملعب",
    referee_label: "الحكم",
    footer_tag: "منصة نتائج مباريات كرة القدم مباشرة",
    theme_toggle: "تبديل المظهر",
    lang_toggle: "English",
    league_fallback: "بطولة",
    team_fallback: "الفريق",
    tab_info: "معلومات",
    tab_stats: "الإحصائيات",
    tab_events: "الأحداث",
    tab_lineups: "التشكيلة",
    tab_h2h: "المواجهات",
    tab_injuries: "الغيابات",
    tab_loading: "جاري التحميل...",
    tab_empty: "لا توجد بيانات متاحة لهذا القسم.",
    league_label: "البطولة",
    kickoff_label: "الموعد",
    starting_xi: "التشكيل الأساسي",
    substitutes: "البدلاء",
    draws_label: "تعادل",
  },
  en: {
    brand: "Kora Live",
    eyebrow_hero: "LIVE SCOREBOARD",
    hero_title: "Football scores, live.",
    hero_desc: "Follow today's fixtures and live scores from a trusted sports data source.",
    hero_stat_label: "matches today",
    live_now: "matches live now",
    date_label: "Date",
    today: "Today",
    search_placeholder: "Search a team...",
    section_eyebrow: "MATCH CENTER",
    section_title: "Today's Fixtures",
    filter_all: "All",
    filter_live: "Live",
    filter_scheduled: "Upcoming",
    filter_finished: "Finished",
    state_loading: "Loading fixtures…",
    state_empty: "No matches for this search or filter.",
    state_empty_favorites: "No favorite leagues yet. Tap ⭐ next to a league to add it.",
    scope_all: "All",
    scope_favorites: "Favorites",
    scope_top: "Top matches",
    state_error: "Couldn't load fixtures, please try again.",
    status_live: "LIVE",
    status_finished: "FT",
    venue_label: "Venue",
    referee_label: "Referee",
    footer_tag: "Live football scores platform",
    theme_toggle: "Toggle theme",
    lang_toggle: "العربية",
    league_fallback: "League",
    team_fallback: "Team",
    tab_info: "Info",
    tab_stats: "Stats",
    tab_events: "Events",
    tab_lineups: "Lineups",
    tab_h2h: "H2H",
    tab_injuries: "Injuries",
    tab_loading: "Loading...",
    tab_empty: "No data available for this section.",
    league_label: "League",
    kickoff_label: "Kickoff",
    starting_xi: "Starting XI",
    substitutes: "Substitutes",
    draws_label: "Draws",
  }
};

const TOP_LEAGUE_IDS = [
  2, 3, 848,       // UEFA Champions League, Europa League, Conference League
  39, 40,          // Premier League, Championship
  140, 141,        // La Liga, La Liga 2
  135, 136,        // Serie A, Serie B
  78, 79,          // Bundesliga, 2. Bundesliga
  61, 62,          // Ligue 1, Ligue 2
  88, 94, 203,     // Eredivisie, Primeira Liga, Super Lig
  307,             // Saudi Pro League
  233,             // Egyptian Premier League
  1, 4, 9, 32      // World Cup, Euro, Copa America, World Cup Qualifiers
];

const STAT_LABELS = {
  ar: {
    "ball possession": "الاستحواذ",
    "total shots": "التسديدات",
    "shots on goal": "تسديدات على المرمى",
    "shots off goal": "تسديدات خارج المرمى",
    "blocked shots": "تسديدات محجوبة",
    "shots insidebox": "تسديدات داخل المنطقة",
    "shots outsidebox": "تسديدات خارج المنطقة",
    "corner kicks": "الركنيات",
    "offsides": "التسلل",
    "fouls": "الأخطاء",
    "yellow cards": "بطاقات صفراء",
    "red cards": "بطاقات حمراء",
    "goalkeeper saves": "تصديات الحارس",
    "total passes": "التمريرات",
    "passes accurate": "تمريرات ناجحة",
    "passes %": "دقة التمرير",
    "expected_goals": "الأهداف المتوقعة (xG)"
  },
  en: {
    "ball possession": "Ball Possession",
    "total shots": "Total Shots",
    "shots on goal": "Shots on Goal",
    "shots off goal": "Shots off Goal",
    "blocked shots": "Blocked Shots",
    "shots insidebox": "Shots Inside Box",
    "shots outsidebox": "Shots Outside Box",
    "corner kicks": "Corner Kicks",
    "offsides": "Offsides",
    "fouls": "Fouls",
    "yellow cards": "Yellow Cards",
    "red cards": "Red Cards",
    "goalkeeper saves": "Goalkeeper Saves",
    "total passes": "Total Passes",
    "passes accurate": "Accurate Passes",
    "passes %": "Pass Accuracy",
    "expected_goals": "Expected Goals (xG)"
  }
};

const state = {
  lang: localStorage.getItem("lang") || "ar",
  date: localDate(),
  filter: "all",
  scope: "all",
  query: "",
  matches: [],
  favLeagues: JSON.parse(localStorage.getItem("favLeagues") || "[]")
};

function t(key) {
  return DICT[state.lang][key] || DICT.ar[key] || key;
}

function applyLang() {
  const dir = state.lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = state.lang;
  document.documentElement.dir = dir;
  document.title = state.lang === "ar"
    ? "كورة لايف | نتائج مباريات كرة القدم"
    : "Kora Live | Football Scores";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });

  document.getElementById("selectedDate").textContent = formatDate(state.date);
}

/* ---------------- Date helpers ---------------- */
function localDate(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(d);
  const get = t => parts.find(x => x.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function shiftDate(date, days) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(date) {
  const locale = state.lang === "ar" ? "ar-EG" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Africa/Cairo", weekday: "long", day: "numeric", month: "long"
  }).format(new Date(`${date}T12:00:00`));
}

function formatTime(iso) {
  const locale = state.lang === "ar" ? "ar-EG" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit"
  }).format(new Date(iso));
}

/* ---------------- Utils ---------------- */
function esc(s = "") {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function statusType(s) {
  const live = ["1H", "2H", "ET", "BT", "P", "LIVE", "HT"];
  const finished = ["FT", "AET", "PEN", "AWD", "WO", "CANC", "ABD"];
  if (live.includes(s)) return "live";
  if (finished.includes(s)) return "finished";
  return "scheduled";
}

function statusLabel(m) {
  const type = statusType(m.status.short);
  if (type === "live") return `● ${m.status.elapsed ? m.status.elapsed + "'" : t("status_live")}`;
  if (type === "finished") return t("status_finished");
  return formatTime(m.date);
}

/* ---------------- Data loading ---------------- */
async function loadMatches() {
  const stateEl = document.getElementById("state");
  const grid = document.getElementById("matchesGrid");
  stateEl.textContent = t("state_loading");
  stateEl.style.display = "block";
  grid.innerHTML = "";

  try {
    const res = await fetch(`/api/fixtures?date=${encodeURIComponent(state.date)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || t("state_error"));

    state.matches = data.results || [];
    document.getElementById("selectedDate").textContent = formatDate(state.date);

    document.getElementById("matchCount").textContent = state.matches.length.toLocaleString("en-US");

    const liveCount = state.matches.filter(m => statusType(m.status.short) === "live").length;
    const liveBadge = document.getElementById("liveBadge");
    if (liveCount > 0) {
      liveBadge.hidden = false;
      document.getElementById("liveCount").textContent = liveCount.toLocaleString("en-US");
    } else {
      liveBadge.hidden = true;
    }

    render();
  } catch (e) {
    stateEl.textContent = e.message || t("state_error");
  }
}

/* ---------------- Render ---------------- */
function render() {
  const grid = document.getElementById("matchesGrid");
  const stateEl = document.getElementById("state");
  const q = state.query.trim().toLowerCase();

  let list = state.matches.filter(m => {
    const type = statusType(m.status.short);
    const matchesFilter = state.filter === "all" || state.filter === type;
    const matchesQuery = !q ||
      (m.home.name || "").toLowerCase().includes(q) ||
      (m.away.name || "").toLowerCase().includes(q);
    const matchesScope =
      state.scope === "all" ? true :
      state.scope === "favorites" ? state.favLeagues.includes(m.league.id) :
      state.scope === "top" ? TOP_LEAGUE_IDS.includes(m.league.id) : true;
    return matchesFilter && matchesQuery && matchesScope;
  });

  if (!list.length) {
    grid.innerHTML = "";
    stateEl.textContent = (state.scope === "favorites" && !state.favLeagues.length)
      ? t("state_empty_favorites")
      : t("state_empty");
    stateEl.style.display = "block";
    return;
  }
  stateEl.style.display = "none";

  const groups = new Map();
  for (const m of list) {
    const key = `${m.league.id}-${m.league.name}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }

  const sortedGroups = [...groups.values()].sort((a, b) => {
    const aFav = state.favLeagues.includes(a[0].league.id) ? 0 : 1;
    const bFav = state.favLeagues.includes(b[0].league.id) ? 0 : 1;
    return aFav - bFav;
  });

  grid.innerHTML = sortedGroups.map(group => {
    const league = group[0].league;
    const isFav = state.favLeagues.includes(league.id);
    return `
      <article class="league-card">
        <div class="league-head">
          ${league.logo ? `<img src="${esc(league.logo)}" alt="" loading="lazy">` : ""}
          <div class="league-names">
            <strong>${esc(league.name || t("league_fallback"))}</strong>
            <small>${esc(league.country || "")}</small>
          </div>
          <button class="fav-btn ${isFav ? "active" : ""}" data-league="${league.id}" aria-label="favorite">★</button>
        </div>
        ${group.map(matchRow).join("")}
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".fav-btn").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.league);
      const idx = state.favLeagues.indexOf(id);
      if (idx === -1) state.favLeagues.push(id); else state.favLeagues.splice(idx, 1);
      localStorage.setItem("favLeagues", JSON.stringify(state.favLeagues));
      render();
    };
  });

  wireMatchDetails(grid);
}

function matchRow(m) {
  const type = statusType(m.status.short);
  const homeLogo = m.home.logo ? `<img src="${esc(m.home.logo)}" alt="" loading="lazy">` : "";
  const awayLogo = m.away.logo ? `<img src="${esc(m.away.logo)}" alt="" loading="lazy">` : "";

  const score = m.goals.home == null && m.goals.away == null
    ? "—"
    : `${m.goals.home ?? 0} - ${m.goals.away ?? 0}`;

  return `
    <details class="match" data-id="${m.id}" data-home-id="${m.home.id || ""}" data-away-id="${m.away.id || ""}">
      <summary>
        <div class="side home">
          <span class="team-name">${esc(m.home.name || t("team_fallback"))}</span>
          ${homeLogo}
        </div>
        <div class="score-box">
          <span class="score">${score}</span>
          <span class="status ${type}">${statusLabel(m)}</span>
        </div>
        <div class="side away">
          ${awayLogo}
          <span class="team-name">${esc(m.away.name || t("team_fallback"))}</span>
        </div>
      </summary>
      <div class="match-panel">
        <div class="match-tabs">
          <button class="mtab active" data-tab="info">${t("tab_info")}</button>
          <button class="mtab" data-tab="stats">${t("tab_stats")}</button>
          <button class="mtab" data-tab="events">${t("tab_events")}</button>
          <button class="mtab" data-tab="lineups">${t("tab_lineups")}</button>
          <button class="mtab" data-tab="h2h">${t("tab_h2h")}</button>
          <button class="mtab" data-tab="injuries">${t("tab_injuries")}</button>
        </div>
        <div class="match-tab-content">${renderInfoTab(m)}</div>
      </div>
    </details>
  `;
}

/* ---------------- Match detail tabs ---------------- */
async function fetchJSON(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || t("state_error"));
  return data;
}

function renderInfoTab(m) {
  const rows = [];
  rows.push(`<div class="info-row"><b>${t("league_label")}</b>${esc(m.league.name || "")} · ${esc(m.league.country || "")}</div>`);
  rows.push(`<div class="info-row"><b>${t("kickoff_label")}</b>${esc(formatDate(m.date.slice(0, 10)))} · ${esc(formatTime(m.date))}</div>`);
  if (m.venue && m.venue.name) rows.push(`<div class="info-row"><b>${t("venue_label")}</b>${esc(m.venue.name)}</div>`);
  if (m.referee) rows.push(`<div class="info-row"><b>${t("referee_label")}</b>${esc(m.referee)}</div>`);
  return `<div class="tab-info">${rows.join("")}</div>`;
}

function statLabel(type) {
  const key = String(type || "").trim().toLowerCase();
  const map = STAT_LABELS[state.lang] || STAT_LABELS.en;
  return map[key] || type;
}

function renderStatsTab(data) {
  const list = data.result || [];
  if (list.length < 2) return `<div class="tab-empty">${t("tab_empty")}</div>`;
  const [a, b] = list;
  const statsA = a.statistics || [];
  const statsB = b.statistics || [];
  const rows = statsA.map((s, i) => {
    const other = statsB[i] || {};
    const va = s.value ?? 0;
    const vb = other.value ?? 0;
    const na = parseFloat(va) || 0;
    const nb = parseFloat(vb) || 0;
    const total = na + nb || 1;
    const pa = Math.round((na / total) * 100);
    return `
      <div class="stat-row">
        <div class="stat-values"><span>${esc(String(va ?? 0))}</span><span>${esc(statLabel(s.type))}</span><span>${esc(String(vb ?? 0))}</span></div>
        <div class="stat-bar"><span style="width:${pa}%"></span></div>
      </div>`;
  }).join("");
  return `<div class="tab-stats">${rows}</div>`;
}

function eventIcon(ev) {
  const type = (ev.type || "").toLowerCase();
  const detail = (ev.detail || "").toLowerCase();
  if (type === "goal") return detail.includes("missed") ? "❌" : "⚽";
  if (type === "card") return detail.includes("red") ? "🟥" : "🟨";
  if (type === "subst") return "🔁";
  return "•";
}

function renderEventsTab(data) {
  const list = (data.result || []).slice().sort((x, y) => (x.time?.elapsed || 0) - (y.time?.elapsed || 0));
  if (!list.length) return `<div class="tab-empty">${t("tab_empty")}</div>`;
  const rows = list.map(ev => {
    const minute = `${ev.time?.elapsed ?? ""}${ev.time?.extra ? "+" + ev.time.extra : ""}'`;
    const player = esc(ev.player?.name || "");
    const assist = ev.assist?.name ? ` <small>(${esc(ev.assist.name)})</small>` : "";
    const team = esc(ev.team?.name || "");
    return `
      <div class="event-row">
        <span class="event-minute">${minute}</span>
        <span class="event-icon">${eventIcon(ev)}</span>
        <span class="event-body"><b>${player}</b>${assist}<small class="event-team">${team}</small></span>
      </div>`;
  }).join("");
  return `<div class="tab-events">${rows}</div>`;
}

function renderLineupsTab(data) {
  const list = data.result || [];
  if (!list.length) return `<div class="tab-empty">${t("tab_empty")}</div>`;
  return `<div class="tab-lineups">${list.map(team => `
    <div class="lineup-team">
      <div class="lineup-head">
        ${team.team?.logo ? `<img src="${esc(team.team.logo)}" alt="">` : ""}
        <b>${esc(team.team?.name || "")}</b>
        <span class="formation">${esc(team.formation || "")}</span>
      </div>
      <div class="lineup-group-label">${t("starting_xi")}</div>
      <ul class="lineup-list">
        ${(team.startXI || []).map(p => `<li><span class="pnum">${esc(String(p.player?.number ?? ""))}</span>${esc(p.player?.name || "")}</li>`).join("")}
      </ul>
      <div class="lineup-group-label">${t("substitutes")}</div>
      <ul class="lineup-list subs">
        ${(team.substitutes || []).map(p => `<li><span class="pnum">${esc(String(p.player?.number ?? ""))}</span>${esc(p.player?.name || "")}</li>`).join("")}
      </ul>
    </div>
  `).join("")}</div>`;
}

function renderH2HTab(data, m) {
  const list = (data.result || []).map(normalizeFixtureLike);
  if (!list.length) return `<div class="tab-empty">${t("tab_empty")}</div>`;
  let homeWins = 0, awayWins = 0, draws = 0;
  list.forEach(f => {
    if (f.goals.home == null || f.goals.away == null) return;
    const homeIsA = f.home.id === m.home.id;
    const aGoals = homeIsA ? f.goals.home : f.goals.away;
    const bGoals = homeIsA ? f.goals.away : f.goals.home;
    if (aGoals > bGoals) homeWins++; else if (aGoals < bGoals) awayWins++; else draws++;
  });
  const summary = `
    <div class="h2h-summary">
      <div><b>${homeWins}</b><span>${esc(m.home.name)}</span></div>
      <div><b>${draws}</b><span>${t("draws_label")}</span></div>
      <div><b>${awayWins}</b><span>${esc(m.away.name)}</span></div>
    </div>`;
  const rows = list.map(f => `
    <div class="h2h-row">
      <span class="h2h-date">${esc(formatDate(f.date.slice(0, 10)))}</span>
      <span class="h2h-teams">${esc(f.home.name)} <b>${f.goals.home ?? "-"} : ${f.goals.away ?? "-"}</b> ${esc(f.away.name)}</span>
    </div>`).join("");
  return `<div class="tab-h2h">${summary}${rows}</div>`;
}

function renderInjuriesTab(data) {
  const list = data.result || [];
  if (!list.length) return `<div class="tab-empty">${t("tab_empty")}</div>`;
  const rows = list.map(inj => `
    <div class="injury-row">
      <span class="injury-team">${esc(inj.team?.name || "")}</span>
      <span class="injury-player"><b>${esc(inj.player?.name || "")}</b><small>${esc(inj.player?.reason || inj.type || "")}</small></span>
    </div>`).join("");
  return `<div class="tab-injuries">${rows}</div>`;
}

function normalizeFixtureLike(item) {
  const f = item.fixture || {};
  const teams = item.teams || {};
  const goals = item.goals || {};
  return {
    id: f.id, date: f.date,
    home: teams.home || {}, away: teams.away || {},
    goals: { home: goals.home, away: goals.away }
  };
}

async function loadTab(panelEl, m, tab) {
  const content = panelEl.querySelector(".match-tab-content");
  if (tab === "info") { content.innerHTML = renderInfoTab(m); return; }
  content.innerHTML = `<div class="tab-loading">${t("tab_loading")}</div>`;
  try {
    if (tab === "stats") {
      const data = await fetchJSON(`/api/fixture/${m.id}/statistics`);
      content.innerHTML = renderStatsTab(data);
    } else if (tab === "events") {
      const data = await fetchJSON(`/api/fixture/${m.id}/events`);
      content.innerHTML = renderEventsTab(data);
    } else if (tab === "lineups") {
      const data = await fetchJSON(`/api/fixture/${m.id}/lineups`);
      content.innerHTML = renderLineupsTab(data);
    } else if (tab === "h2h") {
      const homeId = panelEl.closest(".match").dataset.homeId;
      const awayId = panelEl.closest(".match").dataset.awayId;
      const data = await fetchJSON(`/api/fixture/${m.id}/h2h?home=${homeId}&away=${awayId}`);
      content.innerHTML = renderH2HTab(data, m);
    } else if (tab === "injuries") {
      const data = await fetchJSON(`/api/fixture/${m.id}/injuries`);
      content.innerHTML = renderInjuriesTab(data);
    }
  } catch (e) {
    content.innerHTML = `<div class="tab-empty">${t("state_error")}</div>`;
  }
}

function wireMatchDetails(grid) {
  grid.querySelectorAll(".match").forEach(el => {
    const id = Number(el.dataset.id);
    const m = state.matches.find(x => x.id === id);
    if (!m) return;
    el.querySelectorAll(".mtab").forEach(btn => {
      btn.onclick = () => {
        el.querySelectorAll(".mtab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadTab(el.querySelector(".match-panel"), m, btn.dataset.tab);
      };
    });
  });
}

/* ---------------- Events ---------------- */
document.getElementById("prevDay").onclick = () => { state.date = shiftDate(state.date, -1); loadMatches(); };
document.getElementById("nextDay").onclick = () => { state.date = shiftDate(state.date, 1); loadMatches(); };
document.getElementById("todayBtn").onclick = () => { state.date = localDate(); loadMatches(); };

document.querySelectorAll(".scope").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".scope").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.scope = btn.dataset.scope;
    render();
  };
});

document.querySelectorAll(".filter").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    render();
  };
});

let searchTimer;
document.getElementById("searchInput").oninput = (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { state.query = e.target.value; render(); }, 150);
};

document.getElementById("themeBtn").onclick = () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("dark", document.documentElement.classList.contains("dark") ? "1" : "0");
};
if (localStorage.getItem("dark") === "1") document.documentElement.classList.add("dark");

document.getElementById("langBtn").onclick = () => {
  state.lang = state.lang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", state.lang);
  applyLang();
  render();
};

/* ---------------- Init ---------------- */
applyLang();
loadMatches();

// Gentle auto-refresh for live matches on today's view.
setInterval(() => {
  if (state.date === localDate()) loadMatches();
}, 60000);
