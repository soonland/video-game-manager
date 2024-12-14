describe("Platforms Settings", () => {
  it("should check the Platforms Settings Panel", () => {
    cy.visit("/");
    cy.intercept("GET", "/api/games").as("getGames");
    cy.intercept("GET", "/api/platforms", {
      platforms: [
        { id: 1, name: "Xbox 360", year: 2005 },
        { id: 2, name: "Xbox One", year: 2013 },
        { id: 3, name: "Xbox Series X|S", year: 2020 },
        { id: 4, name: "PlayStation 3", year: 2006 },
        { id: 5, name: "PlayStation 4", year: 2013 },
        { id: 6, name: "PlayStation 5", year: 2020 },
        { id: 7, name: "Nintendo Switch", year: 2017 },
        { id: 8, name: "PC", year: 1981 },
        { id: 9, name: "iOS", year: 2007 },
        { id: 10, name: "Android", year: 2008 },
        { id: 11, name: "Linux", year: 1991 },
        { id: 12, name: "macOS", year: 2001 },
        { id: 13, name: "Windows", year: 1985 },
        { id: 14, name: "Commodore 64", year: 1982 },
        { id: 15, name: "Amiga", year: 1985 },
        { id: 16, name: "Atari ST", year: 1985 },
        { id: 17, name: "MS-DOS", year: 1981 },
        { id: 18, name: "Apple II", year: 1977 },
        { id: 19, name: "Atari 2600", year: 1977 },
        { id: 20, name: "NES", year: 1983 },
        { id: 21, name: "SNES", year: 1990 },
        { id: 22, name: "Nintendo 64", year: 1996 },
        { id: 23, name: "GameCube", year: 2001 },
        { id: 24, name: "Wii", year: 2006 },
        { id: 25, name: "Wii U", year: 2012 },
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
  });
});
