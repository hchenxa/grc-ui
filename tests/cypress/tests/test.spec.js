/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */
/// <reference types="cypress" />
// This is the demo test
describe('Login', () => {
  before(() => {
    cy.login()
  })
  after(() => {
    cy.logout()
  })
  it('should load the home page', () => {
    cy.get('#header').should('exist')
  })
})