const goToLogIn = () => {
  cy.visit("/");
  cy.contains("Log in").click();
};

const logIn = (email: string, password: string) => {
  cy.get("input[type=email]").type(email);
  cy.get("input[type=password]").type(password);
  cy.get(".MuiBox-root")
    .contains("Not registered?")
    .parent()
    .find("button")
    .contains("Log in")
    .click();
};

const logOff = () => {
  cy.contains("test-user").click();
  cy.contains("Logout").click();
};

export { goToLogIn, logIn, logOff };
