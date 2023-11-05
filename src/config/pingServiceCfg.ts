import { ButtonBuilder, ButtonStyle } from "discord.js";

export const pingServiceCfg = {
    "379054265508823061": {
      id: "lolPing",
      name: "League of Legends",
      description: "League of Legends Ping Manager",
      role: "379054265508823061",
      maxPlayers: 5,
      gameIcon: "<:lol:1050371342995820584>",
      playerReaction: "<:0_:406198795404181504>",
      buttonYes: new ButtonBuilder({
        label: "",
        style: ButtonStyle.Danger,
        custom_id: `lolPingYes`,
        emoji: "<:0_:406198795404181504>",
      }),
      buttonNo: new ButtonBuilder({
        label: "Bijau",
        style: ButtonStyle.Secondary,
        custom_id: `lolPingNo`,
      }),
      // keywords for League of Legends
      keywords: ["lol", "league", "league of legends", "leagueoflegends"],
    },
    "1099120902341402744": {
      id: "tftPing",
      name: "Team Fight Tactics",
      description: "Team Fight Tactics Ping Manager",
      role: "1099120902341402744",
      maxPlayers: 8,
      gameIcon: "<:tft:1099115104198479872>",
      playerReaction: "<a:pengu:1099115708878700544>",
      buttonYes: new ButtonBuilder({
        label: "",
        style: ButtonStyle.Primary,
        custom_id: `tftPingYes`,
        emoji: "<:tftArena:1099121711309406258>",
      }),
      buttonNo: new ButtonBuilder({
        label: "",
        style: ButtonStyle.Secondary,
        custom_id: `tftPingNo`,
        emoji: "<:tftL:1099122414249582713>",
      }),
      // keywords for Team Fight Tactics
      keywords: ["tft", "team fight tactics", "teamfighttactics"],
    },
    "843933198907736066": {
      id: "valPing",
      name: "Valorant",
      description: "Valorant Ping Manager",
      role: "843933198907736066",
      maxPlayers: 5,
      gameIcon: "<:valorant:1099123434962821191>",
      playerReaction: "<a:goodSage:1099124499351355442>",
      buttonYes: new ButtonBuilder({
        label: "Yes",
        style: ButtonStyle.Success,
        custom_id: `valPingYes`,
      }),
      buttonNo: new ButtonBuilder({
        label: "No",
        style: ButtonStyle.Secondary,
        custom_id: `valPingNo`,
      }),
      // keywords for Valorant
      keywords: ["val", "valorant"],
    },
    "1070121180087988244": {
      id: "aramPing",
      name: "ARAM",
      description: "ARAM Ping Manager",
      role: "1070121180087988244",
      maxPlayers: 5,
      gameIcon: "<:Aram:1070119467293618278>",
      playerReaction: "<:snowBall:1070123779667279912>",
      buttonYes: new ButtonBuilder({
        label: "",
        style: ButtonStyle.Primary,
        custom_id: `aramPingYes`,
        emoji: "<a:poroW:1070125024230506576>",
      }),
      buttonNo: new ButtonBuilder({
        label: "",
        style: ButtonStyle.Secondary,
        custom_id: `aramPingNo`,
        emoji: "<a:poroL:1070125109429411910>",
      }),
      // keywords for ARAM
      keywords: ["aram", "arams", "aram ping", "aramping"],
    },
    "889446083074330624": {
      id: "mcPing",
      name: "Minecraft",
      description: "Minecraft Ping Manager",
      role: "889446083074330624",
      maxPlayers: 100,
      gameIcon: "<:minecraft:1050387214770638878>",
      playerReaction: "<a:beeee:1050387140481138688>",
      buttonYes: new ButtonBuilder({
        label: "",
        style: ButtonStyle.Success,
        custom_id: `mcPingYes`,
        emoji: "<a:beeee:1050387140481138688>",
      }),
      buttonNo: new ButtonBuilder({
        label: "nia",
        style: ButtonStyle.Secondary,
        custom_id: `mcPingNo`,
      }),
      // keywords for Minecraft
      keywords: ["mc", "minecraft", "mine", "minecraf"],
    },
    "379054412875825154": {
      id: "csgoPing",
      name: "Counter Strike: Global Offensive",
      description: "Counter Strike: Global Offensive Ping Manager",
      role: "379054412875825154",
      maxPlayers: 5,
      gameIcon: "<:csgo:1050371298209058816>",
      playerReaction: ":flag_ru:",
      buttonYes: new ButtonBuilder({
        label: "да",
        style: ButtonStyle.Success,
        custom_id: `csgoPingYes`,
      }),
      buttonNo: new ButtonBuilder({
        label: "нет",
        style: ButtonStyle.Secondary,
        custom_id: `csgoPingNo`,
      }),
      // keywords for Counter Strike: Global Offensive
      keywords: [
        "csgo",
        "counter strike",
        "counterstrike",
        "counter strike global offensive",
        "counterstrikeglobaloffensive",
      ],
    },
    "1164677139933704303": {
      id: "rustPing",
      name: "RUST",
      description: "RUST Ping Manager",
      role: "1164677139933704303",
      maxPlayers: 5,
      gameIcon: "<:rust:1164678368105607299>",
      playerReaction: "<:kurwaRaketa:1164680791830319154>",
      buttonYes: new ButtonBuilder({
        label: "Let's Roll",
        style: ButtonStyle.Success,
        custom_id: `rustPingYes`,
      }),
      buttonNo: new ButtonBuilder({
        label: "nay",
        style: ButtonStyle.Secondary,
        custom_id: `rustPingNo`,
      }),
      // keywords for Counter Strike: Global Offensive
      keywords: ["rust"],
    },
    "1162806426670993458": {
      id: "testPing",
      name: "Test: Testing",
      description: "Test",
      role: "1162806426670993458",
      maxPlayers: 2,
      gameIcon: "",
      playerReaction: ":)",
      buttonYes: new ButtonBuilder({
        label: "yes",
        style: ButtonStyle.Success,
        custom_id: `testPingYes`,
      }),
      buttonNo: new ButtonBuilder({
        label: "no",
        style: ButtonStyle.Danger,
        custom_id: `testPingNo`,
      }),
      // keywords for Testing
      keywords: ["test", "tst", "testing"],
    },
  };