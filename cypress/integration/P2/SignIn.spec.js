/// <reference types="cypress" />

const names = require('/cypress/fixtures/email')

    it('5821: Verify error messages when user sign in with blank details', () => {
        
        //Navigate to drupal landing page
        cy.visit('https://g2-qa.cgsd.uk/')

        //Click sign in
        cy.contains('Sign in').click()
        
        //Enter username
        cy.get('#edit-name').type(Cypress.env("DRUPAL_USERNAME"))

        //Click next
        cy.get('#edit-submit').click()

        //assert that error summary is displayed
        cy.get('.govuk-error-summary').should('exist')

        //Enter password
        cy.get('#edit-pass').type(Cypress.env("DRUPAL_PASSWORD"), { log: false })

        cy.get('#edit-name').clear()

        //Click next
        cy.get('#edit-submit').click()

        //assert that error summary is displayed
        cy.get('.govuk-error-summary').should('exist')
    })

    names.forEach((name) => {
            it(`5822: Verify error messages when user sign in with email as "${name}"`, () => {

                //Navigate to drupal landing page
                cy.visit('https://g2-qa.cgsd.uk/')

                //Click sign in
                cy.contains('Sign in').click()

                //type invalid email
                cy.get('#edit-name').type(name)

                //click sign in
                cy.get('#edit-submit').click()

                //assert that error summary is displayed
                cy.get('.govuk-error-summary').should('exist')

                //clear invalid email
                cy.get('#edit-name').clear()
            })
        })

    it('5823: Verify error messages when user sign in with un-registered email address', () => {
        
        //Navigate to drupal landing page
        cy.visit('https://g2-qa.cgsd.uk/')

        //Click sign in
        cy.contains('Sign in').click()
        
        //Enter username
        cy.get('#edit-name').type('a@b.c')

        //Enter password
        cy.get('#edit-pass').type(Cypress.env("DRUPAL_PASSWORD"), { log: false })

        //Click next
        cy.get('#edit-submit').click()

        //assert that error summary is displayed
        cy.get('.govuk-error-summary').should('exist')
    })
    