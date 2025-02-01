Cypress.Commands.add('addItem', (type) => {
  cy.get(`[data-cy="${type}"]`).children().first().children('button').click();
});
