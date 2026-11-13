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

describe("Platforms Settings", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.interceptApiCalls();
    cy.visitPlatforms();
    cy.wait("@getGames").its("response.statusCode").should("eq", 200);
    cy.wait("@getPlatforms").its("response.statusCode").should("eq", 200);
  });

  it("should add, edit, and delete platforms", () => {
    cy.addPlatform("Nintendo Switch", 2017);

    cy.getPlatformId("Xbox One").then((platformId) => {
      cy.editPlatform(platformId, "Xbox One X", 2017);
    });

    cy.getPlatformId("Nintendo Switch").then((platformId) => {
      cy.visitPlatforms();
      cy.wait("@getGames").its("response.statusCode").should("eq", 200);
      cy.wait("@getPlatforms").its("response.statusCode").should("eq", 200);
      cy.deletePlatform(platformId);
    });

    cy.request("GET", "http://localhost:5000/api/platforms").then(
      ({ body }) => {
        assert.isFalse(
          body.platforms.some(
            (platform: { name: string }) => platform.name === "Nintendo Switch",
          ),
        );
        assert.isTrue(
          body.platforms.some(
            (platform: { name: string }) => platform.name === "Xbox One X",
          ),
        );
      },
    );
  });

  it("should disable delete buttons for platforms associated with games", () => {
    cy.getPlatformId("Xbox 360").then((xbox360Id) => {
      cy.getPlatformId("Xbox One").then((xboxOneId) => {
        cy.getPlatformId("PlayStation 4").then((playStation4Id) => {
          cy.getPlatformId("PlayStation 5").then((playStation5Id) => {
            validateButtons(
              "delete",
              [xbox360Id, xboxOneId],
              [playStation4Id, playStation5Id],
            );
          });
        });
      });
    });
  });
});
