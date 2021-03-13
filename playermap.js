/*
const PLAYER_TEAM_MAP = {
  AWESOMEX: "BRAN",
  KAWA: "TOAST",
  JR: "SMACKS",
  DETHORNE: "CRUNCH",
  ELFFAW: "SMACKS",
  "ANDY MAC": "TRIX",
  TWERP: "FROOTS",
  MATTAUX: "CHARMS",
  KAWA2796: "BRAN",
  PNKROCKJOCK26: "KRISPIES",
  HOOTENANNIES: "KRISPIES",
  OFTHEMOON16: "CHEERIOS",
  GOLFJBC89: "FROOTS",
  JMYRV: "CHEERIOS",
  MADSCOUTFAN: "CHARMS",
  MADSCOUT: "CHARMS",
  KURTZYP00: "TOAST",
  "KURTZY P00": "TOAST",
  "SNAKES ON A MICROPLANE": "FLAKES",
  EVERGREEN6258: "TRIX",
  "CREAM DADDY9057": "TOAST",
  FATKIDDESTROYERS: "FLAKES",
  NKSSOCCER15: "CRUNCH",

  ARMSTRONG: "CRUNCH",
  STORM: "CRUNCH",
  CHIPPER: "FLAKES",
  COUGAR: "TOAST",
  FURY: "CHARMS",
  CAVEMAN: "TOAST",
  PONCHO: "TOAST",
  SHEPARD: "TOAST",
  CENTICE: "KRISPIES",
  MIDDY: "CRUNCH",
  OUTLAW: "CHEERIOS",
  ROUNDHOUSE: "FROOTS",
  SUNDOWN: "FLAKES",
  "C-BLOCK": "TRIX",
  SULTAN: "CHARMS",
  CASPER: "FROOTS",
  ICEMAN: "CHEERIOS",
  SQUALL: "CHARMS",
  BOOMER: "TRIX",
  JUNKER: "FROOTS",
  SWABBIE: "TRIX",
  JESTER: "BRAN",
  HOLLYWOOD: "CRUNCH",
  ARMSTRONG: "CRUNCH",
  TUSK: "FROOTS",
  FOAMER: "FLAKES",
  MYRTLE: "CHEERIOS",
  MARLEY: "BRAN",
  RAINMAKER: "BRAN",
  SCOUT: "TOAST",
  BANDIT: "BRAN",
  GERWIN: "CRUNCH",
  TEX: "CRUNCH",
  YURI: "CHEERIOS",
  MIDDY: "CRUNCH",
  WOLFMAN: "FLAKES",
  MOUNTAIN: "FLAKES",
  SAMARA: "TRIX",
  STICKS: "FLAKES",
  KHAN: "TRIX",
  SALTIE: "TOAST",
  SABERTOOTH: "FLAKES",
  STINGER: "FLAKES",
  OUTLAW: "BRAN",
};
*/

// with billy

const PLAYER_TEAM_MAP = {};

// no billy
/*
const PLAYER_TEAM_MAP = {
  KAWA: "BRAZIL",
  DETHORNE: "NEW ZEALAND",
  ELFFAW: "UGANDA",
  "ANDY MAC": "UGANDA",
  MATTAUX: "JAPAN",
  KAWA2796: "BRAZIL",
  PNKROCKJOCK26: "ARUBA",
  HOOTENANNIES: "NEW ZEALAND",
  JMYRV: "ARUBA",
  "SNAKES ON A MICROPLANE": "ITALY",
  EVERGREEN6258: "JAPAN",
  "CREAM DADDY9057": "ITALY",
};
*/

const TEAM_LOGO_MAP = {
  RLL: "assets/RLL_COMBINE_S6_Logo.png",
  BRAZIL: "assets/FLAG_BRAZIL.png",
  JAPAN: "assets/FLAG_JAPAN.png",
  UGANDA: "assets/FLAG_UGANDA.png",
  "NEW ZEALAND": "assets/FLAG_NEW_ZEALAND.png",
  ARUBA: "assets/FLAG_ARUBA.png",
  ITALY: "assets/FLAG_ITALY.png",
};

/*
const TEAM_LOGO_MAP = {
  RLL: "assets/RLL_logo.png",
  KRLL: "assets/RLL_LOWER_LOGO.png",
  TOAST: "assets/LOGO_CRM_DAD.png",
  BRAN: "assets/LOGO_RAISIN.png",
  CRUNCH: "assets/LOGO_CRUNCH.png",
  SMACKS: "assets/LOGO_SMACKS.png",
  TRIX: "assets/LOGO_TRIX.png",
  FROOTS: "assets/LOGO_LOOPS.png",
  KRISPIES: "assets/LOGO_KRISPIES.png",
  FLAKES: "assets/LOGO_FLAKES.png",
  CHEERIOS: "assets/LOGO_CHERRIOS.png",
  CHARMS: "assets/LOGO_LUCKY.png",
};
*/

const TEAM_LEAGUE_MAP = {
  RLL: 1,
  TOAST: 1,
  BRAN: 1,
  CRUNCH: 2,
  SMACKS: 2,
  TRIX: 1,
  FROOTS: 2,
  KRISPIES: 2,
  FLAKES: 2,
  CHEERIOS: 1,
  CHARMS: 1,
};

const AVG_SCORE_MAP = {
  KAWA: 578,
  JR: 245,
  DETHORNE: 357,
  ELFFAW: 541,
  "ANDY MAC": 309,
  TWERP: 431,
  MATTAUX: 277,
  KAWA2796: 181,
  PNKROCKJOCK26: 349,
  HOOTENANNIES: 280,
  OFTHEMOON16: 433,
  "GNOMIE, DONT YA KNOW ME?": 441,
  GOLFJBC89: 392,
  JMYRV: 354,
  MADSCOUTFAN: 394,
  MADSCOUT: 394,
  KURTZYP00: 328,
  "KURTZY P00": 328,
  "CREAM DADDY9057": 328,
  "SNAKES ON A MICROPLANE": 481,
  EVERGREEN6258: 599,
  AWESOMEX: 761,
  FATKIDDESTROYERS: 207,
  NKSSOCCER15: 181,

  WOLFMAN: 521,
  SALTIE: 154,
};

const TEAM_TRANSITION_MAP = {
  RLL: "assets/RLL_Logo_LARGE.png",
  JAPAN: "assets/svg/FLAG_JAPAN.svg",
  BRAZIL: "assets/svg/FLAG_BRAZIL.svg",
  ARUBA: "assets/svg/FLAG_ARUBA.svg",
  ITALY: "assets/svg/FLAG_ITALY.svg",
  UGANDA: "assets/svg/FLAG_UGANDA.svg",
  "NEW ZEALAND": "assets/svg/FLAG_NEW_ZEALAND.svg",
};

const TEAM_COLOR_MAP = {
  RLL: {
    primary: "crimson",
    secondary: "white",
    shadow: "white",
    tertiary: "black",
  },
  CHARMS: {
    primary: "#499f5a",
    secondary: "white",
    shadow: "fc5e00",
    tertiary: "black",
  },
  FLAKES: {
    primary: "#ff6534",
    secondary: "#3651a4",
    shadow: "white",
    tertiary: "black",
  },
  CHEERIOS: {
    primary: "#e7cc03",
    secondary: "#212121",
    shadow: "black",
    tertiary: "black",
  },
  SMACKS: {
    primary: "#166055",
    secondary: "#fded48",
    shadow: "#black",
    tertiary: "black",
  },
  CRUNCH: {
    primary: "#112b7c",
    secondary: "fcfe4c",
    shadow: "black",
    tertiary: "black",
  },
  TOAST: {
    primary: "#d9b597",
    secondary: "#681577",
    shadow: "black",
    tertiary: "black",
  },

  FROOTS: {
    primary: "#4d96fc",
    secondary: "fffd23",
    shadow: "black",
    tertiary: "black",
  },
  BRAN: {
    primary: "#f1ad30",
    secondary: "fbfa00",
    shadow: "white",
    tertiary: "black",
  },
  KRISPIES: {
    primary: "#781500",
    secondary: "#f6ba6e",
    shadow: "black",
    tertiary: "black",
  },
  TRIX: {
    primary: "#fe0000",
    secondary: "ffffff",
    shadow: "black",
    tertiary: "black",
  },
  CHINA: {
    primary: "#ce2420",
    secondary: "#f8d12e",
    shadow: "black",
    tertiary: "black",
  },
  UKRAINE: {
    primary: "#f4ba00",
    secondary: "white",
    shadow: "black",
    tertiary: "black",
  },
  MEXICO: {
    primary: "#01563a",
    secondary: "white",
    shadow: "black",
    tertiary: "black",
  },
  GUATEMALA: {
    primary: "#3789bc",
    secondary: "#dde7ed",
    shadow: "black",
    tertiary: "black",
  },
  ICELAND: {
    primary: "#183889",
    secondary: "white",
    shadow: "black",
    tertiary: "black",
  },
  EGYPT: {
    primary: "#212121",
    secondary: "white",
    shadow: "white",
    tertiary: "black",
  },
  FRANCE: {
    primary: "#133970",
    secondary: "#ffffff",
    shadow: "black",
    tertiary: "black",
  },
  RWANDA: {
    primary: "#20603d",
    secondary: "#white",
    shadow: "black",
    tertiary: "black",
  },

  JAPAN: {
    primary: "#ce0909",
    secondary: "white",
    shadow: "black",
    tertiary: "black",
  },
  BRAZIL: {
    primary: "#007c29",
    secondary: "#fedf00",
    shadow: "black",
    tertiary: "black",
  },
  "NEW ZEALAND": {
    primary: "#183889",
    secondary: "white",
    shadow: "black",
    tertiary: "black",
  },
  ARUBA: {
    primary: "#326ca8",
    secondary: "ffd100",
    shadow: "black",
    tertiary: "black",
  },
  ITALY: {
    primary: "#15721e",
    secondary: "#e2f2f1",
    shadow: "black",
    tertiary: "black",
  },
  UGANDA: {
    primary: "#1b1b1b",
    secondary: "#fcdc04",
    shadow: "black",
    tertiary: "black",
  },
};
