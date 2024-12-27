describe("Platforms Settings", () => {
  it("should check the Platforms Settings Panel", () => {
    cy.interceptApiCalls();
    cy.visitSettingsPanel();
    cy.wait("@getGames");
    cy.wait("@getPlatforms");

    // Ajouter une nouvelle plateforme
    cy.addPlatform("Nintendo Switch", 2017);

    // Modifier la plateforme 2
    cy.editPlatform(2, "Xbox One X", 2017);

    // Supprimer la nouvelle plateforme ajoutée
    cy.deletePlatform(7);
  });

  it("should disable edit buttons if platform is associated with games", () => {
    cy.visit("/");
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

    // Vérifier que les boutons d'édition sont activés pour les plateformes sans jeux
    cy.get("[data-testid='edit-platform-1']").should("be.enabled");
    cy.get("[data-testid='edit-platform-2']").should("be.enabled");
    cy.get("[data-testid='edit-platform-3']").should("be.enabled");
    cy.get("[data-testid='edit-platform-4']").should("be.enabled");
  });

  it("should disable delete buttons if platform is associated with games", () => {
    cy.visit("/");
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

    // Vérifier que les boutons de suppression sont désactivés pour les plateformes associées à des jeux
    cy.get("[data-testid='delete-platform-1']").should("be.disabled");
    cy.get("[data-testid='delete-platform-2']").should("be.disabled");

    // Vérifier que les boutons de suppression sont activés pour les plateformes sans jeux
    cy.get("[data-testid='delete-platform-3']").should("be.enabled");
    cy.get("[data-testid='delete-platform-4']").should("be.enabled");
  });
});
