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

function getAllPlayerTeams(player) {
  const playerData = sweepstake.players[player];
  return [playerData.topSix, playerData.midTier, ...playerData.restOfWorld];
}

/* IMPORTANT: fixes JS date parsing issues */

function parseDateTime(fixture) {
  return new Date(`${fixture.date}T${fixture.time}:00`);
}

/* =========================
   FIXTURES FEATURE
========================= */
function getUpcomingFixtures(fixtures) {
  const now = new Date();

  return fixtures
    .filter(f => parseDateTime(f) >= now)
    .sort((a, b) => parseDateTime(a) - parseDateTime(b));
}

function getNextThreeFixtures(fixtures) {
  return getUpcomingFixtures(fixtures).slice(0, 3);
}

function getPlayerByTeam(team) {
  for (const [player, playerData] of Object.entries(sweepstake.players)) {
    const allTeams = [playerData.topSix, playerData.midTier, ...playerData.restOfWorld];
    if (allTeams.includes(team)) return player;
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
            ${parseDateTime(f).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short"
            })} • ${f.time}
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
    .map(([player, playerData]) => {
      const allTeams = getAllPlayerTeams(player);
      return {
        player,
        remaining: getRemainingTeams(allTeams).length
      };
    })
    .sort((a, b) => {
      if (b.remaining !== a.remaining) return b.remaining - a.remaining;
      return a.player.localeCompare(b.player);
    });

  const positions = [];
  rows.forEach((row, index) => {
    if (index === 0) {
      positions.push(1);
    } else if (rows[index].remaining === rows[index - 1].remaining) {
      positions.push(positions[index - 1]);
    } else {
      positions.push(index + 1);
    }
  });

  leaderboard.innerHTML = `
    <div class="leaderboard-header">
      <div>Pos</div>
      <div>Player</div>
      <div>Teams Left</div>
    </div>
    ${rows.map((r, i) => `
      <div class="leaderboard-row">
        <div>${positions[i]}${i > 0 && positions[i] === positions[i - 1] ? " (T)" : ""}</div>
        <div>${r.player}</div>
        <div>${r.remaining}</div>
      </div>
    `).join("")}
  `;
}

/* =========================
   BEST OF REST
========================= */

function renderBestOfRest() {
  const container = document.getElementById("best-of-rest");
  
  const players = Object.entries(sweepstake.players)
    .map(([player, playerData]) => {
      const remaining = getRemainingTeams(playerData.restOfWorld);
      return {
        player,
        remaining: remaining.length
      };
    })
    .sort((a, b) => {
      if (b.remaining !== a.remaining) return b.remaining - a.remaining;
      return a.player.localeCompare(b.player);
    });

  const positions = [];
  players.forEach((row, index) => {
    if (index === 0) {
      positions.push(1);
    } else if (players[index].remaining === players[index - 1].remaining) {
      positions.push(positions[index - 1]);
    } else {
      positions.push(index + 1);
    }
  });

  container.innerHTML = `
    <div class="leaderboard-header">
      <div>Pos</div>
      <div>Player</div>
      <div>Teams Left</div>
    </div>
    ${players.map((p, i) => `
      <div class="leaderboard-row">
        <div>${positions[i]}${i > 0 && positions[i] === positions[i - 1] ? " (T)" : ""}</div>
        <div>${p.player}</div>
        <div>${p.remaining}</div>
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
    .map(([player, playerData]) => {
      const allTeams = getAllPlayerTeams(player);
      const remainingTeams = getRemainingTeams(allTeams);

      return `
        <div class="player-card">
          <h3>${player}</h3>

          <div class="teams">
            <div style="font-size: 0.85rem; opacity: 0.6; margin-bottom: 8px; font-weight: 600;">Top 6</div>
            ${[playerData.topSix].map(team => {
              const eliminated = isEliminated(team);
              return `
                <div class="team ${eliminated ? "out" : "alive"}">
                  ${eliminated ? "❌" : `<img class="flag" src="${flagUrl(team)}" alt="${team} flag">`}
                  ${team}
                </div>
              `;
            }).join("")}

            <div style="font-size: 0.85rem; opacity: 0.6; margin-top: 12px; margin-bottom: 8px; font-weight: 600;">7-12 Seeds</div>
            ${[playerData.midTier].map(team => {
              const eliminated = isEliminated(team);
              return `
                <div class="team ${eliminated ? "out" : "alive"}">
                  ${eliminated ? "❌" : `<img class="flag" src="${flagUrl(team)}" alt="${team} flag">`}
                  ${team}
                </div>
              `;
            }).join("")}

            <div style="font-size: 0.85rem; opacity: 0.6; margin-top: 12px; margin-bottom: 8px; font-weight: 600;">Best of the Rest</div>
            ${playerData.restOfWorld.map(team => {
              const eliminated = isEliminated(team);
              return `
                <div class="team ${eliminated ? "out" : "alive"}">
                  ${eliminated ? "❌" : `<img class="flag" src="${flagUrl(team)}" alt="${team} flag">`}
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
    .flatMap(playerData => [playerData.topSix, playerData.midTier, ...playerData.restOfWorld])
    .filter(team => !isEliminated(team)).length;

  document.getElementById("teamsRemaining").textContent = totalRemaining;
}

/* =========================
   INIT
========================= */

function init() {
  renderLeaderboard();
  renderBestOfRest();
  renderPlayers();
  updateSummary();
  renderNextFixtures();
}

init();
