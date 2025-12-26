describe('Navigation', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Default Page Redirects', () => {
    it('should allow logged-in users to access home page', () => {
      cy.fixture('user').then((users) => {
        cy.login(users.validUser.email, users.validUser.password);
        
        cy.visit('/');
        // Should stay on home page, not redirect
        cy.url().should('eq', Cypress.config().baseUrl + '/');
      });
    });

    it('should show home page for anonymous users', () => {
      cy.visit('/');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should redirect to login when accessing protected routes', () => {
      cy.visit('/roadmaps');
      cy.url().should('include', '/login');

      cy.visit('/profile');
      cy.url().should('include', '/login');
    });
  });

  describe('Navbar Links', () => {
    beforeEach(() => {
      cy.fixture('user').then((users) => {
        cy.login(users.validUser.email, users.validUser.password);
      });
    });

    it('should navigate to roadmaps from navbar', () => {
      cy.visit('/profile');
      
      cy.contains('a', /roadmap/i).click();
      cy.url().should('include', '/roadmaps');
    });

    it('should navigate to profile from navbar', () => {
      cy.visit('/roadmaps');
      
      // Click on profile link (uses username or email)
      cy.contains('a[href="/profile"]', /.+/).click();
      
      cy.url().should('include', '/profile');
    });

    it('should navigate to home from navbar logo', () => {
      cy.visit('/roadmaps');
      
      // Click logo or home link
      cy.get('a[href="/"]').first().click();
      // Should go to home page (logged-in users can access it now)
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Navbar Authentication State', () => {
    it('should show login/signup links for anonymous users', () => {
      cy.visit('/');
      
      // Look for Sign in or Login text
      cy.contains(/sign.*in|login/i).should('be.visible');
    });

    it('should show user info and logout for authenticated users', () => {
      cy.fixture('user').then((users) => {
        cy.login(users.validUser.email, users.validUser.password);
        
        cy.visit('/roadmaps');
        
        // Should show profile link (username or email)
        cy.get('a[href="/profile"]').should('be.visible');
        cy.contains('button', /logout/i).should('be.visible');
      });
    });

    it('should hide login/signup links for authenticated users', () => {
      cy.fixture('user').then((users) => {
        cy.login(users.validUser.email, users.validUser.password);
        
        cy.visit('/roadmaps');
        
        // Should not have standalone login/signup links
        cy.get('a[href="/login"]').should('not.exist');
        cy.get('a[href="/signup"]').should('not.exist');
      });
    });
  });
});
