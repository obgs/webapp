import { logInTestUser1, visitGames } from "./utils";

const addGameInfo = (
  gameName: string,
  gameDesc: string,
  gameLink: string,
  gameMin: string,
  gameMax: string
) => {
  cy.get("[data-cy='nameInputGenInfo']").type(gameName);
  cy.get("[data-cy='descInputGenInfo']").type(gameDesc);
  cy.get("[data-cy='linkInputGenInfo']").type(gameLink);
  cy.get("[data-cy='minPlInputGenInfo']").clear().type(gameMin);
  cy.get("[data-cy='maxPlInputGenInfo']").clear().type(gameMax);
};

const addStatInfo = (statName: string, statDesc: string) => {
  cy.get("[data-cy='nameStat']").type(statName);
  cy.get("[data-cy=descStat]").type(statDesc);
};

const clicContinueButton = () => {
  cy.get("button").contains("Continue").click();
};

describe("Games control", () => {
  it("creates new game", () => {
    //Creating a game with standart 1-10 players and 1 numeric stat
    cy.visit("/");
    logInTestUser1();
    visitGames();
    cy.get("button").contains("Create new game").click();
    cy.contains("General information");
    addGameInfo(
      "test-game-01",
      "Test name info",
      "https://boardgamegeek.com/boardgame/316554/dune-imperium",
      "1",
      "10"
    );
    clicContinueButton();
    cy.contains("Generic stats");
    addStatInfo("test-stat-01", "Test info 01");
    clicContinueButton();
    cy.contains("Aggregate stats");
    clicContinueButton();
    cy.contains("Stat order");
    clicContinueButton();
    cy.contains("Preview");
    cy.get("button").contains("Create game").click();
    //On success test-user-01 find test-game-01 on Games page
    cy.contains("test-game-01");
    cy.contains("Test name info");
  });

  // it("creates new game with additional settings", () => {
  //   //Creating a game for 2-4 players and 3 kind of stats
  //   cy.visit("/");
  //   logInTestUser1();
  //   visitGames();
  //   cy.get("button").contains("Create new game").click();
  //   cy.contains("Create Game");
  //   addGameInfo(
  //     "test-game-02",
  //     "Test name info",
  //     "https://boardgamegeek.com/boardgame/316554/dune-imperium"
  //   );
  //   //Changing min amount of players
  //   cy.get("[data-cy='newGameSlider']")
  //     .get('input[data-index="0"]')
  //     .trigger("change", { force: true })
  //     .invoke("val", 2);
  //   //Adding enumerable statistic
  // });
});
