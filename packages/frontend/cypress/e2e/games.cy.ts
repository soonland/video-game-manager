import { Game, Platform } from "@vgm/types";

const mockGames: Game[] = [
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

const mockPlatforms: Platform[] = [
  { id: 1, name: "Xbox 360", year: 2005 },
  { id: 2, name: "Xbox One", year: 2013 },
  { id: 3, name: "Xbox Series X|S", year: 2020 },
];

const interceptGamesAndPlatforms = (): void => {
  cy.intercept("GET", "/api/games?$expand=platform", {
    body: { games: mockGames },
  }).as("getGames");
  cy.intercept("GET", "/api/platforms", { platforms: mockPlatforms }).as(
    "getPlatforms",
  );
};

describe("Games panel", () => {
  it("should add a new game", () => {
    interceptGamesAndPlatforms();
    cy.intercept("POST", "/api/games", {
      statusCode: 200,
      body: { message: "Game added successfully!", id: 6 },
    }).as("postGame");
    cy.intercept("GET", "/api/games?$expand=platform", {
      body: { games: mockGames },
    }).as("getGamesAfterAdd");

    cy.visit("/games/new");

    cy.get("[data-testid='app.gameForm.name']").type("Mass Effect");
    cy.get("[data-testid='app.gameForm.year']").type("2007");
    cy.get("[data-testid='app.gameForm.platform']").click();
    cy.get('[data-value="3"]').click();
    cy.get("[data-testid='app.gameForm.genre']").click();
    cy.get("[data-value='Action']").click();
    cy.get("[data-testid='app.gameForm.btn.add']").click();

    cy.wait("@postGame");
  });

  it("should delete a game", () => {
    interceptGamesAndPlatforms();
    cy.intercept("DELETE", /\/api\/games\/\d+$/).as("deleteGame");

    cy.visit("/games");
    cy.wait("@getGames");

    cy.get("[data-testid='app.deleteGame.1']").click();
    cy.get("[data-testid='app.confirmationDialog.btnConfirm']").click();

    cy.wait("@deleteGame").then((interception) => {
      expect(interception.request.url).to.match(/\/api\/games\/1$/);
    });
  });

  it("should navigate to add game form when clicking Add button", () => {
    interceptGamesAndPlatforms();

    cy.visit("/games");
    cy.wait("@getGames");

    cy.get("[data-testid='app.addGameButton']").should("be.visible").click();
    cy.url().should("include", "/games/new");
  });
});
