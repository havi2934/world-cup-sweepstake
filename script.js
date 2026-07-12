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
  "Spain": "es",
  "Norway": "no",
  "Canada": "ca",
  "Curaçao": "cw",
  "Haiti": "ht",
  "United States": "us",
  "Cabo Verde": "cv"
};

const countryCodeAliases = {
  "Bosnia & Herzegovina": "Bosnia and Herzegovina",
  "United States of America": "USA",
  "United States": "USA",
};

/* =========================
   HELPERS
========================= */

function normalizeCountryName(team) {
  return countryCodeAliases[team?.trim()] || team?.trim();
}

function flagUrl(team) {
  const normalized = normalizeCountryName(team);
  const code = countryCodes[normalized];
  return code ? `https://flagcdn.com/w40/${code}.png` : "";
}

const eliminationRoundOrder = {
  "Group stage": 1,
  "R32": 2,
  "R16": 3,
  "QF": 4,
  "SF": 5,
  "Final": 6,
  "Winner": 7
};

function getEliminationInfo(team) {
  return (sweepstakeData.eliminatedTeams || []).find(item => item.team === team) || null;
}

function isEliminated(team) {
  return !!getEliminationInfo(team);
}

function getEliminationRound(team) {
  const info = getEliminationInfo(team);
  return info ? info.round : null;
}

function roundRank(round) {
  return eliminationRoundOrder[round] || 0;
}

function getMaxEliminationRound(teams) {
  return teams
    .map(getEliminationRound)
    .filter(Boolean)
    .sort((a, b) => roundRank(b) - roundRank(a))[0] || null;
}

function getRemainingTeams(playerTeams) {
  return playerTeams.filter(team => !isEliminated(team));
}

function getPlayerCategories() {
  return Array.isArray(sweepstake.playerCategories) ? sweepstake.playerCategories : [];
}

function getPlayerCategory(categoryKey) {
  return getPlayerCategories().find(category => category.key === categoryKey) || { key: categoryKey, label: categoryKey, icon: "", single: false };
}

function getPlayerCategoryKeys() {
  return getPlayerCategories().map(category => category.key);
}

function getPlayerTeams(player, categoryKey) {
  const playerData = sweepstake.players[player] || {};
  const teamValue = playerData[categoryKey];
  if (Array.isArray(teamValue)) return teamValue;
  if (teamValue) return [teamValue];
  return [];
}

function getAllPlayerTeams(player) {
  return getPlayerCategoryKeys().flatMap(categoryKey => getPlayerTeams(player, categoryKey));
}

function getSecondaryCategory() {
  const categories = getPlayerCategories();
  return categories.find(category => category.bestOfRest) || categories.find(category => !category.single) || categories[0] || null;
}

function getBestOfRestWinner() {
  return sweepstake.bestOfRestWinner || null;
}

function renderTeam(team) {
  const eliminated = isEliminated(team);
  const eliminationRound = getEliminationRound(team);

  return `
    <div class="team ${eliminated ? "out" : "alive"}">
      <img class="flag" src="${flagUrl(team)}" alt="${team} flag">
      ${team}${eliminated && eliminationRound ? ` (${eliminationRound})` : ""}
    </div>
  `;
}

/* IMPORTANT: fixes JS date parsing issues */
const fixtureTimeZoneOffset = "+01:00"; // UK tournament time (BST)

function parseDateTime(fixture) {
  return new Date(`${fixture.date}T${fixture.time}:00${fixture.timezoneOffset || fixtureTimeZoneOffset}`);
}

function getFixtureEndTime(fixture) {
  const durationMinutes = fixture.durationMinutes || 120;
  return new Date(parseDateTime(fixture).getTime() + durationMinutes * 60 * 1000);
}

function getFixtureStatus(fixture) {
  const now = new Date();
  const start = parseDateTime(fixture);
  const end = getFixtureEndTime(fixture);

  if (now >= start && now < end) {
    return "live";
  }

  if (now < start) {
    return "upcoming";
  }

  return "finished";
}

/* =========================
   FIXTURES FEATURE
========================= */
function getUpcomingFixtures(fixtures) {
  const now = new Date();

  return fixtures
    .filter(f => getFixtureStatus(f) !== "finished")
    .sort((a, b) => parseDateTime(a) - parseDateTime(b));
}

function getNextThreeFixtures(fixtures) {
  return getUpcomingFixtures(fixtures).slice(0, 3);
}

function getPlayerByTeam(team) {
  for (const [player, playerData] of Object.entries(sweepstake.players)) {
    const allTeams = getPlayerCategoryKeys().flatMap(categoryKey => {
      const value = playerData[categoryKey];
      if (Array.isArray(value)) return value;
      if (value) return [value];
      return [];
    });
    if (allTeams.includes(team)) return player;
  }
  return null;
}

function getFixtures() {
  if (Array.isArray(sweepstake.fixtures) && sweepstake.fixtures.length) return sweepstake.fixtures;
  const defaultId = (typeof sweepstakeData !== 'undefined' && sweepstakeData.defaultSweepstakeId) ? sweepstakeData.defaultSweepstakeId : null;
  if (defaultId && sweepstakeData && sweepstakeData.sweepstakes && sweepstakeData.sweepstakes[defaultId]) {
    return sweepstakeData.sweepstakes[defaultId].fixtures || [];
  }
  return [];
}

function getGoldenBoot() {
  if (Array.isArray(sweepstake.goldenBoot) && sweepstake.goldenBoot.length) return sweepstake.goldenBoot;
  const defaultId = (typeof sweepstakeData !== 'undefined' && sweepstakeData.defaultSweepstakeId) ? sweepstakeData.defaultSweepstakeId : null;
  if (defaultId && sweepstakeData && sweepstakeData.sweepstakes && sweepstakeData.sweepstakes[defaultId]) {
    return sweepstakeData.sweepstakes[defaultId].goldenBoot || [];
  }
  return [];
}

function renderGoldenBoot() {
  const container = document.getElementById("golden-boot");
  if (!container) return;

  const scorers = getGoldenBoot();
  if (scorers.length === 0) {
    container.innerHTML = `
      <div class="empty-state">No golden boot data available.</div>
    `;
    return;
  }

  const topScorers = scorers
    .slice()
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  container.innerHTML = `
    <div class="golden-boot-header">
      <div>Rank</div>
      <div>Player</div>
      <div>Team</div>
      <div>Owner</div>
      <div>Goals</div>
    </div>
    ${topScorers.map((scorer, index) => `
      <div class="golden-boot-row${index === 0 ? " winner" : ""}">
        <div>${index + 1}</div>
        <div>${scorer.player}</div>
        <div>${scorer.team}</div>
        <div>${getPlayerByTeam(scorer.team) || "—"}</div>
        <div>${scorer.goals}</div>
      </div>
    `).join("")}
  `;
}

function renderNextFixtures() {
  const container = document.getElementById("next-fixtures");
  if (!container) return;

  const fixtures = getNextThreeFixtures(getFixtures());
  if (fixtures.length === 0) {
    container.innerHTML = `
      <div class="empty-state">No fixtures available for this sweepstake.</div>
    `;
    return;
  }

  container.innerHTML = `
    ${fixtures.map(f => {
      const homePlayer = getPlayerByTeam(f.home);
      const awayPlayer = getPlayerByTeam(f.away);
      const status = getFixtureStatus(f);
      const isLive = status === "live";
      const kickoff = parseDateTime(f);
      const localDate = kickoff.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short"
      });
      const localTime = kickoff.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      return `
        <div class="next-fixture-row${isLive ? " live" : ""}">
          <div>
            <strong>${f.home}</strong>
            <span class="owner">(${homePlayer || "—"})</span>
            vs
            <strong>${f.away}</strong>
            <span class="owner">(${awayPlayer || "—"})</span>
          </div>

          <div class="fixture-meta">
            ${isLive
              ? `<span class="live-badge">LIVE</span> ${localDate} • ${localTime}`
              : `${localDate} • ${localTime}`}
          </div>
        </div>
      `;
    }).join("")}
  `;
}

/* =========================
   LEADERBOARD
========================= */

function getLeaderboardPositions(rows) {
  const positions = [];

  rows.forEach((row, index) => {
    if (index === 0) {
      positions.push(1);
      return;
    }

    const previousRow = rows[index - 1];
    const samePosition =
      row.remaining === previousRow.remaining &&
      (row.remaining > 0 || row.eliminationRank === previousRow.eliminationRank);

    positions.push(samePosition ? positions[index - 1] : index + 1);
  });

  return positions;
}

function renderLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");

  const rows = Object.entries(sweepstake.players)
    .map(([player, playerData]) => {
      const allTeams = getAllPlayerTeams(player);
      const remaining = getRemainingTeams(allTeams).length;
      const eliminationRound = remaining === 0 ? getMaxEliminationRound(allTeams) : null;

      return {
        player,
        remaining,
        eliminationRound,
        eliminationRank: eliminationRound ? roundRank(eliminationRound) : 0
      };
    })
    .sort((a, b) => {
      if (b.remaining !== a.remaining) return b.remaining - a.remaining;
      if (a.remaining === 0 && b.remaining === 0 && b.eliminationRank !== a.eliminationRank) {
        return b.eliminationRank - a.eliminationRank;
      }
      return a.player.localeCompare(b.player);
    });

  const positions = getLeaderboardPositions(rows);

  leaderboard.innerHTML = `
    <div class="leaderboard-header">
      <div>Pos</div>
      <div>Player</div>
      <div>Teams Left</div>
    </div>
    ${rows.map((r, i) => `
      <div class="leaderboard-row${positions[i] === 1 ? " winner" : ""}">
        <div>${positions[i]}</div>
        <div>${r.player}</div>
        <div>${r.remaining === 0 ? r.eliminationRound || "—" : r.remaining}</div>
      </div>
    `).join("")}
  `;
}

/* =========================
   BEST OF REST
========================= */

function renderBestOfRest() {
  const container = document.getElementById("best-of-rest");
  if (!container) return;

  const secondaryCategory = getSecondaryCategory();
  if (!secondaryCategory) {
    container.innerHTML = `<div class="empty-state">No secondary leaderboard configured for this sweepstake.</div>`;
    return;
  }

  const bestOfRestWinner = getBestOfRestWinner();

  const players = Object.entries(sweepstake.players)
    .map(([player]) => {
      const remainingTeams = getRemainingTeams(getPlayerTeams(player, secondaryCategory.key));
      const remaining = remainingTeams.length;
      const eliminationRound = remaining === 0 ? getMaxEliminationRound(getPlayerTeams(player, secondaryCategory.key)) : null;

      return {
        player,
        remaining,
        eliminationRound,
        eliminationRank: eliminationRound ? roundRank(eliminationRound) : 0
      };
    })
    .sort((a, b) => {
      if (b.remaining !== a.remaining) return b.remaining - a.remaining;
      if (a.remaining === 0 && b.remaining === 0 && b.eliminationRank !== a.eliminationRank) {
        return b.eliminationRank - a.eliminationRank;
      }
      return a.player.localeCompare(b.player);
    });

  const positions = getLeaderboardPositions(players);

  container.innerHTML = `
    <div class="leaderboard-header">
      <div>Pos</div>
      <div>Player</div>
      <div>Teams Left</div>
    </div>
    ${players.map((p, i) => {
      const isWinner = p.player === bestOfRestWinner;
      return `
        <div class="leaderboard-row${positions[i] === 1 || isWinner ? " winner" : ""}${isWinner ? " best-of-rest-winner" : ""}">
          <div>${positions[i]}</div>
          <div>${p.player}${isWinner ? " 🏆" : ""}</div>
          <div>${p.remaining === 0 ? p.eliminationRound || "—" : p.remaining}</div>
        </div>
      `;
    }).join("")}
  `;
}

/* =========================
   PLAYERS
========================= */

function renderPlayers() {
  const container = document.getElementById("players");
  const categories = getPlayerCategories();

  container.innerHTML = Object.entries(sweepstake.players)
    .map(([player]) => {
      const playerData = sweepstake.players[player];
      const allTeams = getAllPlayerTeams(player);
      const remainingTeams = getRemainingTeams(allTeams);

      return `
        <div class="player-card">
          <h3>${player}</h3>

          <div class="teams">
            ${categories.map(category => {
              const teams = getPlayerTeams(player, category.key);
              const heading = `${category.icon ? category.icon + ' ' : ''}${category.label}`;

              return `
                <div style="font-size: 0.85rem; opacity: 0.6; margin-top: 12px; margin-bottom: 8px; font-weight: 600;">
                  ${heading}
                </div>
                ${teams.length > 0 ? teams.map(team => renderTeam(team)).join("") : `<div class="team out">No team assigned</div>`}
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

let lastParticipantsRemaining = null;

function updateSummary() {
  const totalRemaining = Object.keys(sweepstake.players)
    .flatMap(player => getAllPlayerTeams(player))
    .filter(team => !isEliminated(team)).length;

  const teamsRemaining = document.getElementById("teamsRemaining");
  if (teamsRemaining) {
    teamsRemaining.textContent = totalRemaining;
  }

  const participantsRemainingEl = document.getElementById("participantsRemaining");
  if (participantsRemainingEl) {
    const participantsAlive = Object.keys(sweepstake.players).filter(player => {
      const allTeams = getAllPlayerTeams(player);
      return getRemainingTeams(allTeams).length > 0;
    }).length;

    if (lastParticipantsRemaining !== null && participantsAlive < lastParticipantsRemaining) {
      participantsRemainingEl.classList.add("pulse-decrease");
      participantsRemainingEl.addEventListener("animationend", () => {
        participantsRemainingEl.classList.remove("pulse-decrease");
      }, { once: true });
    }

    participantsRemainingEl.textContent = participantsAlive;
    lastParticipantsRemaining = participantsAlive;
  }
}

/* =========================
   INIT
========================= */

function setPageMetadata() {
  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");
  const rulesDescription = document.getElementById("rulesDescription");
  const secondaryHeading = document.getElementById("secondaryHeading");

  if (pageTitle) pageTitle.textContent = sweepstake.title || pageTitle.textContent;
  if (pageSubtitle) pageSubtitle.textContent = sweepstake.description || pageSubtitle.textContent;
  if (rulesDescription) rulesDescription.textContent = sweepstake.description || rulesDescription.textContent;

  const secondaryCategory = getSecondaryCategory();
  if (secondaryHeading && secondaryCategory) {
    secondaryHeading.textContent = `🌟 ${secondaryCategory.label}`;
  }

  if (document.title) {
    document.title = `${sweepstake.title || 'Sweepstake'} | World Cup`;
  }
}

function init() {
  setPageMetadata();
  renderLeaderboard();
  renderBestOfRest();
  renderPlayers();
  updateSummary();
  renderNextFixtures();
  renderGoldenBoot();
}

init();
