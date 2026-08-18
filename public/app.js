const DICT = {
  ar: {
    brand:"كورة لايف", loading:"جاري تحميل المباريات...", empty:"لا توجد مباريات مطابقة.",
    error:"تعذّر تحميل البيانات.", live:"مباشر", finished:"انتهت", venue:"الملعب", referee:"الحكم",
    stats:"الإحصائيات", events:"أحداث المباراة", lineups:"التشكيلة", possession:"الاستحواذ",
    shots:"التسديدات", onTarget:"على المرمى", corners:"الركنيات", fouls:"المخالفات",
    accuracy:"دقة التسديد", goals:"الأهداف", cards:"البطاقات", substitutions:"التبديلات",
    starters:"الأساسيون", substitutes:"البدلاء", home:"صاحب الأرض", away:"الضيف",
    noData:"لا توجد بيانات متاحة.", loadingDetails:"جاري تحميل تفاصيل المباراة..."
  },
  en: {
    brand:"Kora Live", loading:"Loading fixtures...", empty:"No matching fixtures.",
    error:"Couldn't load data.", live:"LIVE", finished:"FT", venue:"Venue", referee:"Referee",
    stats:"Statistics", events:"Match Events", lineups:"Lineups", possession:"Possession",
    shots:"Shots", onTarget:"On target", corners:"Corners", fouls:"Fouls",
    accuracy:"Shot accuracy", goals:"Goals", cards:"Cards", substitutions:"Substitutions",
    starters:"Starting XI", substitutes:"Substitutes", home:"Home", away:"Away",
    noData:"No data available.", loadingDetails:"Loading match details..."
  }
};

const TOP_LEAGUE_IDS = [2,3,848,39,40,140,141,135,136,78,79,61,62,88,94,203,307,233,1,4,9,32];

const state = {
  lang: localStorage.getItem("lang") || "ar",
  date: localDate(), filter:"all", scope:"all", query:"",
  matches:[], favLeagues:JSON.parse(localStorage.getItem("favLeagues") || "[]")
};

const $ = s => document.querySelector(s);
const t = key => (DICT[state.lang][key] || DICT.ar[key] || key);

function localDate(d=new Date()) {
  const p = new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Cairo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(d);
  const g = x => p.find(v=>v.type===x).value;
  return `${g("year")}-${g("month")}-${g("day")}`;
}
function shiftDate(date, days) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
}
function formatDate(date) {
  return new Intl.DateTimeFormat(state.lang==="ar"?"ar-EG":"en-GB",
    {timeZone:"Africa/Cairo",weekday:"long",day:"numeric",month:"long"}).format(new Date(`${date}T12:00:00`));
}
function formatTime(iso) {
  return new Intl.DateTimeFormat(state.lang==="ar"?"ar-EG":"en-GB",
    {timeZone:"Africa/Cairo",hour:"2-digit",minute:"2-digit"}).format(new Date(iso));
}
function esc(s="") {
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function statusType(s) {
  if(["1H","2H","ET","BT","P","LIVE","HT"].includes(s)) return "live";
  if(["FT","AET","PEN","AWD","WO","CANC","ABD"].includes(s)) return "finished";
  return "scheduled";
}
function statusLabel(m) {
  const type=statusType(m.status.short);
  if(type==="live") return m.status.elapsed ? `${m.status.elapsed}'` : t("live");
  if(type==="finished") return t("finished");
  return formatTime(m.date);
}

async function loadMatches() {
  $("#state").textContent=t("loading");
  $("#state").style.display="block";
  $("#matchesGrid").innerHTML="";
  try {
    const res=await fetch(`/api/fixtures?date=${encodeURIComponent(state.date)}`);
    const data=await res.json();
    if(!res.ok) throw new Error(data.message||t("error"));
    state.matches=data.results||[];
    $("#selectedDate").textContent=formatDate(state.date);
    $("#matchCount").textContent=state.matches.length.toLocaleString("en-US");
    const liveCount=state.matches.filter(m=>statusType(m.status.short)==="live").length;
    $("#liveBadge").hidden=liveCount===0;
    $("#liveCount").textContent=liveCount;
    render();
  } catch(e) {
    $("#state").textContent=e.message||t("error");
  }
}

function render() {
  const q=state.query.trim().toLowerCase();
  const list=state.matches.filter(m=>{
    const type=statusType(m.status.short);
    const query=!q || (m.home.name||"").toLowerCase().includes(q) || (m.away.name||"").toLowerCase().includes(q);
    const filter=state.filter==="all" || state.filter===type;
    const scope=state.scope==="all" ? true :
      state.scope==="favorites" ? state.favLeagues.includes(m.league.id) :
      TOP_LEAGUE_IDS.includes(m.league.id);
    return query&&filter&&scope;
  });

  if(!list.length){ $("#matchesGrid").innerHTML=""; $("#state").textContent=t("empty"); $("#state").style.display="block"; return; }
  $("#state").style.display="none";

  const groups=new Map();
  list.forEach(m=>{
    const k=`${m.league.id}-${m.league.name}`;
    if(!groups.has(k)) groups.set(k,[]);
    groups.get(k).push(m);
  });

  $("#matchesGrid").innerHTML=[...groups.values()].map(group=>{
    const league=group[0].league, fav=state.favLeagues.includes(league.id);
    return `<article class="league-card">
      <div class="league-head">
        ${league.logo?`<img src="${esc(league.logo)}" alt="" loading="lazy">`:""}
        <div class="league-names"><strong>${esc(league.name||"بطولة")}</strong><small>${esc(league.country||"")}</small></div>
        <button class="fav-btn ${fav?"active":""}" data-league="${league.id}">★</button>
      </div>
      ${group.map(matchRow).join("")}
    </article>`;
  }).join("");

  document.querySelectorAll(".fav-btn").forEach(btn=>{
    btn.onclick=()=>{
      const id=Number(btn.dataset.league), i=state.favLeagues.indexOf(id);
      i===-1?state.favLeagues.push(id):state.favLeagues.splice(i,1);
      localStorage.setItem("favLeagues",JSON.stringify(state.favLeagues)); render();
    };
  });
  document.querySelectorAll(".match-open").forEach(el=>el.onclick=()=>openDetails(Number(el.dataset.id)));
}

function matchRow(m) {
  const type=statusType(m.status.short);
  const score=m.goals.home==null&&m.goals.away==null?"—":`${m.goals.home??0} - ${m.goals.away??0}`;
  return `<button class="match match-open" data-id="${m.id}">
    <div class="side home"><span class="team-name">${esc(m.home.name||"الفريق")}</span>${m.home.logo?`<img src="${esc(m.home.logo)}" alt="">`:""}</div>
    <div class="score-box"><span class="score">${score}</span><span class="status ${type}">${statusLabel(m)}</span></div>
    <div class="side away">${m.away.logo?`<img src="${esc(m.away.logo)}" alt="">`:""}<span class="team-name">${esc(m.away.name||"الفريق")}</span></div>
  </button>`;
}

/* ---------------- Match details ----------------
   Backend contract:
   GET /api/fixture-details?id=FIXTURE_ID
   returns:
   {
     fixture:{...}, teams:{home:{...},away:{...}},
     events:[...], lineups:[...], statistics:[...]
   }
*/
async function openDetails(id) {
  $("#detailsOverlay").hidden=false;
  $("#detailsContent").innerHTML=`<div class="details-loading">${t("loadingDetails")}</div>`;
  document.body.classList.add("modal-open");

  try {
    const res=await fetch(`/api/fixture-details?id=${encodeURIComponent(id)}`);
    const data=await res.json();
    if(!res.ok) throw new Error(data.message||t("error"));
    $("#detailsContent").innerHTML=renderDetails(data);
  } catch(e) {
    $("#detailsContent").innerHTML=`<div class="details-error">${esc(e.message||t("error"))}</div>`;
  }
}
function closeDetails() {
  $("#detailsOverlay").hidden=true;
  document.body.classList.remove("modal-open");
}
$("#closeDetails").onclick=closeDetails;
$("#detailsOverlay").onclick=e=>{ if(e.target===$("#detailsOverlay")) closeDetails(); };
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDetails();});

function renderDetails(data) {
  const f=data.fixture||{}, teams=data.teams||{};
  const home=teams.home||{}, away=teams.away||{};
  const hg=f.goals?.home ?? f.score?.fulltime?.home ?? 0;
  const ag=f.goals?.away ?? f.score?.fulltime?.away ?? 0;

  return `<div class="details-header">
    <div class="competition">${esc(f.league?.name||data.league?.name||"")}</div>
    <div class="details-teams">
      <div><img src="${esc(home.logo||"")}" alt=""><strong>${esc(home.name||"")}</strong></div>
      <div class="details-score"><b>${hg} - ${ag}</b><span>${f.status?.short||""}</span></div>
      <div><img src="${esc(away.logo||"")}" alt=""><strong>${esc(away.name||"")}</strong></div>
    </div>
  </div>
  <div class="details-tabs">
    <button class="details-tab active" data-detail-tab="stats">${t("stats")}</button>
    <button class="details-tab" data-detail-tab="events">${t("events")}</button>
    <button class="details-tab" data-detail-tab="lineups">${t("lineups")}</button>
  </div>
  <section id="detail-stats" class="detail-panel">${renderStats(data.statistics||[],home.id,away.id)}</section>
  <section id="detail-events" class="detail-panel" hidden>${renderEvents(data.events||[],home.id,away.id)}</section>
  <section id="detail-lineups" class="detail-panel" hidden>${renderLineups(data.lineups||[],home.id,away.id)}</section>`;

}
function initDetailTabs() {
  document.querySelectorAll(".details-tab").forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll(".details-tab").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".detail-panel").forEach(p=>p.hidden=true);
    btn.classList.add("active");
    $(`#detail-${btn.dataset.detailTab}`).hidden=false;
  });
}
const oldDetailsObserver = new MutationObserver(()=>initDetailTabs());
oldDetailsObserver.observe($("#detailsContent"),{childList:true});

function valOf(x) {
  if(x==null) return null;
  if(typeof x==="object" && "value" in x) return x.value;
  return x;
}
function renderStats(stats,homeId,awayId) {
  if(!stats.length) return `<div class="no-data">${t("noData")}</div>`;
  const h=stats.find(x=>x.team?.id===homeId)?.statistics||[];
  const a=stats.find(x=>x.team?.id===awayId)?.statistics||[];
  const get=(arr,name)=>valOf(arr.find(x=>x.type===name)?.value) ?? "—";
  const rows=[
    ["Ball possession","الاستحواذ",get(h,"Ball Possession"),get(a,"Ball Possession")],
    ["Total shots","التسديدات",get(h,"Total Shots"),get(a,"Total Shots")],
    ["Shots on Goal","التسديدات على المرمى",get(h,"Shots on Goal"),get(a,"Shots on Goal")],
    ["Corner Kicks","الركنيات",get(h,"Corner Kicks"),get(a,"Corner Kicks")],
    ["Fouls","المخالفات",get(h,"Fouls"),get(a,"Fouls")],
    ["Shot Accuracy","دقة التسديد",shotAccuracy(get(h,"Total Shots"),get(h,"Shots on Goal")),shotAccuracy(get(a,"Total Shots"),get(a,"Shots on Goal"))]
  ];
  return `<div class="stat-list">${rows.map(r=>statRow(r[1],r[2],r[3])).join("")}</div>`;
}
function shotAccuracy(shots,onTarget) {
  const s=parseFloat(String(shots).replace("%","")), o=parseFloat(String(onTarget).replace("%",""));
  return Number.isFinite(s)&&s>0&&Number.isFinite(o)?`${Math.round(o/s*100)}%`:"—";
}
function statRow(label,h,a) {
  return `<div class="stat-row"><span>${esc(h)}</span><div><b>${esc(label)}</b><div class="stat-bar"><i style="width:${barWidth(h,a)}%"></i></div></div><span>${esc(a)}</span></div>`;
}
function barWidth(h,a) {
  const n=v=>parseFloat(String(v).replace("%",""));
  const x=n(h), y=n(a);
  if(!Number.isFinite(x)||!Number.isFinite(y)||x+y===0)return 50;
  return Math.max(8,Math.min(92,x/(x+y)*100));
}
function renderEvents(events,homeId,awayId) {
  if(!events.length)return `<div class="no-data">${t("noData")}</div>`;
  return `<div class="timeline">${events.map(e=>{
    const team=e.team?.id===homeId?"home":"away";
    const icon=e.type==="Goal"?"⚽":e.type==="Card"?(e.detail||"").toLowerCase().includes("red")?"🟥":"🟨":e.type==="subst"?"🔄":"•";
    const player=e.player?.name||"", assist=e.assist?.name||"";
    return `<div class="event ${team}"><span class="event-time">${esc(e.time?.elapsed||"")}′</span><div class="event-icon">${icon}</div><div><strong>${esc(player)}</strong><small>${esc(e.detail||e.type||"")} ${assist?` · ${esc(assist)}`:""}</small></div></div>`;
  }).join("")}</div>`;
}
function renderLineups(lineups,homeId,awayId) {
  if(!lineups.length)return `<div class="no-data">${t("noData")}</div>`;
  return `<div class="lineups">${lineups.map(team=>{
    const isHome=team.team?.id===homeId, players=team.startXI||[], subs=team.substitutes||[];
    return `<div class="lineup-team">
      <div class="lineup-title">${team.team?.logo?`<img src="${esc(team.team.logo)}" alt="">`:""}<strong>${esc(team.team?.name||"")}</strong><span>${esc(team.formation||"")}</span></div>
      <h4>${t("starters")}</h4>${players.map(playerCard).join("")}
      <h4>${t("substitutes")}</h4>${subs.map(playerCard).join("")}
    </div>`;
  }).join("")}</div>`;
}
function playerCard(p) {
  const x=p.player||p;
  return `<div class="player-card"><span class="player-number">${esc(x.number??"")}</span><strong>${esc(x.name||"")}</strong><span>${esc(x.pos||"")}</span>${x.rating?`<b>${esc(x.rating)}</b>`:""}</div>`;
}

$("#prevDay").onclick=()=>{state.date=shiftDate(state.date,-1);loadMatches()};
$("#nextDay").onclick=()=>{state.date=shiftDate(state.date,1);loadMatches()};
$("#todayBtn").onclick=()=>{state.date=localDate();loadMatches()};
document.querySelectorAll(".scope").forEach(b=>b.onclick=()=>{document.querySelectorAll(".scope").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.scope=b.dataset.scope;render()});
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.filter=b.dataset.filter;render()});
let searchTimer;
$("#searchInput").oninput=e=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{state.query=e.target.value;render()},150)};
$("#themeBtn").onclick=()=>{document.documentElement.classList.toggle("dark");localStorage.setItem("dark",document.documentElement.classList.contains("dark")?"1":"0")};
if(localStorage.getItem("dark")==="1")document.documentElement.classList.add("dark");
$("#langBtn").onclick=()=>{state.lang=state.lang==="ar"?"en":"ar";localStorage.setItem("lang",state.lang);document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==="ar"?"rtl":"ltr";$("#langBtn").textContent=state.lang==="ar"?"English":"العربية";render()};
loadMatches();
setInterval(()=>{if(state.date===localDate())loadMatches()},60000);
