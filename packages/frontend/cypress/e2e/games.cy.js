const mockGames = [
  {
    id: 1,
    name: "Mass Effect",
    year: 2007,
    platform: { id: 1, name: "Xbox 360", year: 2005 },
    genre: "Action",
  },
  {
    id: 2,
    name: "Mass Effect 2",
    year: 2010,
    platform: { id: 1, name: "Xbox 360", year: 2005 },
    genre: "Action",
  },
  {
    id: 3,
    name: "Mass Effect 3",
    year: 2012,
    platform: { id: 1, name: "Xbox 360", year: 2005 },
    genre: "Action",
  },
  {
    id: 4,
    name: "Mass Effect Legendary Edition",
    year: 2021,
    platform: { id: 3, name: "Xbox Series X|S", year: 2020 },
    genre: "Action",
  },
  {
    id: 5,
    name: "Mass Effect Andromeda",
    year: 2017,
    platform: { id: 2, name: "Xbox One", year: 2013 },
    genre: "Action",
  },
];

const mockPlatforms = [
  { id: 1, name: "Xbox 360", year: 2005 },
  { id: 2, name: "Xbox One", year: 2013 },
  { id: 3, name: "Xbox Series X|S", year: 2020 },
];

const interceptGamesAndPlatforms = () => {
  cy.intercept("GET", "/api/games?$expand=platform", {
    body: { games: mockGames },
  }).as("getGames");
  cy.intercept("GET", "/api/platforms", { platforms: mockPlatforms }).as(
    "getPlatforms",
  );
};

describe("Games panel", () => {
  it("should add a new game", () => {
    cy.visit("/");
    interceptGamesAndPlatforms();
    cy.intercept("POST", "/api/games", {
      statusCode: 200,
      body: { message: "Game added successfully!", id: 6 },
    }).as("postGame");

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
    interceptGamesAndPlatforms();
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
    interceptGamesAndPlatforms();

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
