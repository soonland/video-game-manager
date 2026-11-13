describe("Home Page", () => {
  it("should check the layout and sidebar nav links", () => {
    cy.resetDatabase();
    cy.intercept("GET", "/api/games?$expand=platform").as("getGames");
    cy.intercept("GET", "/api/platforms").as("getPlatforms");
    cy.visit("/");

    cy.wait("@getGames").its("response.statusCode").should("eq", 200);
    cy.wait("@getPlatforms").its("response.statusCode").should("eq", 200);

    cy.get("[data-testid='nav.games']").should("be.visible");
    cy.get("[data-testid='nav.platforms']").should("be.visible");
    cy.get("[data-testid='app.langButton']").should("be.visible");
  });
});
