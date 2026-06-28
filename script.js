const countryCodes = {
  "France": "fr",
  "Croatia": "hr",
  "Austria": "at",
  "Senegal": "sn",
  "Belgium": "be",

  "Paraguay": "py",
  "Australia": "au",
  "Ghana": "gh",
  "Netherlands": "nl",
  "England": "gb-eng",

  "Ecuador": "ec",
  "Bosnia and Herzegovina": "ba",
  "USA": "us",
  "Mexico": "mx",
  "Morocco": "ma",

  "Egypt": "eg",
  "Cape Verde": "cv",
  "Ivory Coast": "ci",
  "Germany": "de",
  "Argentina": "ar",

  "Switzerland": "ch",
  "Algeria": "dz",
  "South Africa": "za",
  "Portugal": "pt",
  "Brazil": "br",

  "Japan": "jp",
  "DR Congo": "cd",
  "Sweden": "se",
  "Colombia": "co",
  "Spain": "es"
};

/* =========================
   HELPERS
========================= */

function flagUrl(team) {
  const code = countryCodes[team];
  return code ? `https://flagcdn.com/w40/${code}.png` : "";
}

function isEliminated(team) {
  return sweepstake.eliminatedTeams.includes(team);
}

function getRemainingTeams(playerTeams) {
  return playerTeams.filter(team => !isEliminated(team));
}

/* IMPORTANT: fixes JS date parsing issues */
function parseDate(dateStr) {
  return new Date(dateStr + "T00:00:00");
}

/* =========================
   FIXTURES FEATURE
========================= */

function getUpcomingFixtures(fixtures) {
  if (!fixtures) return [];

  const now = new Date();

  return fixtures
    .filter(f => parseDate(f.date) >= now)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));
}

function getNextThreeFixtures(fixtures) {
  return getUpcomingFixtures(fixtures).slice(0, 3);
}

function getPlayerByTeam(team) {
  for (const [player, teams] of Object.entries(sweepstake.players)) {
    if (teams.includes(team)) return player;
  }
  return null;
}

function renderNextFixtures() {
  const container = document.getElementById("next-fixtures");
  if (!container || !sweepstake.fixtures) return;

  const fixtures = getNextThreeFixtures(sweepstake.fixtures);

  container.innerHTML = `
    ${fixtures.map(f => {
      const homePlayer = getPlayerByTeam(f.home);
      const awayPlayer = getPlayerByTeam(f.away);

      return `
        <div class="next-fixture-row">
          <div>
            <strong>${f.home}</strong>
            <span class="owner">(${homePlayer || "—"})</span>
            vs
            <strong>${f.away}</strong>
            <span class="owner">(${awayPlayer || "—"})</span>
          </div>

          <div style="opacity:0.7">
            ${parseDate(f.date).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short"
            })}
          </div>
        </div>
      `;
    }).join("")}
  `;
}

/* =========================
   LEADERBOARD
========================= */

function renderLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");

  const rows = Object.entries(sweepstake.players)
    .map(([player, teams]) => ({
      player,
      remaining: getRemainingTeams(teams).length
    }))
    .sort((a, b) => {
      if (b.remaining !== a.remaining) return b.remaining - a.remaining;
      return a.player.localeCompare(b.player);
    });

  leaderboard.innerHTML = `
    <div class="leaderboard-header">
      <div>Pos</div>
      <div>Player</div>
      <div>Teams Left</div>
    </div>
    ${rows.map((r, i) => `
      <div class="leaderboard-row">
        <div>${i + 1}</div>
        <div>${r.player}</div>
        <div>${r.remaining}</div>
      </div>
    `).join("")}
  `;
}

/* =========================
   PLAYERS
========================= */

function renderPlayers() {
  const container = document.getElementById("players");

  container.innerHTML = Object.entries(sweepstake.players)
    .map(([player, teams]) => {

      const remainingTeams = getRemainingTeams(teams);

      return `
        <div class="player-card">
          <h3>${player}</h3>

          <div class="teams">
            ${teams.map(team => {
              const eliminated = isEliminated(team);

              return `
                <div class="team ${eliminated ? "out" : "alive"}">
                  ${eliminated
                    ? "❌"
                    : `<img class="flag" src="${flagUrl(team)}" alt="${team} flag">`
                  }
                  ${team}
                </div>
              `;
            }).join("")}
          </div>

          <div class="footer">
            ${remainingTeams.length} teams remaining
          </div>
        </div>
      `;
    })
    .join("");
}

/* =========================
   SUMMARY
========================= */

function updateSummary() {
  const totalRemaining = Object.values(sweepstake.players)
    .flat()
    .filter(team => !isEliminated(team)).length;

  document.getElementById("teamsRemaining").textContent = totalRemaining;
}

/* =========================
   INIT
========================= */

function init() {
  renderLeaderboard();
  renderPlayers();
  updateSummary();
  renderNextFixtures();
}

init();
