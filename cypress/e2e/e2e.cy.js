/// <reference types="cypress" />

describe('E2E tests', () => {
  const random = Math.floor(Math.random() * 100000);

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/');
    cy.wait(2000);
    cy.clearAllCookies();
  });

  it('should displays input fields', () => {
    cy.get('.text-input').should('have.length', 2);
  });

  it('should go to sign up page', () => {
    cy.get('.signup').click();
    cy.url().should('include', '/signup');
  });

  it('should fill in sign up form', () => {
    cy.get('.signup').click();
    cy.wait(2000);
    cy.get('.text-input').eq(0).type('test');
    cy.get('.text-input').eq(1).type('test' + random);
    cy.get('.text-input').eq(2).type('test' + random + '@test.com');
    cy.get('.text-input').eq(3).type('test123');
    cy.get('.text-input').eq(4).type('test123');
    cy.get('.form-button').click();
    cy.url().should('include', '/home');
  });

  it('should login and go to profile page', () => {
    cy.get('.text-input').eq(0).type('test' + random + '@test.com');
    cy.get('.text-input').eq(1).type('test123');
    cy.get('.form-button').click();
    cy.wait(1000);
    cy.url().should('include', '/home');
    cy.wait(1000);
    cy.get('.list-item').eq(4).click();
    cy.url().should('include', '/profile/test' + random);
  });

  it('should login and logout', () => {
    cy.get('.text-input').eq(0).type('test' + random + '@test.com');
    cy.get('.text-input').eq(1).type('test123');
    cy.get('.form-button').click();
    cy.wait(1000);
    cy.url().should('include', '/home');
    cy.wait(1000);
    cy.get('.list-item').eq(5).click();
    cy.url().should('eq', 'http://127.0.0.1:5173/'); 
  });
});
