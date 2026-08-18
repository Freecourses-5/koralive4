const state = {
  date: new Date(),
  matches: [],
  filter: "all",
  query: "",
  lang: "ar",
  dark: false,
  loading: false,
  error: ""
};

const $ = (s) => document.querySelector(s);

function localDate(d) {
  return d.toLocaleDateString("en-CA");
}

function formatDate(d) {
  return new Intl.DateTimeFormat(state.lang === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(d);
}

function formatTime(value) {
  if (!value) return "--:--";
  return new Intl.DateTimeFormat(state.lang === "ar" ? "ar-EG" : "en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusLabel(match) {
  if (match.state === "in") return state.lang === "ar" ? "مباشر" : "LIVE";
  if (match.completed) return state.lang === "ar" ? "انتهت" : "FT";
  return formatTime(match.date);
}

function isLive(m) {
  return m.state === "in";
}

function isFinished(m) {
  return m.completed || m.state === "post";
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function teamLogo(team) {
  return team.logo
    ? `<img class="team-logo" src="${esc(team.logo)}" alt="" loading="lazy" onerror="this.style.display='none'">`
    : `<span class="team-logo placeholder">⚽</span>`;
}

function render() {
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = state.lang;

  $("#dateLabel").textContent = formatDate(state.date);
  $("#dateShort").textContent = localDate(state.date);
  $("#heroTitle").textContent = state.lang === "ar"
    ? "نتائج مباريات كرة القدم، لحظة بلحظة."
    : "Football results, updated live.";
  $("#heroSub").textContent = state.lang === "ar"
    ? "تابع مباريات اليوم والنتائج المباشرة من مصدر بيانات رياضي."
    : "Follow today's fixtures and live scores from a sports data source.";
  $("#langBtn").textContent = state.lang === "ar" ? "English" : "العربية";
  $("#search").placeholder = state.lang === "ar" ? "ابحث عن فريق..." : "Search for a team...";
  $("#matchesTitle").textContent = state.lang === "ar" ? "مباريات اليوم" : "Today's Matches";
  $("#importantTitle").textContent = state.lang === "ar" ? "أهم المباريات" : "Top Matches";

  const live = state.matches.filter(isLive).length;
  $("#liveCount").textContent = live;
  $("#heroTotal").textContent = state.matches.length;

  const filtered = state.matches.filter(m => {
    const q = state.query.trim().toLowerCase();
    const matchesQuery = !q || `${m.home.name} ${m.away.name} ${m.league}`.toLowerCase().includes(q);
    const matchesFilter =
      state.filter === "all" ||
      (state.filter === "live" && isLive(m)) ||
      (state.filter === "finished" && isFinished(m)) ||
      (state.filter === "upcoming" && !isLive(m) && !isFinished(m));
    return matchesQuery && matchesFilter;
  });

  if (state.loading) {
    $("#list").innerHTML = `<div class="empty"><span class="spinner"></span>${state.lang === "ar" ? "جاري تحميل المباريات..." : "Loading matches..."}</div>`;
  } else if (state.error) {
    $("#list").innerHTML = `<div class="empty error-box">${esc(state.error)}<button id="retry" class="retry">${state.lang === "ar" ? "إعادة المحاولة" : "Retry"}</button></div>`;
    $("#retry").onclick = load;
  } else if (!filtered.length) {
    $("#list").innerHTML = `<div class="empty">${state.lang === "ar" ? "لا توجد مباريات مطابقة لهذا البحث أو الفلتر." : "No matches match this search or filter."}</div>`;
  } else {
    $("#list").innerHTML = filtered.map(matchCard).join("");
  }

  document.querySelectorAll(".match-card").forEach(card => {
    card.onclick = (event) => {
      if (event.target.closest(".lineup-btn")) return;
      const m = state.matches.find(x => x.id === card.dataset.id);
      if (m?.link) window.open(m.link, "_blank", "noopener");
    };
  });

  document.querySelectorAll(".lineup-btn").forEach(btn => {
    btn.onclick = (event) => {
      event.stopPropagation();
      openLineup(btn.dataset.id);
    };
  });
}

function matchCard(m) {
  const live = isLive(m);
  const finished = isFinished(m);
  const lineupText = state.lang === "ar" ? "التشكيلة" : "Lineups";
  return `
    <article class="match-card ${live ? "is-live" : ""}" data-id="${esc(m.id)}">
      <div class="match-top">
        <span class="league">${esc(m.league)}</span>
        <span class="match-status ${live ? "live" : finished ? "finished" : ""}">
          ${live ? "● " : ""}${esc(statusLabel(m))}
        </span>
      </div>
      <div class="teams">
        <div class="team">
          ${teamLogo(m.home)}
          <strong>${esc(m.home.name)}</strong>
        </div>
        <div class="score">
          <b>${m.homeScore ?? "-"}</b>
          <span>:</span>
          <b>${m.awayScore ?? "-"}</b>
        </div>
        <div class="team">
          ${teamLogo(m.away)}
          <strong>${esc(m.away.name)}</strong>
        </div>
      </div>
      <div class="match-bottom">
        <span>${esc(m.shortDetail || m.detail || "")}</span>
        <span>${esc(m.venue || "")}</span>
      </div>
      <button class="lineup-btn" data-id="${esc(m.id)}" type="button">⚽ ${lineupText}</button>
    </article>
  `;
}

function lineupPlayerHTML(player, teamSide, formation) {
  const p = player?.player || {};
  const pos = player?.pos || "";
  const grid = player?.grid || "";
  let top = 50, left = 50;
  if (grid && /^\d+:\d+$/.test(grid)) {
    const [row, col] = grid.split(":").map(Number);
    // API-Football grid is line:column. Convert it into stable pitch percentages.
    top = 8 + Math.min(8, Math.max(0, row - 1)) * 10.5;
    left = ((Math.min(5, Math.max(1, col)) - 0.5) / 5) * 100;
  } else {
    const fallback = {
      G: [88, 50], D: [72, 50], M: [53, 50], F: [30, 50]
    };
    [top, left] = fallback[pos] || [50, 50];
  }
  if (teamSide === "away") top = 100 - top;

  const rating = p.rating ? Number(p.rating).toFixed(1) : "-";
  const ratingClass = Number(rating) >= 7 ? "good" : Number(rating) >= 6.5 ? "mid" : "low";
  const name = p.name || "Player";
  const photo = p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy" onerror="this.style.display='none'">` : `<span class="player-placeholder">⚽</span>`;
  return `<div class="pitch-player ${teamSide}" style="top:${top}%;left:${left}%" title="${esc(name)}">
    <span class="player-rating ${ratingClass}">${esc(rating)}</span>
    <span class="player-avatar">${photo}</span>
    <span class="player-name">${esc(name)}</span>
  </div>`;
}

function lineupTeamHTML(team, side) {
  const starters = Array.isArray(team?.startXI) ? team.startXI : [];
  const subs = Array.isArray(team?.substitutes) ? team.substitutes : [];
  const formation = team?.formation || "";
  return { starters, subs, formation, side, team };
}

function renderLineup(data) {
  const raw = data?.response || data?.lineups || data || [];
  const lineups = Array.isArray(raw) ? raw : [];
  const home = lineups[0] || {};
  const away = lineups[1] || {};
  const fixture = state.matches.find(m => m.id === String(data?.fixture?.id || data?.match?.fixture?.id || ""));

  // API returns lineups with team metadata. Keep the order provided by API.
  const homeName = home.team?.name || fixture?.home?.name || "Home";
  const awayName = away.team?.name || fixture?.away?.name || "Away";
  const homeLogo = home.team?.logo || fixture?.home?.logo || "";
  const awayLogo = away.team?.logo || fixture?.away?.logo || "";
  const homeScore = fixture?.homeScore ?? "-";
  const awayScore = fixture?.awayScore ?? "-";

  const players = [
    ...lineupPlayerHTMLArray(home.startXI || [], "home"),
    ...lineupPlayerHTMLArray(away.startXI || [], "away")
  ].join("");

  const substitutes = [...(home.substitutes || []), ...(away.substitutes || [])].map(item => {
    const p = item?.player || {};
    return `<div class="sub-row"><span>${esc(p.number ?? "")}</span><strong>${esc(p.name || "Player")}</strong><small>${esc(p.pos || "")}</small></div>`;
  }).join("");

  return `
    <div class="lineup-modal-inner">
      <div class="lineup-header">
        <button id="closeLineup" class="lineup-close" type="button" aria-label="Close">×</button>
        <div class="lineup-league">${esc(fixture?.league || "Football")}</div>
        <div class="lineup-scoreboard">
          <div class="lineup-team">
            ${homeLogo ? `<img src="${esc(homeLogo)}" alt="">` : ""}
            <strong>${esc(homeName)}</strong>
            <small>${esc(home.formation || "")}</small>
          </div>
          <div class="lineup-score">${esc(homeScore)} <span>-</span> ${esc(awayScore)}</div>
          <div class="lineup-team">
            ${awayLogo ? `<img src="${esc(awayLogo)}" alt="">` : ""}
            <strong>${esc(awayName)}</strong>
            <small>${esc(away.formation || "")}</small>
          </div>
        </div>
      </div>

      <div class="lineup-tabs">
        <button class="lineup-tab active" data-lineup-tab="pitch">${state.lang === "ar" ? "التشكيلة" : "Lineups"}</button>
        <button class="lineup-tab" data-lineup-tab="subs">${state.lang === "ar" ? "البدلاء" : "Substitutes"}</button>
      </div>

      <div class="lineup-tab-content active" data-lineup-content="pitch">
        <div class="formation-switch">
          <span>${esc(home.formation || "-")}</span>
          <span>${esc(away.formation || "-")}</span>
        </div>
        <div class="football-pitch">
          <div class="pitch-lines"></div>
          ${players}
        </div>
      </div>

      <div class="lineup-tab-content" data-lineup-content="subs">
        <div class="subs-grid">${substitutes || `<div class="sub-empty">${state.lang === "ar" ? "لا توجد بيانات للبدلاء." : "No substitutes data."}</div>`}</div>
      </div>
    </div>`;
}

function lineupPlayerHTMLArray(players, side) {
  return players.map(player => lineupPlayerHTML(player, side, "")).join("");
}

async function openLineup(id) {
  const modal = $("#lineupModal");
  if (!modal) return;
  modal.classList.add("open");
  modal.innerHTML = `<div class="lineup-loading"><span class="spinner"></span>${state.lang === "ar" ? "جاري تحميل التشكيلة..." : "Loading lineups..."}</div>`;
  document.body.classList.add("modal-open");

  try {
    const response = await fetch(`/api/lineups?id=${encodeURIComponent(id)}`, { headers: { accept: "application/json" }, cache: "no-store" });
    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error("استجابة الخادم ليست JSON صحيحة."); }
    if (!response.ok || !data.ok) throw new Error(data?.error || (state.lang === "ar" ? "تعذر تحميل التشكيلة." : "Could not load lineups."));
    if (!Array.isArray(data.lineups) || data.lineups.length < 1) throw new Error(state.lang === "ar" ? "التشكيلة غير متاحة لهذه المباراة." : "Lineups are not available for this match.");
    modal.innerHTML = renderLineup({ response: data.lineups, fixture: { id } });
    bindLineupModal();
  } catch (e) {
    modal.innerHTML = `<div class="lineup-error"><button id="closeLineup" class="lineup-close" type="button">×</button><div>${esc(e.message || "Error")}</div></div>`;
    bindLineupModal();
  }
}

function bindLineupModal() {
  const modal = $("#lineupModal");
  const close = $("#closeLineup");
  if (close) close.onclick = closeLineup;
  modal.onclick = e => { if (e.target === modal) closeLineup(); };
  document.querySelectorAll(".lineup-tab").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".lineup-tab").forEach(x => x.classList.remove("active"));
      document.querySelectorAll(".lineup-tab-content").forEach(x => x.classList.remove("active"));
      tab.classList.add("active");
      const content = document.querySelector(`[data-lineup-content="${tab.dataset.lineupTab}"]`);
      if (content) content.classList.add("active");
    };
  });
}

function closeLineup() {
  const modal = $("#lineupModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.innerHTML = "";
  document.body.classList.remove("modal-open");
}


async function load() {
  state.loading = true;
  state.error = "";
  render();

  try {
    const response = await fetch(`/api/matches?date=${encodeURIComponent(localDate(state.date))}`, {
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error("استجابة الخادم ليست JSON صحيحة.");
    }

    if (!response.ok || !data.ok) {
      throw new Error(data?.error || "تعذر تحميل المباريات.");
    }

    state.matches = Array.isArray(data.matches) ? data.matches : [];
  } catch (e) {
    state.matches = [];
    state.error = e.message || "حدث خطأ غير متوقع.";
  } finally {
    state.loading = false;
    render();
  }
}

function changeDate(delta) {
  state.date.setDate(state.date.getDate() + delta);
  load();
}

$("#prev").onclick = () => changeDate(-1);
$("#next").onclick = () => changeDate(1);
$("#today").onclick = () => { state.date = new Date(); load(); };
$("#search").oninput = (e) => { state.query = e.target.value; render(); };
$("#langBtn").onclick = () => {
  state.lang = state.lang === "ar" ? "en" : "ar";
  render();
};
$("#themeBtn").onclick = () => {
  state.dark = !state.dark;
  document.body.classList.toggle("dark", state.dark);
};

document.querySelectorAll(".filter").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    render();
  };
});

load();
setInterval(load, 30000);
