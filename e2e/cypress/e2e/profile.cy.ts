import { ProfilePage } from '../../src/pages/ProfilePage';

describe('Profile and Stats', () => {
  const profilePage = new ProfilePage();

  beforeEach(() => {
    // Login before each test
    cy.fixture('user').then((users) => {
      cy.login(users.validUser.email, users.validUser.password);
    });
  });

  describe('View Profile', () => {
    it('should display user profile information', () => {
      cy.fixture('user').then((users) => {
        profilePage
          .visit()
          .verifyProfileLoaded()
          .verifyEmail(users.validUser.email);
      });
    });

    it('should navigate to profile from navbar', () => {
      cy.visit('/roadmaps');
      
      // Click profile link in navbar
      cy.get('a[href="/profile"]').click();
      
      cy.url().should('include', '/profile');
      profilePage.verifyProfileLoaded();
    });
  });

  describe('Roadmap Stats', () => {
    it('should display roadmap count', () => {
      profilePage.visit();
      
      // Just verify the stat exists and has a number
      cy.get('[class*="statsGrid"]').within(() => {
        cy.contains('[class*="statItem"]', 'Roadmaps').within(() => {
          cy.get('[class*="statValue"]').should('exist').invoke('text').should('match', /^\d+$/);
        });
      });
    });

    it('should update roadmap count after creating a roadmap', () => {
      // Get initial count
      profilePage.visit();
      let initialCount = 0;
      
      cy.get('[class*="statsGrid"]').within(() => {
        cy.contains('[class*="statItem"]', 'Roadmaps').within(() => {
          cy.get('[class*="statValue"]').invoke('text').then((text) => {
            initialCount = parseInt(text);
          });
        });
      });

      // Create a roadmap
      cy.createRoadmap();

      // Visit profile and verify count increased
      profilePage.visit();
      
      cy.get('[class*="statsGrid"]').within(() => {
        cy.contains('[class*="statItem"]', 'Roadmaps').within(() => {
          cy.get('[class*="statValue"]').invoke('text').then((text) => {
            const newCount = parseInt(text);
            expect(newCount).to.be.greaterThan(initialCount);
          });
        });
      });
    });

    it('should update roadmap count after creating multiple roadmaps', () => {
      // Get initial count
      profilePage.visit();
      let initialCount = 0;
      
      cy.get('[class*="statsGrid"]').within(() => {
        cy.contains('[class*="statItem"]', 'Roadmaps').within(() => {
          cy.get('[class*="statValue"]').invoke('text').then((text) => {
            initialCount = parseInt(text);
          });
        });
      });

      // Create multiple roadmaps
      cy.createRoadmap();
      cy.createRoadmap();
      cy.createRoadmap();

      // Visit profile and verify count increased by 3
      profilePage.visit();
      
      cy.get('[class*="statsGrid"]').within(() => {
        cy.contains('[class*="statItem"]', 'Roadmaps').within(() => {
          cy.get('[class*="statValue"]').invoke('text').then((text) => {
            const newCount = parseInt(text);
            expect(newCount).to.equal(initialCount + 3);
          });
        });
      });
    });
  });

  describe('Profile Actions', () => {
    it('should navigate to edit profile page', () => {
      profilePage
        .visit()
        .clickEditProfile();

      cy.url().should('include', '/profile/edit');
    });

    it('should logout from profile page', () => {
      profilePage
        .visit()
        .clickLogout();

      // Should redirect to home (not login)
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Stats Display', () => {
    it('should display followers count', () => {
      profilePage
        .visit()
        .verifyFollowersCount(0);
    });

    it('should display following count', () => {
      profilePage
        .visit()
        .verifyFollowingCount(0);
    });
  });
});
