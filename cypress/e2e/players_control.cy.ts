import { logInTestUser1, logInTestUser2, logOff } from "./utils";

const addNewPlayer = (playerName: string) => {
  cy.visit("/");
  logInTestUser1();
  cy.contains("My players").click();
  cy.get("button").contains("Add new player").click();
  cy.get("input").type(playerName);
  cy.get("button").contains("Create").click();
};

const requestPlayer = (playerName2: string) => {
  cy.visit("players/request_supervision");
  cy.contains(playerName2).click();
  cy.get("button").contains("Request").click();
};

const checkNoReq = () => {
  cy.reload();
  cy.contains("No requests");
  logOff();
  logInTestUser2();
  cy.visit("players/outgoing_requests");
  cy.contains("No requests");
};

describe("Players control", () => {
  it("accepts supervision request", () => {
    addNewPlayer("test-player-01");
    logOff();
    logInTestUser2();
    requestPlayer("test-player-01");
    logOff();
    logInTestUser1();
    cy.visit("players/incoming_requests");
    cy.contains("test-player-01").click();
    cy.get("button").contains("Allow").click();
    //On success test-user-2 will see test-player-01 on page "My players"
    logOff();
    logInTestUser2();
    cy.visit("players/supervised");
    cy.contains("test-player-01");
  });

  it("declines supervision request", () => {
    addNewPlayer("test-player-02");
    logOff();
    logInTestUser2();
    requestPlayer("test-player-02");
    logOff();
    logInTestUser1();
    cy.visit("players/incoming_requests");
    cy.contains("test-player-02").click();
    cy.get("button").contains("Reject").click();
    //On success test-user-1 will not see this request anymore,
    //test-user-2 will not see this request on page "Outgoing reqests" too
    checkNoReq();
  });

  it("adds a message while requesting supervision", () => {
    addNewPlayer("test-player-03");
    logOff();
    logInTestUser2();
    cy.visit("players/request_supervision");
    cy.contains("test-player-03").click();
    cy.get(".MuiBox-root")
      .contains("Requesting")
      .parent()
      .find("textarea")
      .first()
      .focus();
    cy.focused().type("test message");
    cy.get("button").contains("Request").click();
    logOff();
    logInTestUser1();
    cy.visit("players/incoming_requests");
    cy.get(".MuiTable-root")
      .children()
      .should("contain", "test-player-03")
      .and("contain", "test message")
      .click();
    cy.get("button").contains("Allow").click();
    //On success both users will see no requests
    checkNoReq();
  });
});
