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
};

const logInTestUser2 = () => {
  cy.contains("Log in").click();
  logIn("test-user-2@obgs.app", "12345");
};

const logOff = () => {
  cy.contains("test-user").click();
  cy.contains("Logout").click();
};

export { goToLogIn, logIn, logOff, logInTestUser1, logInTestUser2 };
