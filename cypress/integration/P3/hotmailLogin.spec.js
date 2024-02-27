/// <reference types="cypress" />

it("Log into hotmail", () => {
  cy.getOutlookAccessToken();
  cy.getOutlookMessage();
});
