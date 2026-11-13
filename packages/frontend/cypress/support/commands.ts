import {
  CreateGameBody,
  CreatePlatformBody,
  GamesListResponse,
  PlatformsListResponse,
} from "@vgm/types";

export {};

const API_URL = "http://localhost:5000/api";

const seedPlatforms: CreatePlatformBody[] = [
  { name: "Xbox 360", year: 2005 },
  { name: "Xbox One", year: 2013 },
  { name: "PlayStation 4", year: 2013 },
  { name: "PlayStation 5", year: 2020 },
];

const seedGames: Array<
  Omit<CreateGameBody, "platform"> & { platformName: string }
> = [
  {
    name: "Mass Effect",
    year: 2007,
    platformName: "Xbox 360",
    genre: "Action",
    status: "Completed",
    rating: 4,
  },
  {
    name: "Halo",
    year: 2010,
    platformName: "Xbox One",
    genre: "Action",
    status: "Playing",
    rating: 3,
  },
];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      resetDatabase(): Chainable<void>;
      getPlatformId(name: string): Chainable<number>;
      getGameId(name: string): Chainable<number>;
      visitPlatforms(): Chainable<void>;
      interceptApiCalls(): Chainable<void>;
      addPlatform(name: string, year: number): Chainable<void>;
      editPlatform(id: number, name: string, year: number): Chainable<void>;
      deletePlatform(id: number): Chainable<void>;
    }
  }
}

Cypress.Commands.add("resetDatabase", () => {
  return cy
    .request<GamesListResponse>("GET", `${API_URL}/games`)
    .then(({ body }) =>
      cy
        .wrap(body.games)
        .each(({ id }) => cy.request("DELETE", `${API_URL}/games/${id}`)),
    )
    .then(() =>
      cy.request<PlatformsListResponse>("GET", `${API_URL}/platforms`),
    )
    .then(({ body }) =>
      cy
        .wrap(body.platforms)
        .each(({ id }) => cy.request("DELETE", `${API_URL}/platforms/${id}`)),
    )
    .then(() =>
      cy
        .wrap(seedPlatforms)
        .each((platform) =>
          cy.request("POST", `${API_URL}/platforms`, platform),
        ),
    )
    .then(() =>
      cy.request<PlatformsListResponse>("GET", `${API_URL}/platforms`),
    )
    .then(({ body }) => {
      const platformIds = new Map(
        body.platforms.map(({ id, name }) => [name, id]),
      );
      return cy.wrap(seedGames).each((game) => {
        const platform = platformIds.get(game.platformName);
        if (platform === undefined) {
          throw new Error(`Test platform not found: ${game.platformName}`);
        }
        const { platformName: _platformName, ...gameBody } = game;
        return cy.request("POST", `${API_URL}/games`, {
          ...gameBody,
          platform,
        });
      });
    })
    .then(() => undefined);
});

Cypress.Commands.add("getPlatformId", (name) =>
  cy
    .request<PlatformsListResponse>("GET", `${API_URL}/platforms`)
    .then(({ body }) => {
      const platform = body.platforms.find((item) => item.name === name);
      if (!platform) {
        throw new Error(`Test platform not found: ${name}`);
      }
      return platform.id;
    }),
);

Cypress.Commands.add("getGameId", (name) =>
  cy.request<GamesListResponse>("GET", `${API_URL}/games`).then(({ body }) => {
    const game = body.games.find((item) => item.name === name);
    if (!game) {
      throw new Error(`Test game not found: ${name}`);
    }
    return game.id;
  }),
);

Cypress.Commands.add("visitPlatforms", () => {
  cy.visit("/platforms");
});

Cypress.Commands.add("interceptApiCalls", () => {
  cy.intercept("GET", "/api/games?$expand=platform").as("getGames");
  cy.intercept("GET", "/api/platforms").as("getPlatforms");
  cy.intercept("POST", "/api/games").as("postGame");
  cy.intercept("DELETE", /\/api\/games\/\d+$/).as("deleteGame");
  cy.intercept("POST", "/api/platforms").as("postPlatform");
  cy.intercept("PUT", /\/api\/platforms\/\d+$/).as("putPlatform");
  cy.intercept("DELETE", /\/api\/platforms\/\d+$/).as("deletePlatform");
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
  cy.wait("@postPlatform").its("response.statusCode").should("eq", 200);
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
    cy.wait("@putPlatform").its("response.statusCode").should("eq", 200);
  },
);

Cypress.Commands.add("deletePlatform", (id: number) => {
  cy.get(`[data-testid='delete-platform-${id}']`).click();
  cy.get("[data-testid='app.confirmationDialog.btnConfirm']").click();
  cy.wait("@deletePlatform").its("response.statusCode").should("eq", 200);
  cy.get("[data-testid='app.snackbar']").should("be.visible");
});
