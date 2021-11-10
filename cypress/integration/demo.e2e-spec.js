describe('home page', () => {
  before(() => {
    cy.visit('');
  });

  it('interacts with some basic elements', () => {
    cy.log('find element by selector and text, then click');
    cy.contains('.card', 'Elements').click();

    cy.log('check url');
    cy.url().should('contain', 'elements');

    cy.log('sanity check--make sure the first item group is actually expanded');
    cy.get('.element-group')
      .first()
      .should('contain.text', 'Elements')
      .get('.element-list')
      .should('have.class', 'show')
      .within($list => {
        cy.contains('Text Box').click();
      });

    cy.get('#userName')
      .type('Ima Tester');
    cy.get('#userEmail')
      .invoke('attr', 'placeholder')
      .should('equal', 'name@example.com');
    cy.get('input[type="email"]')
      .type('imatester@mydesk.com');

    cy.log("let's alias a result");
    cy.get('#currentAddress')
      .as('alias');
    cy.get('@alias')
      .invoke('attr', 'placeholder')
      .should('equal', 'Current Address');

    cy.log("and then let's refresh the page to see if we can still use the alias");
    cy.reload();
    cy.get('@alias')
      .type('1234 Utopia Blvd')
      .wait(1500)
      .type('\nhey it worked');
  });

  it('interacts with a dynamic element', () => {
    cy.visit('/dynamic-properties');
    cy.get('#enableAfter')
      .should($btn => {
        expect($btn).to.be.enabled;
      }, { timeout: 6000 })
      .click();
  });

  it('interacts with an API', () => {
    cy.request('BookStore/v1/Books')
      .then(({ body: { books }}) => {
        books.forEach(book => {
          expect(book).to.include.all.keys('isbn', 'title', 'subTitle', 'author');
        });
      });

    cy.request({
      method: 'POST',
      url: 'Account/v1/Authorized',
      body: { userName: 'nonexistent', password: 'letMeIn' },
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.equal(404);
      expect(response.body).to.have.all.keys({ code: 1207, message: 'User not found!' });
    });
  });
});
