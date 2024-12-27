// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("visitSettingsPanel", () => {
  cy.visit("/");
  cy.get("[data-testid='app.settingsButton']")
    .should("be.visible")
    .should("be.enabled")
    .click();
  cy.get("[data-testid='app.settingsMenu.platforms']").should("exist").click();
});

Cypress.Commands.add("interceptApiCalls", () => {
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
});

Cypress.Commands.add("addPlatform", (name, year) => {
  cy.get("[data-testid='new-platform-name']")
    .should("exist")
    .and("be.visible")
    .type(name);
  cy.get("[data-testid='new-platform-year']").click();
  cy.get(`[data-value='${year}']`).click();
  cy.get("[data-testid='add-platform']").click();
  cy.wait("@postPlatform");
  cy.get("[data-testid='app.snackbar']").should("be.visible");
  cy.get(`[data-testid='platform-7']`)
    .should("exist")
    .and("be.visible")
    .contains(name)
    .contains(year);
});

Cypress.Commands.add("editPlatform", (id, name, year) => {
  cy.get(`[data-testid='edit-platform-${id}']`).click();
  cy.get(`[data-testid='platform-name-${id}']`).clear();
  cy.get(`[data-testid='platform-name-${id}']`).type(name);
  cy.get(`[data-testid='platform-year-${id}']`).click();
  cy.get(`[data-value='${year}']`).click();
  cy.get(`[data-testid='save-platform-${id}']`).click();
  cy.wait("@putPlatform");
  cy.get("[data-testid='app.snackbar']").should("be.visible");
  cy.get(`[data-testid='platform-${id}']`)
    .should("exist")
    .and("be.visible")
    .contains(name)
    .contains(year);
});

Cypress.Commands.add("deletePlatform", (id) => {
  cy.get(`[data-testid='delete-platform-${id}']`).click();
  cy.wait("@deletePlatform");
  cy.get("[data-testid='app.snackbar']").should("be.visible");
});
