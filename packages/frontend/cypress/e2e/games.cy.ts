describe("Games panel", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.interceptApiCalls();
  });

  it("should add a new game", () => {
    cy.visit("/games/new");
    cy.wait("@getPlatforms").its("response.statusCode").should("eq", 200);

    cy.get("[data-testid='app.gameForm.name']").type("Metroid Dread");
    cy.get("[data-testid='app.gameForm.year']").type("2021");
    cy.get("[data-testid='app.gameForm.platform']").click();
    cy.contains('[role="option"]', "PlayStation 4").click();
    cy.get("[data-testid='app.gameForm.genre']").click();
    cy.get("[data-value='Action']").click();
    cy.get("[data-testid='app.gameForm.btn.add']").click();

    cy.wait("@postGame").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.request("GET", "http://localhost:5000/api/games").then(({ body }) => {
      assert.isTrue(
        body.games.some(
          (game: { name: string }) => game.name === "Metroid Dread",
        ),
      );
    });
  });

  it("should delete a game", () => {
    cy.getGameId("Mass Effect").then((gameId) => {
      cy.visit("/games");
      cy.wait("@getGames").its("response.statusCode").should("eq", 200);

      cy.get(`[data-testid='app.deleteGame.${gameId}']`).click();
      cy.get("[data-testid='app.confirmationDialog.btnConfirm']").click();

      cy.wait("@deleteGame").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
      });
      cy.request("GET", "http://localhost:5000/api/games").then(({ body }) => {
        assert.isFalse(
          body.games.some((game: { id: number }) => game.id === gameId),
        );
      });
    });
  });

  it("should navigate to add game form when clicking Add button", () => {
    cy.visit("/games");
    cy.wait("@getGames").its("response.statusCode").should("eq", 200);

    cy.get("[data-testid='app.addGameButton']").should("be.visible").click();
    cy.url().should("include", "/games/new");
  });
});
