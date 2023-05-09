import { goToLogIn, logIn, logOff } from "./utils";

describe("Log in", () => {
  it("logs in", () => {
    goToLogIn();
    logIn("test-user-1@obgs.app", "12345");
    // On success you are redirected to the home page
    cy.contains("test-user-1");
  });

  it("login failed", () => {
    goToLogIn();
    logIn("test-user-1@obgs.app", "1234");
    // On success you get the message
    cy.contains("Invalid email or password");
  });

  it("user not found", () => {
    goToLogIn();
    logIn("admin@admin.com", "12345");
    // On success you get message
    cy.contains("User not found");
  });

  it("logs off", () => {
    goToLogIn();
    logIn("test-user-1@obgs.app", "12345");
    logOff();
    //On success you got the button "Log in"
    cy.contains("Log in");
  });
});
