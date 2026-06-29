function getRemainingCount(teams) {
  return teams.filter(team => !sweepstake.eliminatedTeams.some(item => item.team === team)).length;
}

function getTeamStatus(team) {
  const eliminated = sweepstake.eliminatedTeams.find(item => item.team === team);
  return eliminated ? { eliminated: true, round: eliminated.round } : { eliminated: false };
}

function getPlayerTeams(player) {
  const playerData = sweepstake.players[player];
  return {
    topSix: [playerData.topSix],
    midTier: [playerData.midTier],
    restOfWorld: playerData.restOfWorld
  };
}

function setParticipantCount() {
  const participantCount = Object.keys(sweepstake.players).length;
  document.getElementById("participantCount").textContent = participantCount;
}

function renderSelectOptions() {
  const select = document.getElementById("participant-select");
  Object.keys(sweepstake.players).forEach(player => {
    const option = document.createElement("option");
    option.value = player;
    option.textContent = player;
    select.appendChild(option);
  });
}

function renderSummary(player) {
  const playerData = sweepstake.players[player];
  const allTeams = [playerData.topSix, playerData.midTier, ...playerData.restOfWorld];
  const remaining = getRemainingCount(allTeams);
  const eliminated = allTeams.length - remaining;

  const summary = document.getElementById("participant-summary");
  summary.innerHTML = `
    <div class="card">
      <div class="label">Total Teams</div>
      <div class="value">${allTeams.length}</div>
    </div>
    <div class="card">
      <div class="label">Remaining</div>
      <div class="value">${remaining}</div>
    </div>
    <div class="card">
      <div class="label">Eliminated</div>
      <div class="value">${eliminated}</div>
    </div>
    <div class="card">
      <div class="label">Best of Rest Alive</div>
      <div class="value">${getRemainingCount(playerData.restOfWorld)}</div>
    </div>
  `;
}

function renderTeamGroup(title, teams) {
  return `
    <div class="team-group">
      <h3>${title}</h3>
      ${teams.map(team => {
        const status = getTeamStatus(team);
        return `
          <div class="team-detail ${status.eliminated ? "out" : "alive"}">
            <span>${team}</span>
            <span>${status.eliminated ? status.round : "Alive"}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderTeams(player) {
  const playerData = sweepstake.players[player];
  const container = document.getElementById("participant-teams");
  container.innerHTML = `
    ${renderTeamGroup("Top 6", [playerData.topSix])}
    ${renderTeamGroup("7-12 Seeds", [playerData.midTier])}
    ${renderTeamGroup("Best of the Rest", playerData.restOfWorld)}
  `;
}

function updateSelectedPlayer(player) {
  document.getElementById("selectedPlayer").textContent = player;
  renderSummary(player);
  renderTeams(player);
}

function initStatsPage() {
  setParticipantCount();
  renderSelectOptions();

  const select = document.getElementById("participant-select");
  const firstPlayer = select.options[0]?.value;
  if (firstPlayer) {
    select.value = firstPlayer;
    updateSelectedPlayer(firstPlayer);
  }

  select.addEventListener("change", event => {
    updateSelectedPlayer(event.target.value);
  });
}

initStatsPage();
