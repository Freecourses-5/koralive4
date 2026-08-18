// ============================================================
//  Kora Live - single-file Cloudflare Worker
//  Serves the website AND the API from one place. No GitHub,
//  no build step, no Pages needed - just paste this file in
//  the Cloudflare dashboard Worker editor and deploy.
// ============================================================

const INDEX_HTML = [
  "<!doctype html>",
  "<html lang=\"ar\" dir=\"rtl\">",
  "<head>",
  "  <meta charset=\"UTF-8\" />",
  "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />",
  "  <meta name=\"description\" content=\"نتائج مباريات كرة القدم اليوم، النتائج المباشرة وترتيب البطولات من مصدر بيانات رياضي موثوق.\" />",
  "  <title>كورة لايف | نتائج مباريات كرة القدم</title>",
  "  <link rel=\"icon\" href=\"data:,\">",
  "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
  "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
  "  <link href=\"https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Tajawal:wght@400;500;700;800&family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">",
  "  <link rel=\"stylesheet\" href=\"/style.css\">",
  "</head>",
  "<body>",
  "  <header class=\"topbar\">",
  "    <div class=\"container nav\">",
  "      <a class=\"brand\" href=\"/\">",
  "        <span class=\"brand-ball\">⚽</span>",
  "        <span data-i18n=\"brand\">كورة لايف</span>",
  "      </a>",
  "      <div class=\"nav-actions\">",
  "        <button id=\"langBtn\" class=\"pill-btn\" type=\"button\">",
  "          <span data-i18n=\"lang_toggle\">English</span>",
  "        </button>",
  "        <button id=\"themeBtn\" class=\"icon-btn\" type=\"button\" data-i18n-aria=\"theme_toggle\" aria-label=\"تبديل المظهر\">",
  "          <svg class=\"icon-moon\" viewBox=\"0 0 24 24\" width=\"19\" height=\"19\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z\"/></svg>",
  "        </button>",
  "      </div>",
  "    </div>",
  "    <div class=\"pitch-line\" aria-hidden=\"true\"></div>",
  "  </header>",
  "",
  "  <main class=\"container\">",
  "    <section class=\"hero\">",
  "      <div class=\"hero-copy\">",
  "        <span class=\"eyebrow\" data-i18n=\"eyebrow_hero\">لوحة النتائج المباشرة</span>",
  "        <h1 data-i18n=\"hero_title\">نتائج مباريات كرة القدم، لحظة بلحظة.</h1>",
  "        <p data-i18n=\"hero_desc\">تابع مباريات اليوم والنتائج المباشرة من مصدر بيانات رياضي موثوق.</p>",
  "      </div>",
  "      <div class=\"hero-stat\">",
  "        <strong id=\"matchCount\">—</strong>",
  "        <span data-i18n=\"hero_stat_label\">مباراة اليوم</span>",
  "        <div id=\"liveBadge\" class=\"live-badge\" hidden>",
  "          <span class=\"dot\"></span>",
  "          <span id=\"liveCount\">0</span>",
  "          <span data-i18n=\"live_now\">مباراة مباشرة الآن</span>",
  "        </div>",
  "      </div>",
  "    </section>",
  "",
  "    <section class=\"toolbar\">",
  "      <div class=\"date-bar\">",
  "        <button id=\"prevDay\" class=\"round-btn\" aria-label=\"prev\">‹</button>",
  "        <div class=\"date-display\">",
  "          <small data-i18n=\"date_label\">التاريخ</small>",
  "          <strong id=\"selectedDate\">—</strong>",
  "        </div>",
  "        <button id=\"nextDay\" class=\"round-btn\" aria-label=\"next\">›</button>",
  "        <button id=\"todayBtn\" class=\"today-btn\" data-i18n=\"today\">اليوم</button>",
  "      </div>",
  "      <div class=\"search-box\">",
  "        <svg viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m21 21-3.8-3.8\"/></svg>",
  "        <input id=\"searchInput\" type=\"search\" data-i18n-placeholder=\"search_placeholder\" placeholder=\"ابحث عن فريق...\">",
  "      </div>",
  "    </section>",
  "",
  "    <section id=\"matches\" class=\"matches-section\">",
  "      <div class=\"section-head\">",
  "        <div>",
  "          <span class=\"eyebrow\" data-i18n=\"section_eyebrow\">مركز المباريات</span>",
  "          <h2 data-i18n=\"section_title\">مباريات اليوم</h2>",
  "        </div>",
  "        <div class=\"filters\" role=\"tablist\">",
  "          <button class=\"filter active\" data-filter=\"all\" data-i18n=\"filter_all\">الكل</button>",
  "          <button class=\"filter\" data-filter=\"live\" data-i18n=\"filter_live\">مباشر</button>",
  "          <button class=\"filter\" data-filter=\"scheduled\" data-i18n=\"filter_scheduled\">لم تبدأ</button>",
  "          <button class=\"filter\" data-filter=\"finished\" data-i18n=\"filter_finished\">انتهت</button>",
  "        </div>",
  "      </div>",
  "",
  "      <div id=\"state\" class=\"state\" data-i18n=\"state_loading\">جاري تحميل المباريات...</div>",
  "      <div id=\"matchesGrid\" class=\"matches-grid\"></div>",
  "    </section>",
  "  </main>",
  "",
  "  <footer>",
  "    <div class=\"pitch-line\" aria-hidden=\"true\"></div>",
  "    <div class=\"container footer-inner\">",
  "      <div>",
  "        <strong data-i18n=\"brand\">كورة لايف</strong>",
  "        <span data-i18n=\"footer_tag\">منصة نتائج مباريات كرة القدم مباشرة</span>",
  "      </div>",
  "      <span class=\"footer-source\">Powered by API-Football</span>",
  "    </div>",
  "  </footer>",
  "",
  "  <script src=\"/app.js\"></script>",
  "</body>",
  "</html>",
  ""
].join("\n");

const STYLE_CSS = [
  "* { box-sizing: border-box; }",
  "",
  ":root {",
  "  --bg: #F2F6F0;",
  "  --surface: #FFFFFF;",
  "  --surface-2: #EBF1E7;",
  "  --text: #0E1B14;",
  "  --muted: #5C6E60;",
  "  --border: #DCE6D8;",
  "  --pitch: #0F5132;",
  "  --turf: #16A34A;",
  "  --turf-2: #22C55E;",
  "  --live: #E11D2E;",
  "  --amber: #F59E0B;",
  "  --shadow: 0 18px 44px rgba(15, 45, 25, .09);",
  "  --radius-lg: 22px;",
  "  --radius-md: 16px;",
  "  --radius-sm: 10px;",
  "  --font-display: 'Oswald', 'Tajawal', sans-serif;",
  "  --font-body: 'Inter', 'Tajawal', sans-serif;",
  "}",
  "",
  "html[lang=\"ar\"] {",
  "  --font-display: 'Tajawal', sans-serif;",
  "  --font-body: 'Tajawal', sans-serif;",
  "}",
  "",
  "html.dark {",
  "  --bg: #0A130D;",
  "  --surface: #111C15;",
  "  --surface-2: #0E1811;",
  "  --text: #EAF2EA;",
  "  --muted: #8CA091;",
  "  --border: #1E2E23;",
  "  --pitch: #1B7A45;",
  "  --turf: #34D07A;",
  "  --turf-2: #4CDB8C;",
  "  --live: #FF4D5E;",
  "  --amber: #FBBF24;",
  "  --shadow: 0 22px 50px rgba(0, 0, 0, .45);",
  "}",
  "",
  "html, body { height: 100%; }",
  "body {",
  "  margin: 0;",
  "  background: var(--bg);",
  "  color: var(--text);",
  "  font-family: var(--font-body);",
  "  transition: background .25s ease, color .25s ease;",
  "}",
  "",
  ".container { width: min(1180px, calc(100% - 32px)); margin: auto; }",
  "",
  "/* ---------- Pitch line signature ---------- */",
  ".pitch-line {",
  "  height: 2px;",
  "  background: repeating-linear-gradient(to right, var(--border) 0 10px, transparent 10px 20px);",
  "  position: relative;",
  "}",
  ".pitch-line::after {",
  "  content: \"\";",
  "  position: absolute;",
  "  top: 50%; left: 50%;",
  "  width: 9px; height: 9px;",
  "  border-radius: 50%;",
  "  background: var(--turf);",
  "  transform: translate(-50%, -50%);",
  "}",
  "",
  "/* ---------- Topbar ---------- */",
  ".topbar {",
  "  position: sticky; top: 0; z-index: 20;",
  "  background: color-mix(in srgb, var(--surface) 92%, transparent);",
  "  backdrop-filter: blur(14px);",
  "}",
  ".nav { min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }",
  ".brand {",
  "  color: var(--text); text-decoration: none;",
  "  font-family: var(--font-display); font-weight: 700;",
  "  font-size: 22px; letter-spacing: .2px;",
  "  display: flex; gap: 10px; align-items: center;",
  "}",
  ".brand-ball { font-size: 24px; }",
  ".nav-actions { display: flex; align-items: center; gap: 10px; }",
  "",
  ".pill-btn, .icon-btn, .round-btn, .today-btn {",
  "  border: 1px solid var(--border);",
  "  background: var(--surface);",
  "  color: var(--text);",
  "  border-radius: 999px;",
  "  cursor: pointer;",
  "  font-family: var(--font-body);",
  "  transition: .15s ease;",
  "}",
  ".pill-btn { padding: 9px 16px; font-weight: 700; font-size: 13px; }",
  ".pill-btn:hover, .icon-btn:hover, .round-btn:hover, .today-btn:hover {",
  "  border-color: var(--turf); color: var(--turf);",
  "}",
  ".icon-btn { width: 42px; height: 42px; display: grid; place-items: center; }",
  "",
  "/* ---------- Hero ---------- */",
  ".hero {",
  "  margin-top: 26px; padding: 38px; border-radius: var(--radius-lg);",
  "  background: linear-gradient(155deg, var(--pitch), var(--turf) 130%);",
  "  background-image:",
  "    repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 40px, transparent 40px 80px),",
  "    linear-gradient(155deg, var(--pitch), var(--turf) 130%);",
  "  color: #F4FBF6;",
  "  display: flex; justify-content: space-between; align-items: center; gap: 28px; flex-wrap: wrap;",
  "  box-shadow: var(--shadow);",
  "  position: relative; overflow: hidden;",
  "}",
  ".hero-copy { max-width: 620px; }",
  ".eyebrow {",
  "  font-family: var(--font-display); font-size: 12px; font-weight: 700;",
  "  letter-spacing: 2px; opacity: .85; text-transform: uppercase;",
  "}",
  ".hero h1 {",
  "  font-family: var(--font-display);",
  "  margin: 10px 0 8px; font-weight: 700;",
  "  font-size: clamp(26px, 4.4vw, 40px); line-height: 1.15;",
  "}",
  ".hero p { margin: 0; opacity: .92; font-size: 15px; max-width: 46ch; }",
  ".hero-stat {",
  "  min-width: 170px; text-align: center; padding: 22px 18px;",
  "  background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.2);",
  "  border-radius: var(--radius-md); backdrop-filter: blur(6px);",
  "}",
  ".hero-stat strong {",
  "  display: block; font-family: var(--font-display);",
  "  font-size: 38px; font-weight: 700; font-variant-numeric: tabular-nums;",
  "}",
  ".hero-stat > span { font-size: 13px; opacity: .9; }",
  ".live-badge {",
  "  margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;",
  "  font-size: 11px; font-weight: 700; color: #FFE8CC;",
  "}",
  ".live-badge .dot {",
  "  width: 8px; height: 8px; border-radius: 50%; background: var(--live);",
  "  box-shadow: 0 0 0 0 rgba(225,29,46,.6);",
  "  animation: pulse 1.6s infinite;",
  "}",
  "@keyframes pulse {",
  "  0% { box-shadow: 0 0 0 0 rgba(225,29,46,.55); }",
  "  70% { box-shadow: 0 0 0 8px rgba(225,29,46,0); }",
  "  100% { box-shadow: 0 0 0 0 rgba(225,29,46,0); }",
  "}",
  "",
  "/* ---------- Toolbar ---------- */",
  ".toolbar { margin: 20px 0; display: flex; gap: 14px; flex-wrap: wrap; }",
  ".date-bar {",
  "  flex: 1 1 320px; display: flex; align-items: center; justify-content: center; gap: 14px;",
  "  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px;",
  "}",
  ".round-btn { width: 40px; height: 40px; font-size: 22px; line-height: 1; }",
  ".date-display { text-align: center; min-width: 160px; }",
  ".date-display small { display: block; color: var(--muted); font-size: 11px; }",
  ".date-display strong { font-family: var(--font-display); font-weight: 600; }",
  ".today-btn { padding: 0 18px; height: 40px; font-size: 13px; font-weight: 700; }",
  "",
  ".search-box {",
  "  flex: 1 1 240px; display: flex; align-items: center; gap: 9px;",
  "  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);",
  "  padding: 0 14px; color: var(--muted);",
  "}",
  ".search-box input {",
  "  border: 0; background: transparent; outline: none; color: var(--text);",
  "  font-family: var(--font-body); font-size: 14px; padding: 11px 0; width: 100%;",
  "}",
  "",
  "/* ---------- Section head / filters ---------- */",
  ".section-head { display: flex; justify-content: space-between; align-items: end; gap: 16px; margin: 30px 0 16px; flex-wrap: wrap; }",
  "h2 { font-family: var(--font-display); font-weight: 600; margin: 4px 0 0; font-size: 24px; }",
  ".filters { display: flex; gap: 7px; flex-wrap: wrap; }",
  ".filter {",
  "  border: 1px solid var(--border); background: var(--surface); color: var(--muted);",
  "  border-radius: var(--radius-sm); padding: 8px 14px; cursor: pointer; font-family: var(--font-body);",
  "  font-weight: 600; font-size: 13px; transition: .15s;",
  "}",
  ".filter.active { background: var(--turf); color: white; border-color: var(--turf); }",
  ".filter:hover:not(.active) { border-color: var(--turf); color: var(--turf); }",
  "",
  "/* ---------- Matches ---------- */",
  ".matches-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 14px; }",
  ".league-card {",
  "  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);",
  "  overflow: hidden; box-shadow: var(--shadow);",
  "}",
  ".league-head {",
  "  display: flex; align-items: center; gap: 10px; padding: 13px 16px;",
  "  background: var(--surface-2);",
  "}",
  ".league-head img { width: 26px; height: 26px; object-fit: contain; }",
  ".league-head .league-names { flex: 1; }",
  ".league-head strong { display: block; font-size: 14px; }",
  ".league-head small { display: block; color: var(--muted); font-size: 12px; }",
  ".fav-btn {",
  "  border: none; background: none; cursor: pointer; font-size: 18px; line-height: 1;",
  "  color: var(--border); padding: 4px;",
  "}",
  ".fav-btn.active { color: var(--amber); }",
  "",
  ".match { border-top: 1px solid var(--border); }",
  ".match summary {",
  "  list-style: none; cursor: pointer; padding: 15px 16px;",
  "  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px;",
  "  transition: background .15s;",
  "}",
  ".match summary::-webkit-details-marker { display: none; }",
  ".match summary:hover { background: var(--surface-2); }",
  ".match[open] summary { background: var(--surface-2); }",
  "",
  ".side { display: flex; align-items: center; gap: 9px; min-width: 0; }",
  ".side.away { justify-content: flex-start; }",
  ".side.home { justify-content: flex-end; text-align: right; }",
  ".side img { width: 28px; height: 28px; object-fit: contain; flex-shrink: 0; }",
  ".team-name {",
  "  font-weight: 700; font-size: 13.5px; line-height: 1.25;",
  "  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;",
  "  overflow: hidden;",
  "}",
  "",
  ".score-box { text-align: center; min-width: 92px; }",
  ".score {",
  "  display: block; font-family: var(--font-display); font-size: 21px; font-weight: 700;",
  "  font-variant-numeric: tabular-nums;",
  "}",
  ".status { display: block; font-size: 10.5px; font-weight: 700; color: var(--muted); margin-top: 2px; letter-spacing: .3px; }",
  ".status.live { color: var(--live); }",
  ".status.scheduled { color: var(--turf); }",
  "",
  ".match-detail {",
  "  padding: 0 16px 16px; display: flex; gap: 22px; flex-wrap: wrap;",
  "  font-size: 12.5px; color: var(--muted); border-top: 1px dashed var(--border); margin-top: 2px; padding-top: 12px;",
  "}",
  ".match-detail b { color: var(--text); font-weight: 700; margin-inline-end: 5px; }",
  "",
  "/* ---------- State / empty ---------- */",
  ".state {",
  "  padding: 50px 20px; text-align: center; background: var(--surface);",
  "  border: 1px dashed var(--border); border-radius: var(--radius-lg); color: var(--muted);",
  "  font-weight: 600;",
  "}",
  "",
  "/* ---------- Footer ---------- */",
  "footer { margin-top: 56px; }",
  ".footer-inner {",
  "  padding: 26px 0; display: flex; justify-content: space-between; align-items: center;",
  "  color: var(--muted); flex-wrap: wrap; gap: 10px;",
  "}",
  ".footer-inner strong { display: block; color: var(--text); font-family: var(--font-display); }",
  ".footer-source { font-size: 12px; }",
  "",
  "/* ---------- Icons ---------- */",
  ".icon-moon { display: block; }",
  "html.dark .icon-moon { color: var(--amber); }",
  "",
  "/* ---------- Focus ---------- */",
  "a:focus-visible, button:focus-visible, input:focus-visible, summary:focus-visible {",
  "  outline: 2px solid var(--turf); outline-offset: 2px;",
  "}",
  "",
  "/* ---------- Reduced motion ---------- */",
  "@media (prefers-reduced-motion: reduce) {",
  "  * { animation-duration: .001ms !important; transition-duration: .001ms !important; }",
  "}",
  "",
  "/* ---------- Responsive ---------- */",
  "@media (max-width: 720px) {",
  "  .hero { padding: 26px; flex-direction: column; align-items: stretch; }",
  "  .hero-stat { width: 100%; }",
  "  .toolbar { flex-direction: column; }",
  "  .date-bar, .search-box { flex: 1 1 auto; width: 100%; }",
  "  .matches-grid { grid-template-columns: 1fr; }",
  "  .footer-inner { flex-direction: column; align-items: flex-start; }",
  "}",
  ""
].join("\n");

const APP_JS = [
  "/* ---------------- i18n ---------------- */",
  "const DICT = {",
  "  ar: {",
  "    brand: \"كورة لايف\",",
  "    eyebrow_hero: \"لوحة النتائج المباشرة\",",
  "    hero_title: \"نتائج مباريات كرة القدم، لحظة بلحظة.\",",
  "    hero_desc: \"تابع مباريات اليوم والنتائج المباشرة من مصدر بيانات رياضي موثوق.\",",
  "    hero_stat_label: \"مباراة اليوم\",",
  "    live_now: \"مباراة مباشرة الآن\",",
  "    date_label: \"التاريخ\",",
  "    today: \"اليوم\",",
  "    search_placeholder: \"ابحث عن فريق...\",",
  "    section_eyebrow: \"مركز المباريات\",",
  "    section_title: \"مباريات اليوم\",",
  "    filter_all: \"الكل\",",
  "    filter_live: \"مباشر\",",
  "    filter_scheduled: \"لم تبدأ\",",
  "    filter_finished: \"انتهت\",",
  "    state_loading: \"جاري تحميل المباريات...\",",
  "    state_empty: \"لا توجد مباريات مطابقة لهذا البحث أو الفلتر.\",",
  "    state_error: \"تعذّر تحميل المباريات، حاول مرة أخرى.\",",
  "    status_live: \"مباشر\",",
  "    status_finished: \"انتهت\",",
  "    venue_label: \"الملعب\",",
  "    referee_label: \"الحكم\",",
  "    footer_tag: \"منصة نتائج مباريات كرة القدم مباشرة\",",
  "    theme_toggle: \"تبديل المظهر\",",
  "    lang_toggle: \"English\",",
  "    league_fallback: \"بطولة\",",
  "    team_fallback: \"الفريق\",",
  "  },",
  "  en: {",
  "    brand: \"Kora Live\",",
  "    eyebrow_hero: \"LIVE SCOREBOARD\",",
  "    hero_title: \"Football scores, live.\",",
  "    hero_desc: \"Follow today's fixtures and live scores from a trusted sports data source.\",",
  "    hero_stat_label: \"matches today\",",
  "    live_now: \"matches live now\",",
  "    date_label: \"Date\",",
  "    today: \"Today\",",
  "    search_placeholder: \"Search a team...\",",
  "    section_eyebrow: \"MATCH CENTER\",",
  "    section_title: \"Today's Fixtures\",",
  "    filter_all: \"All\",",
  "    filter_live: \"Live\",",
  "    filter_scheduled: \"Upcoming\",",
  "    filter_finished: \"Finished\",",
  "    state_loading: \"Loading fixtures…\",",
  "    state_empty: \"No matches for this search or filter.\",",
  "    state_error: \"Couldn't load fixtures, please try again.\",",
  "    status_live: \"LIVE\",",
  "    status_finished: \"FT\",",
  "    venue_label: \"Venue\",",
  "    referee_label: \"Referee\",",
  "    footer_tag: \"Live football scores platform\",",
  "    theme_toggle: \"Toggle theme\",",
  "    lang_toggle: \"العربية\",",
  "    league_fallback: \"League\",",
  "    team_fallback: \"Team\",",
  "  }",
  "};",
  "",
  "const state = {",
  "  lang: localStorage.getItem(\"lang\") || \"ar\",",
  "  date: localDate(),",
  "  filter: \"all\",",
  "  query: \"\",",
  "  matches: [],",
  "  favLeagues: JSON.parse(localStorage.getItem(\"favLeagues\") || \"[]\")",
  "};",
  "",
  "function t(key) {",
  "  return DICT[state.lang][key] || DICT.ar[key] || key;",
  "}",
  "",
  "function applyLang() {",
  "  const dir = state.lang === \"ar\" ? \"rtl\" : \"ltr\";",
  "  document.documentElement.lang = state.lang;",
  "  document.documentElement.dir = dir;",
  "  document.title = state.lang === \"ar\"",
  "    ? \"كورة لايف | نتائج مباريات كرة القدم\"",
  "    : \"Kora Live | Football Scores\";",
  "",
  "  document.querySelectorAll(\"[data-i18n]\").forEach(el => {",
  "    el.textContent = t(el.dataset.i18n);",
  "  });",
  "  document.querySelectorAll(\"[data-i18n-placeholder]\").forEach(el => {",
  "    el.placeholder = t(el.dataset.i18nPlaceholder);",
  "  });",
  "  document.querySelectorAll(\"[data-i18n-aria]\").forEach(el => {",
  "    el.setAttribute(\"aria-label\", t(el.dataset.i18nAria));",
  "  });",
  "",
  "  document.getElementById(\"selectedDate\").textContent = formatDate(state.date);",
  "}",
  "",
  "/* ---------------- Date helpers ---------------- */",
  "function localDate(d = new Date()) {",
  "  const parts = new Intl.DateTimeFormat(\"en-CA\", {",
  "    timeZone: \"Africa/Cairo\",",
  "    year: \"numeric\", month: \"2-digit\", day: \"2-digit\"",
  "  }).formatToParts(d);",
  "  const get = t => parts.find(x => x.type === t).value;",
  "  return `${get(\"year\")}-${get(\"month\")}-${get(\"day\")}`;",
  "}",
  "",
  "function shiftDate(date, days) {",
  "  const d = new Date(`${date}T12:00:00`);",
  "  d.setDate(d.getDate() + days);",
  "  return d.toISOString().slice(0, 10);",
  "}",
  "",
  "function formatDate(date) {",
  "  const locale = state.lang === \"ar\" ? \"ar-EG\" : \"en-GB\";",
  "  return new Intl.DateTimeFormat(locale, {",
  "    timeZone: \"Africa/Cairo\", weekday: \"long\", day: \"numeric\", month: \"long\"",
  "  }).format(new Date(`${date}T12:00:00`));",
  "}",
  "",
  "function formatTime(iso) {",
  "  const locale = state.lang === \"ar\" ? \"ar-EG\" : \"en-GB\";",
  "  return new Intl.DateTimeFormat(locale, {",
  "    timeZone: \"Africa/Cairo\", hour: \"2-digit\", minute: \"2-digit\"",
  "  }).format(new Date(iso));",
  "}",
  "",
  "/* ---------------- Utils ---------------- */",
  "function esc(s = \"\") {",
  "  return String(s).replace(/[&<>\"']/g, c => ({",
  "    \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#039;\"",
  "  }[c]));",
  "}",
  "",
  "function statusType(s) {",
  "  const live = [\"1H\", \"2H\", \"ET\", \"BT\", \"P\", \"LIVE\", \"HT\"];",
  "  const finished = [\"FT\", \"AET\", \"PEN\", \"AWD\", \"WO\", \"CANC\", \"ABD\"];",
  "  if (live.includes(s)) return \"live\";",
  "  if (finished.includes(s)) return \"finished\";",
  "  return \"scheduled\";",
  "}",
  "",
  "function statusLabel(m) {",
  "  const type = statusType(m.status.short);",
  "  if (type === \"live\") return `● ${m.status.elapsed ? m.status.elapsed + \"'\" : t(\"status_live\")}`;",
  "  if (type === \"finished\") return t(\"status_finished\");",
  "  return formatTime(m.date);",
  "}",
  "",
  "/* ---------------- Data loading ---------------- */",
  "async function loadMatches() {",
  "  const stateEl = document.getElementById(\"state\");",
  "  const grid = document.getElementById(\"matchesGrid\");",
  "  stateEl.textContent = t(\"state_loading\");",
  "  stateEl.style.display = \"block\";",
  "  grid.innerHTML = \"\";",
  "",
  "  try {",
  "    const res = await fetch(`/api/fixtures?date=${encodeURIComponent(state.date)}`);",
  "    const data = await res.json();",
  "    if (!res.ok) throw new Error(data.message || t(\"state_error\"));",
  "",
  "    state.matches = data.results || [];",
  "    document.getElementById(\"selectedDate\").textContent = formatDate(state.date);",
  "",
  "    document.getElementById(\"matchCount\").textContent = state.matches.length.toLocaleString(\"en-US\");",
  "",
  "    const liveCount = state.matches.filter(m => statusType(m.status.short) === \"live\").length;",
  "    const liveBadge = document.getElementById(\"liveBadge\");",
  "    if (liveCount > 0) {",
  "      liveBadge.hidden = false;",
  "      document.getElementById(\"liveCount\").textContent = liveCount.toLocaleString(\"en-US\");",
  "    } else {",
  "      liveBadge.hidden = true;",
  "    }",
  "",
  "    render();",
  "  } catch (e) {",
  "    stateEl.textContent = e.message || t(\"state_error\");",
  "  }",
  "}",
  "",
  "/* ---------------- Render ---------------- */",
  "function render() {",
  "  const grid = document.getElementById(\"matchesGrid\");",
  "  const stateEl = document.getElementById(\"state\");",
  "  const q = state.query.trim().toLowerCase();",
  "",
  "  let list = state.matches.filter(m => {",
  "    const type = statusType(m.status.short);",
  "    const matchesFilter = state.filter === \"all\" || state.filter === type;",
  "    const matchesQuery = !q ||",
  "      (m.home.name || \"\").toLowerCase().includes(q) ||",
  "      (m.away.name || \"\").toLowerCase().includes(q);",
  "    return matchesFilter && matchesQuery;",
  "  });",
  "",
  "  if (!list.length) {",
  "    grid.innerHTML = \"\";",
  "    stateEl.textContent = t(\"state_empty\");",
  "    stateEl.style.display = \"block\";",
  "    return;",
  "  }",
  "  stateEl.style.display = \"none\";",
  "",
  "  const groups = new Map();",
  "  for (const m of list) {",
  "    const key = `${m.league.id}-${m.league.name}`;",
  "    if (!groups.has(key)) groups.set(key, []);",
  "    groups.get(key).push(m);",
  "  }",
  "",
  "  const sortedGroups = [...groups.values()].sort((a, b) => {",
  "    const aFav = state.favLeagues.includes(a[0].league.id) ? 0 : 1;",
  "    const bFav = state.favLeagues.includes(b[0].league.id) ? 0 : 1;",
  "    return aFav - bFav;",
  "  });",
  "",
  "  grid.innerHTML = sortedGroups.map(group => {",
  "    const league = group[0].league;",
  "    const isFav = state.favLeagues.includes(league.id);",
  "    return `",
  "      <article class=\"league-card\">",
  "        <div class=\"league-head\">",
  "          ${league.logo ? `<img src=\"${esc(league.logo)}\" alt=\"\" loading=\"lazy\">` : \"\"}",
  "          <div class=\"league-names\">",
  "            <strong>${esc(league.name || t(\"league_fallback\"))}</strong>",
  "            <small>${esc(league.country || \"\")}</small>",
  "          </div>",
  "          <button class=\"fav-btn ${isFav ? \"active\" : \"\"}\" data-league=\"${league.id}\" aria-label=\"favorite\">★</button>",
  "        </div>",
  "        ${group.map(matchRow).join(\"\")}",
  "      </article>",
  "    `;",
  "  }).join(\"\");",
  "",
  "  grid.querySelectorAll(\".fav-btn\").forEach(btn => {",
  "    btn.onclick = () => {",
  "      const id = Number(btn.dataset.league);",
  "      const idx = state.favLeagues.indexOf(id);",
  "      if (idx === -1) state.favLeagues.push(id); else state.favLeagues.splice(idx, 1);",
  "      localStorage.setItem(\"favLeagues\", JSON.stringify(state.favLeagues));",
  "      render();",
  "    };",
  "  });",
  "}",
  "",
  "function matchRow(m) {",
  "  const type = statusType(m.status.short);",
  "  const homeLogo = m.home.logo ? `<img src=\"${esc(m.home.logo)}\" alt=\"\" loading=\"lazy\">` : \"\";",
  "  const awayLogo = m.away.logo ? `<img src=\"${esc(m.away.logo)}\" alt=\"\" loading=\"lazy\">` : \"\";",
  "",
  "  const score = m.goals.home == null && m.goals.away == null",
  "    ? \"—\"",
  "    : `${m.goals.home ?? 0} - ${m.goals.away ?? 0}`;",
  "",
  "  const details = [];",
  "  if (m.venue && m.venue.name) details.push(`<span><b>${t(\"venue_label\")}</b>${esc(m.venue.name)}</span>`);",
  "  if (m.referee) details.push(`<span><b>${t(\"referee_label\")}</b>${esc(m.referee)}</span>`);",
  "",
  "  return `",
  "    <details class=\"match\" data-id=\"${m.id}\">",
  "      <summary>",
  "        <div class=\"side home\">",
  "          <span class=\"team-name\">${esc(m.home.name || t(\"team_fallback\"))}</span>",
  "          ${homeLogo}",
  "        </div>",
  "        <div class=\"score-box\">",
  "          <span class=\"score\">${score}</span>",
  "          <span class=\"status ${type}\">${statusLabel(m)}</span>",
  "        </div>",
  "        <div class=\"side away\">",
  "          ${awayLogo}",
  "          <span class=\"team-name\">${esc(m.away.name || t(\"team_fallback\"))}</span>",
  "        </div>",
  "      </summary>",
  "      ${details.length ? `<div class=\"match-detail\">${details.join(\"\")}</div>` : \"\"}",
  "    </details>",
  "  `;",
  "}",
  "",
  "/* ---------------- Events ---------------- */",
  "document.getElementById(\"prevDay\").onclick = () => { state.date = shiftDate(state.date, -1); loadMatches(); };",
  "document.getElementById(\"nextDay\").onclick = () => { state.date = shiftDate(state.date, 1); loadMatches(); };",
  "document.getElementById(\"todayBtn\").onclick = () => { state.date = localDate(); loadMatches(); };",
  "",
  "document.querySelectorAll(\".filter\").forEach(btn => {",
  "  btn.onclick = () => {",
  "    document.querySelectorAll(\".filter\").forEach(b => b.classList.remove(\"active\"));",
  "    btn.classList.add(\"active\");",
  "    state.filter = btn.dataset.filter;",
  "    render();",
  "  };",
  "});",
  "",
  "let searchTimer;",
  "document.getElementById(\"searchInput\").oninput = (e) => {",
  "  clearTimeout(searchTimer);",
  "  searchTimer = setTimeout(() => { state.query = e.target.value; render(); }, 150);",
  "};",
  "",
  "document.getElementById(\"themeBtn\").onclick = () => {",
  "  document.documentElement.classList.toggle(\"dark\");",
  "  localStorage.setItem(\"dark\", document.documentElement.classList.contains(\"dark\") ? \"1\" : \"0\");",
  "};",
  "if (localStorage.getItem(\"dark\") === \"1\") document.documentElement.classList.add(\"dark\");",
  "",
  "document.getElementById(\"langBtn\").onclick = () => {",
  "  state.lang = state.lang === \"ar\" ? \"en\" : \"ar\";",
  "  localStorage.setItem(\"lang\", state.lang);",
  "  applyLang();",
  "  render();",
  "};",
  "",
  "/* ---------------- Init ---------------- */",
  "applyLang();",
  "loadMatches();",
  "",
  "// Gentle auto-refresh for live matches on today's view.",
  "setInterval(() => {",
  "  if (state.date === localDate()) loadMatches();",
  "}, 60000);",
  ""
].join("\n");

const API_BASE = "https://v3.football.api-sports.io";

function todayKey(timezone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function normalizeFixture(item) {
  const f = item.fixture || {};
  const league = item.league || {};
  const teams = item.teams || {};
  const goals = item.goals || {};
  const status = f.status || {};

  return {
    id: f.id,
    date: f.date,
    timestamp: f.timestamp,
    referee: f.referee,
    venue: f.venue || {},
    status: {
      short: status.short,
      long: status.long,
      elapsed: status.elapsed,
      extra: status.extra
    },
    league: {
      id: league.id,
      name: league.name,
      country: league.country,
      logo: league.logo,
      flag: league.flag
    },
    home: teams.home || {},
    away: teams.away || {},
    goals: {
      home: goals.home,
      away: goals.away
    }
  };
}

export async function callFootballApi(endpoint, params, env) {
  if (!env.API_FOOTBALL_KEY) {
    const err = new Error("API_FOOTBALL_KEY is missing. Add it in Cloudflare Pages > Settings > Environment variables.");
    err.status = 500;
    throw err;
  }

  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}/${endpoint}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: {
      "x-apisports-key": env.API_FOOTBALL_KEY,
      "Accept": "application/json"
    }
  });

  const data = await res.json();

  if (!res.ok || (data.errors && Object.keys(data.errors).length)) {
    const err = new Error("API-Football returned an error.");
    err.status = res.status || 502;
    err.details = data.errors || data;
    throw err;
  }

  return data;
}

function jsonError(error) {
  return new Response(
    JSON.stringify({
      success: false,
      message: error.message || "Unexpected error.",
      details: error.details || null
    }),
    {
      status: error.status || 500,
      headers: { "content-type": "application/json; charset=utf-8" }
    }
  );
}


function jsonError(error) {
  return new Response(
    JSON.stringify({
      success: false,
      message: error.message || "Unexpected error.",
      details: error.details || null
    }),
    {
      status: error.status || 500,
      headers: { "content-type": "application/json; charset=utf-8" }
    }
  );
}

async function handleHealth(env) {
  const timezone = env.TIMEZONE || "Africa/Cairo";
  return new Response(
    JSON.stringify({
      ok: true,
      apiConfigured: Boolean(env.API_FOOTBALL_KEY),
      timezone,
      today: todayKey(timezone)
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } }
  );
}

async function handleFixtures(request, env, ctx) {
  const timezone = env.TIMEZONE || "Africa/Cairo";
  const ttl = Number(env.FIXTURES_CACHE_S || 1800);
  const url = new URL(request.url);
  const date = url.searchParams.get("date") || todayKey(timezone);

  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await callFootballApi("fixtures", { date, timezone }, env);
    const payload = {
      success: true,
      date,
      cached: false,
      results: (data.response || []).map(normalizeFixture)
    };
    const response = new Response(JSON.stringify(payload), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${ttl}`
      }
    });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    return jsonError(error);
  }
}

async function handleLive(request, env, ctx) {
  const timezone = env.TIMEZONE || "Africa/Cairo";
  const ttl = Number(env.LIVE_CACHE_S || 60);

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await callFootballApi("fixtures", { live: "all", timezone }, env);
    const payload = {
      success: true,
      cached: false,
      results: (data.response || []).map(normalizeFixture)
    };
    const response = new Response(JSON.stringify(payload), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${ttl}`
      }
    });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    return jsonError(error);
  }
}

async function handleFixtureById(request, env, ctx, id) {
  const timezone = env.TIMEZONE || "Africa/Cairo";

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await callFootballApi("fixtures", { id, timezone }, env);
    const payload = {
      success: true,
      cached: false,
      result: (data.response && data.response[0]) || null
    };
    const response = new Response(JSON.stringify(payload), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=600"
      }
    });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    return jsonError(error);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/style.css") {
      return new Response(STYLE_CSS, { headers: { "content-type": "text/css; charset=utf-8" } });
    }
    if (path === "/app.js") {
      return new Response(APP_JS, { headers: { "content-type": "text/javascript; charset=utf-8" } });
    }
    if (path === "/api/health") return handleHealth(env);
    if (path === "/api/fixtures") return handleFixtures(request, env, ctx);
    if (path === "/api/live") return handleLive(request, env, ctx);
    if (path.startsWith("/api/fixture/")) {
      const id = path.split("/").pop();
      return handleFixtureById(request, env, ctx, id);
    }

    return new Response(INDEX_HTML, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
};
