const sweepstakeData = {
  defaultSweepstakeId: "main",
  eliminatedTeams: [
    { team: "South Africa", round: "R32" },
    { team: "Japan", round: "R32" },
    { team: "Germany", round: "R32" },
    { team: "Netherlands", round: "R32" },
    { team: "Ivory Coast", round: "R32" },
    { team: "Sweden", round: "R32" },
    { team: "Ecuador", round: "R32" },
    { team: "DR Congo", round: "R32" },
    { team: "Senegal", round: "R32" },
    { team: "Bosnia and Herzegovina", round: "R32" },
    { team: "Austria", round: "R32" },
    { team: "Croatia", round: "R32" },
    { team: "Algeria", round: "R32" },
    { team: "Cape Verde", round: "R32"},
    { team: "Ghana", round: "R32"},
    { team: "Australia", round: "R32"},
    { team: "Canada", round: "R16"},
    { team: "Paraguay", round: "R16"},
    { team: "Brazil", round: "R16"},
    { team: "Mexico", round: "R16"},
    { team: "Portugal", round: "R16"},
    { team: "USA", round: "R16"},  
    { team: "Colombia", round: "R16"},
    { team: "Egypt", round: "R16"},
    { team: "Morocco", round: "QF"},
    { team: "Belgium", round: "QF"},
    { team: "Norway", round: "QF"},
    { team: "Switzerland", round: "QF" },
    { team: "France", round: "SF" },  
  ],
  sweepstakes: {
    main: {
      id: "main",
      title: "⚽ World Cup Sweepstake 2026",
      description: "Each participant is assigned 5 national teams (1 top-6, 1 mid-tier, 3 best of the rest).",
      bestOfRestWinner: "Mary",
      playerCategories: [
        { key: "topSix", label: "Top 6", icon: "", single: true },
        { key: "midTier", label: "7-12 Seeds", icon: "", single: true },
        { key: "restOfWorld", label: "Best of the Rest", icon: "", single: false, bestOfRest: true }
      ],
      players: {
        "Harry": {
          topSix: "France",
          midTier: "Belgium",
          restOfWorld: ["Croatia", "Senegal", "Austria"]
        },
        "Joe": {
          topSix: "England",
          midTier: "Netherlands",
          restOfWorld: ["Paraguay", "Australia", "Ghana"]
        },
        "Polly": {
          topSix: "Morocco",
          midTier: "Mexico",
          restOfWorld: ["Ecuador", "Bosnia and Herzegovina", "USA"]
        },
        "Maya": {
          topSix: "Argentina",
          midTier: "Germany",
          restOfWorld: ["Egypt", "Cape Verde", "Ivory Coast"]
        },
        "Mary": {
          topSix: "Brazil",
          midTier: "Portugal",
          restOfWorld: ["Switzerland", "Algeria", "South Africa"]
        },
        "Voz": {
          topSix: "Spain",
          midTier: "Colombia",
          restOfWorld: ["Japan", "DR Congo", "Sweden"]
        }
      },
      goldenBoot: [
        { player: "Lionel Messi", team: "Argentina", goals: 8 },
        { player: "Ousmane Dembélé", team: "France", goals: 5 },
        { player: "Harry Kane", team: "England", goals: 6},
        { player: "Erling Haaland", team: "Norway", goals: 7 },
        { player: "Vinicus Junior", team: "Brazil", goals: 4 },
        { player: "Kylian Mbappé", team: "France", goals: 8 },
        { player: "Jude Bellingham", team: "England", goals: 6},
      ],
      fixtures: [
        {
          date: "2026-06-29",
          time: "18:00",
          home: "Brazil",
          away: "Japan"
        },
        {
          date: "2026-06-29",
          time: "21:30",
          home: "Germany",
          away: "Paraguay"
        },
        {
          date: "2026-06-30",
          time: "02:00",
          home: "Netherlands",
          away: "Morocco"
        },
        {
          date: "2026-06-30",
          time: "18:00",
          home: "Ivory Coast",
          away: "Norway"
        },
        {
          date: "2026-06-30",
          time: "22:00",
          home: "France",
          away: "Sweden"
        },
        {
          date: "2026-07-01",
          time: "02:00",
          home: "Mexico",
          away: "Ecuador"
        },
        {
          date: "2026-07-01",
          time: "17:00",
          home: "England",
          away: "DR Congo"
        },
        {
          date: "2026-07-01",
          time: "21:00",
          home: "Belgium",
          away: "Senegal"
        },
        {
          date: "2026-07-02",
          time: "01:00",
          home: "USA",
          away: "Bosnia and Herzegovina"
        },
        {
          date: "2026-07-02",
          time: "20:00",
          home: "Spain",
          away: "Austria"
        },
        {
          date: "2026-07-03",
          time: "00:00",
          home: "Portugal",
          away: "Croatia"
        },
        {
          date: "2026-07-03",
          time: "04:00",
          home: "Switzerland",
          away: "Algeria"
        },
        {
          date: "2026-07-03",
          time: "19:00",
          home: "Australia",
          away: "Egypt"
        },
        {
          date: "2026-07-03",
          time: "23:00",
          home: "Argentina",
          away: "Cape Verde"
        },
        {
          date: "2026-07-04",
          time: "02:30",
          home: "Colombia",
          away: "Ghana"
        },
  {
    date: "2026-07-04",
    time: "18:00",
    home: "Paraguay",
    away: "France"
  },
  {
    date: "2026-07-04",
    time: "22:00",
    home: "Canada",
    away: "Morocco"
  },
  {
    date: "2026-07-05",
    time: "21:00",
    home: "Brazil",
    away: "Norway"
  },
  {
    date: "2026-07-06",
    time: "01:00",
    home: "Mexico",
    away: "England"
  },
  {
    date: "2026-07-06",
    time: "20:00",
    home: "Portugal",
    away: "Spain"
  },
  {
    date: "2026-07-07",
    time: "01:00",
    home: "USA",
    away: "Belgium"
  },
  {
    date: "2026-07-07",
    time: "17:00",
    home: "Argentina",
    away: "Egypt"
  },
  {
    date: "2026-07-07",
    time: "21:00",
    home: "Switzerland",
    away: "Colombia"
  },
    {
    date: "2026-07-09",
    time: "21:00",
    home: "France",
    away: "Morocco"
  },
  {
    date: "2026-07-10",
    time: "20:00",
    home: "Spain",
    away: "Belgium"
  },
  {
    date: "2026-07-11",
    time: "22:00",
    home: "Norway",
    away: "England"
  },
  {
    date: "2026-07-12",
    time: "02:00",
    home: "Argentina",
    away: "Switzerland"
  },
    {
    date: "2026-07-14",
    time: "20:00",
    home: "France",
    away: "Spain"
  },
  {
    date: "2026-07-15",
    time: "20:00",
    home: "England",
    away: "Argentina"
  }
      ]
    },
    teamDraw: {
      id: "teamDraw",
      title: "⚽ World Cup Sweepstake 2026",
      description: "Each player gets 1 Green team, 1 Red team, and 6 Neutral teams.",
      playerCategories: [
        { key: "greenTeam", label: "Green Team", icon: "🟩", single: true },
        { key: "redTeam", label: "Red Team", icon: "🟥", single: true },
        { key: "neutralTeams", label: "Neutral Teams", icon: "⚪", single: false }
      ],
      players: {
        "Rosa": {
          greenTeam: "France",
          neutralTeams: ["Mexico", "Switzerland", "Egypt"]
        },
        "Tom": {
          greenTeam: "Brazil",
          redTeam: "Bosnia and Herzegovina",
          neutralTeams: ["Australia"]
        },
        "Chris": {
          neutralTeams: ["Paraguay", "Algeria"]
        },
        "Nat": {
          greenTeam: "Spain",
          neutralTeams: ["Belgium", "Austria"]
        },
        "Deb": {
          greenTeam: "Argentina",
          neutralTeams: ["Canada", "Morocco", "USA", "Egypt", "Senegal"]
        },
        "Jack": {
          greenTeam: "England",
          redTeam: "Cape Verde",
          neutralTeams: ["Norway", "Colombia"]
        }
      },
      goldenBoot: [],
      fixtures: []
    }
  }
};

const sweepstakeId = window.sweepstakeId || new URLSearchParams(window.location.search).get("sweepstake") || sweepstakeData.defaultSweepstakeId;
const sweepstake = sweepstakeData.sweepstakes[sweepstakeId] || sweepstakeData.sweepstakes[sweepstakeData.defaultSweepstakeId];

window.sweepstakeData = sweepstakeData;
window.sweepstake = sweepstake;
