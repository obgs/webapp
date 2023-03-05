const goToLogIn = () => {
  cy.visit("/");
  cy.contains("Log in").click();
};

const logIn = (email: string, password: string) => {
  cy.get("input[type=email]").clear().type(email);
  cy.get("input[type=password]").clear().type(password);
  cy.get(".MuiBox-root")
    .contains("Not registered?")
    .parent()
    .find("button")
    .contains("Log in")
    .click();
};

const logInTestUser1 = () => {
  cy.contains("Log in").click();
  logIn("test-user-1@obgs.app", "12345");
  cy.contains("test-user-1");
};

const logInTestUser2 = () => {
  cy.contains("Log in").click();
  logIn("test-user-2@obgs.app", "12345");
  cy.contains("test-user-2");
};

const logOff = () => {
  cy.contains("test-user").click();
  cy.contains("Logout").click();
};

const visitGames = () => {
  cy.get("[data-cy='gamesNavTest']").click();
  cy.contains("Games are the templates for your statistics.");
};

const visitIncReq = () => {
  cy.contains("Incoming request").click();
  cy.contains("Player ID");
};

const visitReqSup = () => {
  cy.contains("Request supervision").click();
  cy.contains("Here you can request supervision");
};

const visitOutSup = () => {
  cy.contains("Outgoing requests").click();
  cy.contains("Approvals");
};

export {
  goToLogIn,
  logIn,
  logOff,
  logInTestUser1,
  logInTestUser2,
  visitGames,
  visitIncReq,
  visitReqSup,
  visitOutSup,
};
