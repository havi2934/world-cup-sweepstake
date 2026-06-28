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

/* =========================
   🆕 FIXTURES FEATURE
========================= */

function getUpcomingFixtures(fixtures) {
  const now = new Date();

  return fixtures
    .filter(f => new Date(f.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getNextMatchForTeam(team, fixtures) {
  const upcoming = getUpcomingFixtures(fixtures);

  return upcoming.find(f =>
    f.home === team || f.away === team
  );
}

function buildNextFixturesByPlayer() {
  const result = [];

  if (!sweepstake.fixtures) return result;

  for (const [player, teams] of Object.entries(sweepstake.players)) {

    let bestMatch = null;
    let bestTeam = null;

    for (const team of teams) {
      const match = getNextMatchForTeam(team, sweepstake.fixtures);

      if (match) {
        if (!bestMatch || new Date(match.date) < new Date(bestMatch.date)) {
          bestMatch = match;
          bestTeam = team;
        }
      }
    }

    if (bestMatch) {
      const opponent =
        bestMatch.home === bestTeam
          ? bestMatch.away
          : bestMatch.home;

      result.push({
        player,
        team: bestTeam,
        opponent,
        date: bestMatch.date
      });
    }
  }

  return result;
}

function renderNextFixtures() {
  const container = document.getElementById("next-fixtures");
  if (!container) return;

  const data = buildNextFixturesByPlayer();

  container.innerHTML = `
    <h2>Next Fixtures</h2>
    ${data.map(d => `
      <div class="next-fixture-row">
        <strong>${d.player}</strong> —
        <img class="flag" src="${flagUrl(d.team)}"> ${d.team}
        vs
        <img class="flag" src="${flagUrl(d.opponent)}"> ${d.opponent}
        <span style="opacity:0.7">
          (${new Date(d.date).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short"
          })})
        </span>
      </div>
    `).join("")}
  `;
}

/* =========================
   EXISTING CODE (UNCHANGED)
========================= */

function renderLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");

  const rows = Object.entries(sweepstake.players)
    .map(([player, teams]) => {
      const remaining = getRemainingTeams(teams).length;

      return {
        player,
        remaining
      };
    })
    .sort((a, b) => {
      if (b.remaining !== a.remaining) {
        return b.remaining - a.remaining;
      }
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

function updateSummary() {
  const totalRemaining = Object.values(sweepstake.players)
    .flat()
    .filter(team => !isEliminated(team)).length;

  document.getElementById("teamsRemaining").textContent = totalRemaining;
}

/* =========================
   INIT (UPDATED)
========================= */

function init() {
  renderLeaderboard();
  renderPlayers();
  updateSummary();
  renderNextFixtures(); // 🆕 added
}

init();
