import {
  logInTestUser1,
  logInTestUser2,
  logOff,
  visitIncReq,
  visitOutSup,
  visitReqSup,
} from "./utils";

const addNewPlayer = (playerName: string) => {
  cy.visit("/");
  logInTestUser1();
  cy.contains("My players").click();
  cy.get("button").contains("Add new player").click();
  cy.get("input").type(playerName);
  cy.get("button").contains("Create").click();
};

const requestPlayer = (playerName2: string) => {
  visitReqSup();
  cy.get("[data-cy='playerReqTest']").contains(playerName2).click();
  cy.get("button").contains("Request").click();
  visitReqSup();
};

const reqWithMessage = (playerName3: string, testMessage: string) => {
  visitReqSup();
  cy.get("[data-cy='playerReqTest']").contains(playerName3).click();
  cy.get(".MuiBox-root")
    .contains("Requesting")
    .parent()
    .find("textarea")
    .first()
    .focus();
  cy.focused().type(testMessage);
  cy.get("button").contains("Request").click();
};

const checkNoReq = () => {
  cy.reload();
  cy.contains("No requests");
  logOff();
  logInTestUser2();
  visitOutSup();
  cy.contains("No requests");
};

describe("Players control", () => {
  // it("accepts supervision request", () => {
  //   addNewPlayer("test-player-01");
  //   logOff();
  //   logInTestUser2();
  //   requestPlayer("test-player-01");
  //   logOff();
  //   logInTestUser1();
  //   visitIncReq();
  //   cy.contains("test-player-01").click();
  //   cy.get("button").contains("Allow").click();
  //   //On success test-user-2 will see test-player-01 on page "My players"
  //   logOff();
  //   logInTestUser2();
  //   cy.visit("players/supervised");
  //   cy.contains("test-player-01");
  // });
  //
  // it("declines supervision request", () => {
  //   addNewPlayer("test-player-02");
  //   logOff();
  //   logInTestUser2();
  //   requestPlayer("test-player-02");
  //   logOff();
  //   logInTestUser1();
  //   visitIncReq();
  //   cy.contains("test-player-02").click();
  //   cy.get("button").contains("Reject").click();
  //   //On success test-user-1 will not see this request anymore,
  //   //test-user-2 will not see this request on page "Outgoing reqests" too
  //   checkNoReq();
  // });

  it("adds a message while requesting supervision", () => {
    addNewPlayer("test-player-03");
    logOff();
    logInTestUser2();
    visitReqSup();
    reqWithMessage("test-player-03", "test message");
    logOff();
    logInTestUser1();
    visitIncReq();
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
