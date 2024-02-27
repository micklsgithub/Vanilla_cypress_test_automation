/// <reference types="cypress" />
const names = require("/cypress/fixtures/invalidEmail");

names.forEach((name) => {
  it(`5829: Verify resetting password with email as "${name}"`, () => {
    //Navigate to drupal landing page
    cy.visit("https://g2-qa.cgsd.uk/");

    //Click sign in
    cy.contains("Sign in").click();

    //Click to expand help/create account accordian
    cy.get(".govuk-details__summary-text").click();

    //click reset password link
    cy.get(".govuk-details__text > :nth-child(2) > a").click();

    //Enter email address
    cy.get("#edit-name").type(name);

    //Click send button
    cy.get("#edit-submit").click();
  });
});
