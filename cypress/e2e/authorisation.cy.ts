import { goToLogIn, logIn, logOff } from "./utils";

describe("Log in", () => {
  it("login in the user", () => {
    goToLogIn();
    logIn("test-user-1@obgs.app", "12345");
    // On success you are redirected to the home page
    cy.contains("My players");
  });

  it("login pass fail", () => {
    goToLogIn();
    logIn("test-user-1@obgs.app", "1234");
    // On success you get the message
    cy.contains("Invalid email or password");
  });

  it("login user fail", () => {
    goToLogIn();
    logIn("admin@admin.com", "12345");
    // On success you get message
    cy.contains("User not found");
  });

  it("loging off", () => {
    goToLogIn();
    logIn("test-user-1@obgs.app", "12345");
    logOff();
    //On success you got the button "Log in"
    cy.contains("Log in");
  });
});
