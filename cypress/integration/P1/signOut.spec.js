/// <reference types="cypress" />

it('5828: Verify the home page when user Sign out successfully', () => {
    cy.drupalLogin()
    cy.contains('Sign out').click()
    cy.url().should('eq', 'https://g2-qa.cgsd.uk/')
})