export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      visitPlatforms(): Chainable<void>;
      interceptApiCalls(): Chainable<void>;
      addPlatform(name: string, year: number): Chainable<void>;
      editPlatform(id: number, name: string, year: number): Chainable<void>;
      deletePlatform(id: number): Chainable<void>;
    }
  }
}

Cypress.Commands.add("visitPlatforms", () => {
  cy.visit("/platforms");
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
  cy.intercept("DELETE", "/api/platforms/4").as("deletePlatform");
});

Cypress.Commands.add("addPlatform", (name: string, year: number) => {
  cy.visit("/platforms/new");
  cy.get("[data-testid='platform-name-form'] input")
    .should("exist")
    .and("be.visible")
    .type(name);
  cy.get("[data-testid='platform-year-form']").click();
  cy.get(`[data-value='${year}']`).click();
  cy.get("[data-testid='add-platform']").click();
  cy.wait("@postPlatform");
});

Cypress.Commands.add(
  "editPlatform",
  (id: number, name: string, year: number) => {
    cy.visit(`/platforms/${id}/edit`);
    cy.get("[data-testid='platform-name-form'] input").clear();
    cy.get("[data-testid='platform-name-form'] input").type(name);
    cy.get("[data-testid='platform-year-form']").click();
    cy.get(`[data-value='${year}']`).click();
    cy.get("[data-testid='save-platform']").click();
    cy.wait("@putPlatform");
  },
);

Cypress.Commands.add("deletePlatform", (id: number) => {
  cy.get(`[data-testid='delete-platform-${id}']`).click();
  cy.get("[data-testid='app.confirmationDialog.btnConfirm']").click();
  cy.wait("@deletePlatform");
  cy.get("[data-testid='app.snackbar']").should("be.visible");
});
