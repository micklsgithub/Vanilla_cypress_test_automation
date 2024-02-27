/// <reference types="cypress" />

const firstName = "cypress";
const lastName = "test";
const password = "?Tm7c<zA~Umwd6gP";
//let inboxId = "";
//let emailAddress = "";

it("5758: Verify Creation of Account by providing valid information", () => {
  let username = Cypress.env("USERNAME");
  let emailAddress = "";

  //Navigate to drupal landing page
  cy.visit("https://g2-qa.cgsd.uk/");

  //Click sign in
  cy.contains("Sign in").click();

  //Click to expand help/create account accordian
  cy.get(".govuk-details__summary-text").click();

  //Click create an account link
  cy.contains("create an account").click();
  //cy.get(':nth-child(4) > a').click()

  //Enter first name
  cy.get("#edit-field-first-name-0-value").type(firstName);

  //Enter last name
  cy.get("#edit-field-last-name-0-value").type(lastName);

  //Enter email
  cy.task("usernameDateTime", username).then((emailWithAlias) => {
    emailAddress = emailWithAlias;
    cy.get("#edit-mail").type(emailAddress);
  });

  //Enter password
  cy.get("#edit-pass").type(Cypress.env("PASSWORD"), { log: false });

  //Click create account button
  cy.get("#edit-submit").click();

  //Request access token from outlooks api
  cy.getOutlookAccessToken();

  //Request email message from outlooks api and click the link to verify the account
  cy.getOutlookMessage();
});
