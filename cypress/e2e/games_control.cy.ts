import { logInTestUser1, visitGames } from "./utils";

const addGameInfo = (gameName: string, gameDesc: string, boardLink: string) => {
  cy.get("input").first().type(gameName);
  cy.get("textarea").first().type(gameDesc);
  cy.get("input[name=boardgamegeekURL]").type(boardLink);
};

const addStatsInfo = (statName: string, statDesc: string) => {
  cy.get(".MuiCardContent-root")
    .children()
    .find("input")
    .first()
    .type(statName);
  cy.get(".MuiCardContent-root")
    .children()
    .find("textarea")
    .first()
    .type(statDesc);
};

describe("Games control", () => {
  //   it("creates new game", () => {
  //     //Creating a game with standart 10 players and 1 numeric stat
  //     cy.visit("/");
  //     logInTestUser1();
  //     visitGames();
  //     cy.get("button").contains("Create new game").click();
  //     cy.contains("Create Game");
  //     addGameInfo(
  //       "test-game-01",
  //       "Test name info",
  //       "https://boardgamegeek.com/boardgame/316554/dune-imperium"
  //     );
  //     addStatsInfo("test-stat-01", "Test stat info");
  //     cy.get("button").contains("Create").click();
  //     //On success test-user-01 find test-game-01 on Games page
  //     visitGames();
  //     cy.contains("test-game-01");
  //   });

  it("creates new game with several stats for 2 ppl", () => {
    cy.visit("/");
    logInTestUser1();
    cy.visit("/");
    visitGames();
  });
});
