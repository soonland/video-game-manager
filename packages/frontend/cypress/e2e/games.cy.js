describe("Games panel", () => {
  it("should add a new game", () => {
    cy.visit("/");
    cy.intercept("GET", "/api/games").as("getGames");
    cy.intercept("POST", "/api/games").as("postGame");
    cy.intercept("GET", "/api/platforms", {
      platforms: [
        { id: 1, name: "Xbox 360", year: 2005 },
        { id: 2, name: "Xbox One", year: 2013 },
        { id: 3, name: "Xbox Series X|S", year: 2020 },
      ],
    }).as("getPlatforms");

    cy.wait("@getGames");

    cy.get("[data-testid='app.gameForm.name']").type("Mass Effect");
    cy.get("[data-testid='app.gameForm.year']").type("2007");
    cy.get("[data-testid='app.gameForm.platform']").click();
    cy.get('[data-value="3"]').click();
    cy.get("[data-testid='app.gameForm.genre']").click();
    cy.get("[data-value='Action']").click();
    cy.get("[data-testid='app.gameForm.btn.add']").click();

    cy.wait("@postGame");
    cy.get("[data-testid='app.snackbar']").should("exist").and("be.visible");
  });

  it("should delete a game", () => {
    cy.visit("/");
    cy.intercept("GET", "/api/games", {
      body: {
        games: [
          {
            id: 1,
            name: "Mass Effect",
            year: 2007,
            platform: "Xbox 360",
            genre: "Action",
          },
          {
            id: 2,
            name: "Mass Effect 2",
            year: 2010,
            platform: "Xbox 360",
            genre: "Action",
          },
          {
            id: 3,
            name: "Mass Effect 3",
            year: 2012,
            platform: "Xbox 360",
            genre: "Action",
          },
          {
            id: 4,
            name: "Mass Effect Legendary Edition",
            year: 2021,
            platform: "Xbox Series X|S",
            genre: "Action",
          },
          {
            id: 5,
            name: "Mass Effect Andromeda",
            year: 2017,
            platform: "Xbox One",
            genre: "Action",
          },
        ],
      },
    }).as("getGames");
    cy.intercept("DELETE", /\/api\/games\/\d+$/).as("deleteGame");

    cy.wait("@getGames");

    cy.get("[data-testid='app.listControl.btn.delete']").should("be.disabled");
    cy.get("[data-testid='app.gameList.item.checkbox.1']").click();
    cy.get("[data-testid='app.listControl.btn.delete']").click();
    cy.get("[data-testid='app.confirmationDialog.btnConfirm']").click();

    cy.wait("@deleteGame").then((interception) => {
      expect(interception.request.url).to.match(/\/api\/games\/1$/);
    });
    cy.get("[data-testid='app.listControl.btn.delete']").should("be.disabled");
  });

  it("should check all games", () => {
    cy.visit("/");
    cy.intercept("GET", "/api/games", {
      body: {
        games: [
          {
            id: 1,
            name: "Mass Effect",
            year: 2007,
            platform: "Xbox 360",
            genre: "Action",
          },
          {
            id: 2,
            name: "Mass Effect 2",
            year: 2010,
            platform: "Xbox 360",
            genre: "Action",
          },
          {
            id: 3,
            name: "Mass Effect 3",
            year: 2012,
            platform: "Xbox 360",
            genre: "Action",
          },
          {
            id: 4,
            name: "Mass Effect Legendary Edition",
            year: 2021,
            platform: "Xbox Series X|S",
            genre: "Action",
          },
          {
            id: 5,
            name: "Mass Effect Andromeda",
            year: 2017,
            platform: "Xbox One",
            genre: "Action",
          },
        ],
      },
    }).as("getGames");

    cy.wait("@getGames");

    cy.get("[data-testid='app.listControl.btn.delete']").should("be.disabled");
    cy.get("[data-testid='app.listControl.btn.delete']").contains("(0)");
    cy.get("[data-testid='app.listControl.btn.checkAll']").click();
    cy.get("[data-testid='app.listControl.btn.delete']").should("be.enabled");
    cy.get("[data-testid='app.listControl.btn.delete']").contains("(5)");
    cy.get("[data-testid='app.listControl.btn.checkAll']").click();
    cy.get("[data-testid='app.listControl.btn.delete']").should("be.disabled");
    cy.get("[data-testid='app.listControl.btn.delete']").contains("(0)");
  });
});
