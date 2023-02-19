import { goToLogIn, logIn } from "./utils";

const newPlayer = (player_name: string) => {
  cy.get("input").type(player_name);
};

describe("Players control", () => {
  it("create new player", () => {
    goToLogIn();
    logIn("test-user-1@obgs.app", "12345");
    cy.contains("My players").click();
    cy.get("button").contains("Add new player").click();
    newPlayer("test-player-1");
    cy.get("button").contains("Create").click();
  });
});
