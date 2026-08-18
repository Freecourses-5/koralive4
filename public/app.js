const translations = {
  ar: {
    brand:"كرة لايف", liveBoard:"لوحة النتائج المباشرة",
    heroTitle:"نتائج مباريات كرة القدم، لحظة بلحظة.",
    heroText:"تابع مباريات اليوم والنتائج المباشرة ومعلومات المباراة.",
    todayMatches:"مباراة اليوم", liveNow:"مباراة مباشرة الآن",
    dateLabel:"التاريخ", today:"اليوم", search:"ابحث عن فريق...",
    all:"الكل", favorites:"المفضلة", important:"أهم المباريات",
    matchesCenter:"مركز المباريات", matchesToday:"مباريات اليوم",
    notStarted:"لم تبدأ", finished:"انتهت"
  },
  en: {
    brand:"Football Live", liveBoard:"LIVE RESULTS BOARD",
    heroTitle:"Football results, moment by moment.",
    heroText:"Follow today's matches, live scores and match information.",
    todayMatches:"Today's matches", liveNow:"live match now",
    dateLabel:"Date", today:"Today", search:"Search for a team...",
    all:"All", favorites:"Favorites", important:"Top matches",
    matchesCenter:"MATCH CENTER", matchesToday:"Today's matches",
    notStarted:"Not started", finished:"Finished"
  }
};

const data = [
  {
    name:"Primera A", country:"Colombia",
    matches:[
      {home:"Deportivo Pasto", away:"Bucaramanga", homeLogo:"https://media.api-sports.io/football/teams/1132.png", awayLogo:"https://media.api-sports.io/football/teams/1135.png", score:"–", time:"12:00 AM"},
      {home:"Deportivo Cali", away:"Millonarios", homeLogo:"https://media.api-sports.io/football/teams/1121.png", awayLogo:"https://media.api-sports.io/football/teams/1124.png", score:"–", time:"2:10 AM"}
    ]
  },
  {
    name:"Primera B", country:"Chile",
    matches:[
      {home:"San Luis", away:"Deportes Santa Cruz", homeLogo:"https://media.api-sports.io/football/teams/2337.png", awayLogo:"https://media.api-sports.io/football/teams/2350.png", score:"2 - 0", time:"FT"},
      {home:"Curico Unido", away:"Deportes Copiapo", homeLogo:"https://media.api-sports.io/football/teams/2352.png", awayLogo:"https://media.api-sports.io/football/teams/2349.png", score:"0 - 4", time:"FT"},
      {home:"Recoleta", away:"Deportes Temuco", homeLogo:"https://media.api-sports.io/football/teams/2346.png", awayLogo:"https://media.api-sports.io/football/teams/2344.png", score:"1 - 1", time:"FT"}
    ]
  }
];

let lang = "ar";

function t(key){ return translations[lang][key] || key; }

function render(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
  document.getElementById("langBtn").textContent = lang === "ar" ? "English" : "العربية";

  document.getElementById("leagues").innerHTML = data.map(league => `
    <article class="league">
      <div class="league-head">
        <div>
          <div class="league-name">${league.name}</div>
          <span class="country">${league.country}</span>
        </div>
        <span>☆</span>
      </div>
      <div class="matches">
        ${league.matches.map(m => `
          <div class="match-row" dir="ltr">
            <div class="team home-team">
              <span class="team-name">${m.home}</span>
              <img src="${m.homeLogo}" alt="${m.home}" onerror="this.style.visibility='hidden'">
            </div>
            <div class="match-score">
              <strong>${m.score}</strong>
              <small>${m.time === "FT" ? t("finished") : m.time}</small>
            </div>
            <div class="team away-team">
              <img src="${m.awayLogo}" alt="${m.away}" onerror="this.style.visibility='hidden'">
              <span class="team-name">${m.away}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");
}

document.getElementById("langBtn").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar";
  render();
});

render();
