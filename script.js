function isEliminated(team) {
  return sweepstake.eliminatedTeams.includes(team);
}

function getRemainingTeams(playerTeams) {
  return playerTeams.filter(team => !isEliminated(team));
}

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
                  ${eliminated ? "❌ " : "🇳🇱 "}
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

function init() {
  renderLeaderboard();
  renderPlayers();
  updateSummary();
}

init();