const goToLogIn = () => {
    cy.visit("/");
    cy.contains("Log in").click();
};

const logIn = (email: string, password: string) => {
    cy.get("input[type=email]").type(email);
    cy.get("input[type=password]").type(password);
    cy.get(".MuiBox-root").contains("Not registered?").parent().find("button").contains("Log in").click();
};

describe("Log in", () => {
    it("login in the user", () => {
        goToLogIn();
        logIn("rifat@gmail.com", "123456");
        // On success you are redirected to the home page
        cy.contains("My players");
    });
});
