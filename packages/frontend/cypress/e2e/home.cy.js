describe("Home Page", () => {
  it("should check the home page", () => {
    cy.visit("/");
    cy.intercept("GET", "/api/games").as("getGames");
    cy.intercept("GET", "/api/platforms").as("getPlatforms");

    cy.get("[data-test='app.gameForm.buttons']").should("exist");

    cy.get("[data-testid='app.gameForm.btn.add']")
      .should("be.visible")
      .should("be.enabled");

    cy.get("[data-testid='app.listControl.btn.checkAll']")
      .should("be.visible")
      .should("be.enabled");

    cy.get("[data-testid='app.listControl.btn.delete']")
      .should("be.visible")
      .should("be.disabled");

    cy.get("[data-testid='app.gameForm.btn.reset']")
      .should("be.visible")
      .should("be.enabled");

    cy.get("[data-testid='app.gameForm.btn.update']").should("not.exist");

    cy.wait("@getGames");
    cy.wait("@getPlatforms");
    cy.get("[data-testid='app.settingsButton")
      .should("be.visible")
      .should("be.enabled")
      .click();

    cy.get("[data-testid='app.settingsMenu.platforms']").should("exist");
  });
});
