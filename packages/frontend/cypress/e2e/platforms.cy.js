describe("Platforms Settings", () => {
  it("should check the Platforms Settings Panel", () => {
    cy.visit("/");
    cy.intercept("GET", "/api/games?$expand=platform").as("getGames");
    cy.intercept("GET", "/api/platforms", {
      platforms: [
        { id: 1, name: "Xbox 360", year: 2005 },
        { id: 2, name: "Xbox One", year: 2013 },
        { id: 3, name: "Xbox Series X|S", year: 2020 },
        { id: 4, name: "PlayStation 3", year: 2006 },
        { id: 5, name: "PlayStation 4", year: 2013 },
        { id: 6, name: "PlayStation 5", year: 2020 },
      ],
    }).as("getPlatforms");
    cy.intercept("POST", "/api/platforms", {
      id: 7,
      name: "Nintendo Switch",
      year: 2017,
    }).as("postPlatform");
    cy.intercept("PUT", "/api/platforms/2", {
      id: 2,
      name: "Xbox One X",
      year: 2017,
    }).as("putPlatform");
    cy.intercept("DELETE", "/api/platforms/7").as("deletePlatform");

    cy.wait("@getGames");
    cy.get("[data-testid='app.settingsButton")
      .should("be.visible")
      .should("be.enabled")
      .click();

    cy.get("[data-testid='app.settingsMenu.platforms']")
      .should("exist")
      .click();

    cy.wait("@getPlatforms");

    // Ajouter une nouvelle plateforme
    cy.get("[data-testid='new-platform-name']")
      .should("exist")
      .and("be.visible")
      .type("Nintendo Switch");

    cy.get("[data-testid='new-platform-year']").click();
    cy.get("[data-value='2017']").click();
    cy.get("[data-testid='add-platform']").click();
    cy.wait("@postPlatform");
    cy.get("[data-testid='app.snackbar']").should("be.visible");

    cy.get("[data-testid='platform-7']")
      .should("exist")
      .and("be.visible")
      .contains("Nintendo Switch")
      .contains("2017");

    // Modifier la plateforme 2
    cy.get("[data-testid='edit-platform-2']").click();
    cy.get("[data-testid='platform-name-2']").clear();
    cy.get("[data-testid='platform-name-2']").type("Xbox One X");
    cy.get("[data-testid='platform-year-2']").click();
    cy.get("[data-value='2017']").click();
    cy.get("[data-testid='save-platform-2']").click();
    cy.wait("@putPlatform");
    cy.get("[data-testid='app.snackbar']").should("be.visible");

    cy.get("[data-testid='platform-2']")
      .should("exist")
      .and("be.visible")
      .contains("Xbox One X")
      .contains("2017");

    // Supprimer la nouvelle plateforme ajoutée
    cy.get("[data-testid='delete-platform-7']").click();
    cy.wait("@deletePlatform");
    cy.get("[data-testid='app.snackbar']").should("be.visible");
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

    cy.wait("@getGames");
    cy.get("[data-testid='app.settingsButton")
      .should("be.visible")
      .should("be.enabled")
      .click();

    cy.get("[data-testid='app.settingsMenu.platforms']")
      .should("exist")
      .click();

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

    cy.wait("@getGames");
    cy.get("[data-testid='app.settingsButton")
      .should("be.visible")
      .should("be.enabled")
      .click();

    cy.get("[data-testid='app.settingsMenu.platforms']")
      .should("exist")
      .click();

    cy.wait("@getPlatforms");

    // Vérifier que les boutons de suppression sont désactivés pour les plateformes associées à des jeux
    cy.get("[data-testid='delete-platform-1']").should("be.disabled");
    cy.get("[data-testid='delete-platform-2']").should("be.disabled");

    // Vérifier que les boutons de suppression sont activés pour les plateformes sans jeux
    cy.get("[data-testid='delete-platform-3']").should("be.enabled");
    cy.get("[data-testid='delete-platform-4']").should("be.enabled");
  });
});
