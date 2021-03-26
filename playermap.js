const PLAYER_TEAM_MAP = {
  AWESOMEX: "MCDONALDS",
  KAWA: "KFC",
  JR: "PANDA EX",
  DETHORNE: "KFC",
  ELFFAW: "LONG JOHN",
  "ANDY MAC": "MCDONALDS",
  TWERP: "FROOTS",
  MATTAUX: "HOOTERS",
  KAWA2796: "KFC",
  PNKROCKJOCK26: "MCDONALDS",
  HOOTENANNIES: "HOOTERS",
  OFTHEMOON16: "LONG JOHN",
  GOLFJBC89: "TACO BELL",
  JMYRV: "LONG JOHN",
  MADSCOUTFAN: "PANDA EX",
  MADSCOUT: "PANDA EX",
  "SNAKES ON A MICROPLANE": "FLAKES",
  EVERGREEN6258: "HOOTERS",
  "CREAM DADDY9057": "TOAST",
  FATKIDDESTROYERS: "TACO BELL",
  NKSSOCCER15: "TACO BELL",
  "ADES 35": "FAMOUS D",
  TFEEJ: "PANDA EX",

  ARMSTRONG: "FAMOUS D",
  STORM: "FAMOUS D",
  CHIPPER: "FAMOUS D",
  COUGAR: "FAMOUS D",
  FURY: "FAMOUS D",
  CAVEMAN: "FAMOUS D",
  PONCHO: "FAMOUS D",
  SHEPARD: "FAMOUS D",
  DUDE: "FAMOUS D",
  CENTICE: "FAMOUS D",
  MAVERICK: "FAMOUS D",
  MIDDY: "FAMOUS D",
  OUTLAW: "FAMOUS D",
  ROUNDHOUSE: "FAMOUS D",
  SUNDOWN: "FAMOUS D",
  "C-BLOCK": "FAMOUS D",
  SULTAN: "FAMOUS D",
  CASPER: "FAMOUS D",
  ICEMAN: "FAMOUS D",
  SQUALL: "FAMOUS D",
  BOOMER: "FAMOUS D",
  JUNKER: "FAMOUS D",
  SWABBIE: "FAMOUS D",
  JESTER: "FAMOUS D",
  HOLLYWOOD: "FAMOUS D",
  ARMSTRONG: "FAMOUS D",
  TUSK: "FAMOUS D",
  FOAMER: "FAMOUS D",
  MYRTLE: "FAMOUS D",
  MARLEY: "FAMOUS D",
  RAINMAKER: "FAMOUS D",
  SCOUT: "FAMOUS D",
  BANDIT: "FAMOUS D",
  GERWIN: "FAMOUS D",
  TEX: "FAMOUS D",
  YURI: "FAMOUS D",
  MIDDY: "FAMOUS D",
  WOLFMAN: "FAMOUS D",
  MOUNTAIN: "FAMOUS D",
  SAMARA: "FAMOUS D",
  STICKS: "FAMOUS D",
  KHAN: "FAMOUS D",
  SALTIE: "FAMOUS D",
  SABERTOOTH: "FAMOUS D",
  STINGER: "FAMOUS D",
  OUTLAW: "FAMOUS D",
};

const TEAM_LOGO_MAP = {
  RLL: "assets/RLL_logo.png",
  KRLL: "assets/RLL_LOWER_LOGO.png",
  "TACO BELL": "assets/LOGO_TACO.png",
  "FAMOUS D": "assets/LOGO_FAMOUS.png",
  MCDONALDS: "assets/LOGO_MCDONALDS.png",
  "PANDA EX": "assets/LOGO_PANDA.png",
  "LONG JOHN": "assets/LOGO_SILVERS_EYES.png",
  HOOTERS: "assets/LOGO_HOOTERS.png",
  "DAIRY QUEEN": "assets/LOGO_DAIRY.png",
  KFC: "assets/LOGO_KFC.png",
};

const TEAM_LEAGUE_MAP = {
  RLL: 1,
  KFC: 1,
  "LONG JOHN": 1,
  "PANDA EX": 2,
  MCDONALDS: 2,
  "TACO BELL": 2,
  "FAMOUS D": 2,
  HOOTERS: 1,
  "DAIRY QUEEN": 1,
};

const AVG_SCORE_MAP = {
  KAWA: 448,
  JR: 171,
  DETHORNE: 236,
  ELFFAW: 361,
  "ANDY MAC": 182,
  TWERP: 263,
  MATTAUX: 213,
  KAWA2796: 138,
  PNKROCKJOCK26: 279,
  HOOTENANNIES: 214,
  OFTHEMOON16: 278,
  "GNOMIE, DONT YA KNOW ME?": 441,
  GOLFJBC89: 295,
  JMYRV: 199,
  MADSCOUTFAN: 269,
  MADSCOUT: 269,
  KURTZYP00: 188,
  "KURTZY P00": 188,
  "CREAM DADDY9057": 188,
  "SNAKES ON A MICROPLANE": 369,
  EVERGREEN6258: 378,
  AWESOMEX: 504,
  FATKIDDESTROYERS: 117,
  NKSSOCCER15: 230,
  TFEEJ: 487,
  "ADES 35": 330,
};

const TEAM_TRANSITION_MAP = {
  RLL: "assets/RLL_Logo_LARGE.png",
  "TACO BELL": "assets/svg/LOGO_TACO.svg",
  KFC: "assets/svg/LOGO_KFC.svg",
  "LONG JOHN": "assets/svg/LOGO_SILVER.svg",
  "PANDA EX": "assets/svg/LOGO_PANDA.svg",
  MCDONALDS: "assets/svg/LOGO_MCDONALDS.svg",
  "FAMOUS D": "assets/svg/LOGO_FAMOUS.svg",
  HOOTERS: "assets/svg/LOGO_HOOTERS.svg",
  "DAIRY QUEEN": "assets/svg/LOGO_DAIRY.svg",
};

const TEAM_COLOR_MAP = {
  RLL: {
    primary: "crimson",
    secondary: "white",
    shadow: "white",
    tertiary: "black",
  },
  "TACO BELL": {
    primary: "#3d1147",
    secondary: "#f8d39d",
    shadow: "BLACK",
    tertiary: "black",
  },
  "FAMOUS D": {
    primary: "#a6598f",
    secondary: "#fce5f5",
    shadow: "BLACK",
    tertiary: "black",
  },
  "LONG JOHN": {
    primary: "#5b5b5b",
    secondary: "#f2e2d2",
    shadow: "black",
    tertiary: "black",
  },
  "PANDA EX": {
    primary: "#c02827",
    secondary: "WHITE",
    shadow: "#black",
    tertiary: "black",
  },
  MCDONALDS: {
    primary: "#961718",
    secondary: "ffc700",
    shadow: "black",
    tertiary: "black",
  },
  KFC: {
    primary: "#e6e6e6",
    secondary: "#0c0d1d",
    shadow: "BLACK",
    tertiary: "black",
  },

  HOOTERS: {
    primary: "#ff571f",
    secondary: "ffffff",
    shadow: "black",
    tertiary: "black",
  },
  "DAIRY QUEEN": {
    primary: "#956e50",
    secondary: "fbf4e1",
    shadow: "black",
    tertiary: "black",
  },
};
