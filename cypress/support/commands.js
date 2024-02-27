const pkceChallenge = require("pkce-challenge");

//declare variables for authorisation request.
const config = {
  username: Cypress.env("USERNAME"),
  password: Cypress.env("PASSWORD"),
  tenant: Cypress.env("TENANT"),
  clientId: Cypress.env("CLIENTID"),
  clientSecret: Cypress.env("CLIENTSECRET"),
  scope: Cypress.env("SCOPE"),
  userid: Cypress.env("USERNAME"),
};
let baseUrl = Cypress.env("BASE_URL");
let baseUrlRegex =
  baseUrl.replace(/\//g, "\\/").replace(/\./g, "\\.") + "[^\r\n]*";

Cypress.Commands.add("drupalLogin", () => {
  cy.visit("https://g2-qa.cgsd.uk/");
  cy.contains("Sign in").click();
  cy.get("#edit-name").type(Cypress.env("DRUPAL_USERNAME"));
  cy.get("#edit-pass").type(Cypress.env("DRUPAL_PASSWORD"), { log: false });
  cy.get("#edit-submit").click();
});

Cypress.Commands.add("authoriseOutlookApi", () => {
  cy.task("getChallenge").then((getChallenge) => {
    const codeChallenge = getChallenge.code_challenge;
    cy.log(codeChallenge);

    cy.api({
      url: `/${Cypress.env("TENANT")}/oauth2/v2.0/authorize?
          client_id=${Cypress.env("CLIENTID")}&response_type=code
          &response_mode=query
          &scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
          &state=12345
          &code_challenge=${codeChallenge}
          &code_challenge_method=S256`,
    });
  });
});

Cypress.Commands.add("getOutlookAccessToken", () => {
  // Fetch the access token for the Microsoft Graph
  cy.request({
    method: "POST",
    url: `https://login.microsoft.com/${config.tenant}/oauth2/v2.0/token`,
    header: {
      "cache-control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: true,
    body: {
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: config.scope,
      password: config.password,
      username: config.username,
    },
  }).then((response) => {
    expect(response).property("status").to.equal(200);
    if (response && response.status === 200 && response.body) {
      const accessToken = response.body["access_token"];
      window.localStorage.setItem("jwt", accessToken);
    }
  });
});

Cypress.Commands.add("getOutlookMessage", { retries: { openMode: 5 } }, () => {
  cy.pause(1000);
  var accessToken = window.localStorage.getItem("jwt");
  //fetch the email messages from the users inbox with a specific subject

  cy.request({
    method: "GET",
    url: `https://graph.microsoft.com/v1.0/users/${config.userid}/messages?$filter=contains(subject, 'Verify your email address')`,
    headers: {
      "cache-control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
      authorization: accessToken,
    },
    form: true,
  }).then((response) => {
    return new Promise((resolve) => {
      //Assert response is returned with status 200

      if (resp.status === 200 && resp.body.ok === true)
        cy.get(response.body.value).each(($el) => {
          let emailBody = $el.body.content;
          let emailId = $el.id;
          cy.wrap(emailBody).then((emailBody) => {
            let href = emailBody.match(baseUrlRegex);
            cy.get(href).each(() => {
              let textString = href.toString();
              cy.visit(textString);
              //delete the email after accessing the link in the email
              cy.request({
                method: "DELETE",
                url: `https://graph.microsoft.com/v1.0/users/${config.userid}/messages/${emailId}`,
                headers: {
                  "cache-control": "no-cache",
                  "Content-Type": "application/x-www-form-urlencoded",
                  authorization: accessToken,
                },
                form: true,
              }).then((response) => {
                return new Promise((resolve) => {
                  //Assert response is returned with status 204 (no content) as it has been deleted
                  expect(response).property("status").to.equal(204);
                  resolve(response);
                });
              });
            });
          });
        });
      resolve(response);

      cy.getOutlookMessage();
    });
  });
});

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
