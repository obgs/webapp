import { visitHome } from "./utils";

const goToSignUp = () => {
  visitHome();
  cy.contains("Log in").click();
  cy.contains("Sign up");
  cy.contains("here").click();
  cy.contains("Sign up");
};

const signUp = (email: string, password: string) => {
  cy.get("input[type=email]").type(email);
  cy.get("input[type=password]").as("pwd");
  cy.get("@pwd").then((pwds) => {
    const pwd = pwds[0];
    const confirm = pwds[1];
    cy.wrap(pwd).type(password);
    cy.wrap(confirm).type(password);
  });
  cy.get("button").contains("Sign up").click();
};

describe("Signup", () => {
  it("signs up the user", () => {
    goToSignUp();
    signUp("test-user-signup@obgs.app", "12345");
    // On success you are redirected to the home page
    cy.contains("Welcome to the new OBGS webapp");
  });

  it("throws an error if the email is already taken", () => {
    goToSignUp();
    signUp("test-user-signup@obgs.app", "12345");
    // The error message here is not great
    cy.contains("Something went wrong");
  });

  it("shows an error if passwords do not match", () => {
    goToSignUp();
    cy.get("input[type=email]").type("test@obgs.app");
    cy.get("input[type=password]").as("pwd");
    cy.get("@pwd").then((pwds) => {
      const pwd = pwds[0];
      const confirm = pwds[1];
      cy.wrap(pwd).type("123456");
      cy.wrap(confirm).type("1234567");
    });
    cy.get("button").contains("Sign up").click();
    cy.contains("Passwords do not match");
  });
});
