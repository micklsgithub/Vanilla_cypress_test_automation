/// <reference types="cypress" />

it('5820: Verify user is able to signin by providing correct login details ', () => {
        
    //Navigate to drupal landing page
    cy.visit('https://g2-qa.cgsd.uk/')

    //Click sign in
    cy.contains('Sign in').click()
    
    //Enter username
    cy.get('#edit-name').type(Cypress.env("DRUPAL_USERNAME"))
    
    //Enter password
    cy.get('#edit-pass').type(Cypress.env("DRUPAL_PASSWORD"), { log: false })

    //Click next
    cy.get('#edit-submit').click()

    //Validate logged in url    
    cy.url().should('eq', 'https://g2-qa.cgsd.uk/user/66');
          
})