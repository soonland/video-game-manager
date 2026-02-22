import { Game, Platform } from "@vgm/types";

const validateButtons = (
  type: string,
  disabledIds: number[],
  enabledIds: number[],
) => {
  disabledIds.forEach((id) => {
    cy.get(`[data-testid='${type}-platform-${id}']`).should("be.disabled");
  });
  enabledIds.forEach((id) => {
    cy.get(`[data-testid='${type}-platform-${id}']`).should("be.enabled");
  });
};

const interceptGamesAndPlatforms = (games: Game[], platforms: Platform[]) => {
  cy.intercept("GET", "/api/games?$expand=platform", { games }).as("getGames");
  cy.intercept("GET", "/api/platforms", { platforms }).as("getPlatforms");
};

const mockPlatforms: Platform[] = [
  { id: 1, name: "Xbox 360", year: 2005 },
  { id: 2, name: "Xbox One", year: 2013 },
  { id: 3, name: "PlayStation 4", year: 2013 },
  { id: 4, name: "PlayStation 5", year: 2020 },
];

describe("Platforms Settings", () => {
  beforeEach(() => {
    cy.interceptApiCalls();
    cy.visitPlatforms();
    cy.wait("@getGames");
    cy.wait("@getPlatforms");
  });

  it("should check the Platforms Settings Panel", () => {
    // Ajouter une nouvelle plateforme
    cy.addPlatform("Nintendo Switch", 2017);

    // Modifier la plateforme 2
    cy.editPlatform(2, "Xbox One X", 2017);

    // Supprimer la nouvelle plateforme ajoutée
    cy.visitPlatforms();
    cy.wait("@getGames");
    cy.wait("@getPlatforms");
    cy.deletePlatform(4);
  });

  it("should disable delete buttons if platform is associated with games", () => {
    interceptGamesAndPlatforms(
      [
        {
          id: 1,
          name: "Game 1",
          year: 2020,
          platform: { id: 1, name: "Xbox 360", year: 2005 },
          genre: "Action",
          status: "Completed",
          rating: 4,
        },
        {
          id: 2,
          name: "Game 2",
          year: 2021,
          platform: { id: 2, name: "Xbox One", year: 2013 },
          genre: "Aventure",
          status: "Completed",
          rating: 4,
        },
      ],
      mockPlatforms,
    );

    cy.visitPlatforms();
    cy.wait("@getGames");
    cy.wait("@getPlatforms");

    // Vérifier les boutons de suppression
    validateButtons("delete", [1, 2], [3, 4]);
  });
});
