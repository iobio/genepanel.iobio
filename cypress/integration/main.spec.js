describe('Overview page', function() {
  it('Visits the Overview Page', function() {
    cy.visit('http://localhost:8080/');

  })
  it('Visit GTR Component', ()=>{
    cy.get("#gtrButton").click();
  })
  it('Search a condition', ()=>{
    cy.get("#input").type('Treacher Collins syndrome');
    cy.get("#generateGtrListButton").click();
    cy.get("#input").should('have.value', 'Treacher Collins syndrome');
    cy.wait(10000)
  })
  it('Visit Phenolyzer Component', ()=>{
    cy.get('#phenolyzerMainButton').click();
  })
  it('Search a phenotype', ()=>{
    cy.get("#phenotype-term").type('Treacher Collins syndrome');
    cy.get("#phenotype-term").should('have.value', 'Treacher Collins syndrome');
    cy.get("#generatePhenolyzerListButton").click();
    cy.wait(2000)
  })
  it('visit Summary Component', ()=>{
    cy.get('#summaryMainButton').click();
  })
  it('Copy all genes', ()=>{
    cy.get('#exportButton').click();
    cy.get('#copyAllGenesButton').click();
  })

})
