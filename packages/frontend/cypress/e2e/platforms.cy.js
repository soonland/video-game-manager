const validateButtons = (type, disabledIds, enabledIds) => {
  disabledIds.forEach((id) => {
    cy.get(`[data-testid='${type}-platform-${id}']`).should("be.disabled");
  });
  enabledIds.forEach((id) => {
    cy.get(`[data-testid='${type}-platform-${id}']`).should("be.enabled");
  });
};

describe("Platforms Settings", () => {
  beforeEach(() => {
    cy.interceptApiCalls();
    cy.visitSettingsPanel();
    cy.wait("@getGames");
    cy.wait("@getPlatforms");
  });

  it("should check the Platforms Settings Panel", () => {
    // Ajouter une nouvelle plateforme
    cy.addPlatform("Nintendo Switch", 2017);

    // Modifier la plateforme 2
    cy.editPlatform(2, "Xbox One X", 2017);

    // Supprimer la nouvelle plateforme ajoutée
    cy.deletePlatform(7);
  });

  it("should disable edit buttons if platform is associated with games", () => {
    cy.intercept("GET", "/api/games?$expand=platform", {
      games: [
        { id: 1, name: "Game 1", year: 2020, platform: 1, genre: "Action" },
        { id: 2, name: "Game 2", year: 2021, platform: 2, genre: "Adventure" },
      ],
    }).as("getGames");
    cy.intercept("GET", "/api/platforms", {
      platforms: [
        { id: 1, name: "Xbox 360", year: 2005 },
        { id: 2, name: "Xbox One", year: 2013 },
        { id: 3, name: "PlayStation 4", year: 2013 },
        { id: 4, name: "PlayStation 5", year: 2020 },
      ],
    }).as("getPlatforms");

    cy.visitSettingsPanel();
    cy.wait("@getGames");
    cy.wait("@getPlatforms");

    // Vérifier les boutons d'édition
    validateButtons("edit", [], [1, 2, 3, 4]);
  });

  it("should disable delete buttons if platform is associated with games", () => {
    cy.intercept("GET", "/api/games**", {
      games: [
        {
          id: 1,
          name: "Game 1",
          year: 2020,
          platform: { id: 1, name: "Xbox 360", year: 2005 },
          genre: "Action",
        },
        {
          id: 2,
          name: "Game 2",
          year: 2021,
          platform: { id: 2, name: "Xbox One", year: 2013 },
          genre: "Adventure",
        },
      ],
    }).as("getGames");
    cy.intercept("GET", "/api/platforms", {
      platforms: [
        { id: 1, name: "Xbox 360", year: 2005 },
        { id: 2, name: "Xbox One", year: 2013 },
        { id: 3, name: "PlayStation 4", year: 2013 },
        { id: 4, name: "PlayStation 5", year: 2020 },
      ],
    }).as("getPlatforms");

    cy.visitSettingsPanel();
    cy.wait("@getGames");
    cy.wait("@getPlatforms");

    // Vérifier les boutons de suppression
    validateButtons("delete", [1, 2], [3, 4]);
  });
});
