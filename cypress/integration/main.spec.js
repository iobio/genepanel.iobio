describe('Overview page', function() {
  it('Visits the Overview Page', function() {
    cy.visit('http://localhost:8080/');
    cy.get("#gtrButton").click();
  })
})
