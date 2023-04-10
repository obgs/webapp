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

const addStatInfo = (
  statName: string,
  statDesc: string,
  orderInput: number
) => {
  cy.get("[data-cy='nameStat']").then((nameStats) => {
    const stat = nameStats[orderInput];
    cy.wrap(stat).type(statName);
  });
  cy.get("[data-cy=descStat]").then((descStats) => {
    const stat = descStats[orderInput];
    cy.wrap(stat).type(statDesc);
  });
};

const changeStatType = (statType: string, orderList: number) => {
  cy.get("[data-cy='typeStat']").then((typeStat) => {
    const list = typeStat[orderList];
    cy.wrap(list).click();
    cy.get("[role='listbox']").contains(statType).click();
  });
};

const clickContinueButton = () => {
  cy.get("button").contains("Continue").click();
};

const clickPlusOnStats = () => {
  cy.get("[data-cy='plusStat']").click();
};

const createNewGame = () => {
  cy.get("button").contains("Create new game").click();
};

const clickCreateButton = () => {
  cy.get("button").contains("Create game").click();
};

const clickAddStatButton = () => {
  cy.get("button").contains("Add stat").click();
};

const checkNameErrMes = () => {
  cy.contains("Name is required");
};

describe("Games control", () => {
  it("creates new game with additional settings", () => {
    //Creating a game for 2-4 players and with all kind of stats
    cy.visit("/");
    logInTestUser1();
    visitGames();
    createNewGame();
    cy.contains("General information");
    addGameInfo(
      "test-game-01",
      "Test game 01 info",
      "https://boardgamegeek.com/boardgame/316554/dune-imperium",
      "2",
      "4"
    );
    clickContinueButton();
    cy.contains("Generic stats");
    addStatInfo("test-num-stat-01", "Test description", 0);
    clickAddStatButton();
    addStatInfo("test-num-stat-02", "Test description", 1);
    //Adding enumerable statistic
    clickAddStatButton();
    addStatInfo("test-enum-stat-01", "Test description", 2);
    changeStatType("Enumerable", 2);
    cy.get("[data-cy='valuesStat']").type("test-1");
    clickPlusOnStats();
    cy.get("[data-cy='valuesStat']").type("test-2");
    clickPlusOnStats();
    clickContinueButton();
    //Adding aggregate stat
    clickAddStatButton();
    cy.get("[data-cy='nameAggStat']").type("test-agg-stat-01");
    cy.get("[data-cy='descAggStat']").type("Test description");
    cy.get("[data-cy='dropListStat']").click();
    cy.contains("test-num-stat-01").click();
    cy.contains("test-num-stat-02").click();
    cy.get("body").type("{esc}");
    clickContinueButton();
    //On this page checks that all stats were correctly added
    cy.contains("test-num-stat-01");
    cy.contains("test-num-stat-02");
    cy.contains("test-enum-stat-01").click();
    cy.contains("test-1");
    cy.contains("test-2");
    cy.contains("test-agg-stat-01");
    clickContinueButton();
    //Checking that aggregate stat created before is counting correctly
    cy.get("tr").then((rows) => {
      const row = rows[1];
      cy.wrap(row)
        .find("td")
        .then((columns) => {
          const column1 = columns[1];
          cy.wrap(column1)
            .invoke("text")
            .then((c1text) => {
              const column2 = columns[2];
              cy.wrap(column2)
                .invoke("text")
                .then((c2text) => {
                  const column3 = columns[4];
                  cy.wrap(column3)
                    .invoke("text")
                    .then((c3text) => {
                      expect(Number(c1text) + Number(c2text)).to.eq(
                        Number(c3text)
                      );
                    });
                });
            });
        });
    });
    clickCreateButton();
    //On success test-user-01 find test-game-01 on Games page
    cy.contains("test-game-01");
    cy.contains("Test game 01 info");
  });

  it("failed when creates game without name", () => {
    cy.visit("/");
    logInTestUser1();
    visitGames();
    createNewGame();
    clickContinueButton();
    clickContinueButton();
    checkNameErrMes();
  });

  it("failed when min players more then max players", () => {
    cy.visit("/");
    logInTestUser1();
    visitGames();
    createNewGame();
    cy.get("[data-cy='minPlInputGenInfo']").type("1");
    clickContinueButton();
    cy.contains("Min players must be less than or equal to max players");
  });

  it("failed when creates stat without name", () => {
    cy.visit("/");
    logInTestUser1();
    visitGames();
    createNewGame();
    cy.contains("General information");
    addGameInfo(
      "test-game-02",
      "Test game 02 info",
      "https://boardgamegeek.com/boardgame/316554/dune-imperium",
      "1",
      "10"
    );
    clickContinueButton();
    cy.contains("Generic stats");
    clickContinueButton();
    clickContinueButton();
    checkNameErrMes();
    //Checking that additional stat shows this error message
    addStatInfo("test", "test desc", 0);
    clickAddStatButton();
    changeStatType("Enumerable", 1);
    clickContinueButton();
    clickContinueButton();
    checkNameErrMes();
    //cy.contains("Possible values are required");
  });
});
