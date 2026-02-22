describe("Home Page", () => {
  it("should check the layout and sidebar nav links", () => {
    cy.visit("/");
    cy.intercept("GET", "/api/games?$expand=platform").as("getGames");
    cy.intercept("GET", "/api/platforms").as("getPlatforms");

    cy.get("[data-testid='nav.games']").should("be.visible");
    cy.get("[data-testid='nav.platforms']").should("be.visible");
    cy.get("[data-testid='app.langButton']").should("be.visible");
  });
});
