declare namespace Cypress {
  interface Chainable<Subject> {
    addItem(title: string): Chainable<Subject>;
  }
}
