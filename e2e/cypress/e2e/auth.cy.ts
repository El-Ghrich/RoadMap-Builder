import { LoginPage } from '../../src/pages/LoginPage';
import { SignupPage } from '../../src/pages/SignupPage';

describe('Authentication Flow', () => {
  const loginPage = new LoginPage();
  const signupPage = new SignupPage();

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('User Signup', () => {
    it('should successfully sign up a new user', () => {
      cy.fixture('user').then((users) => {
        const newUser = {
          name: `Test User ${Date.now()}`,
          email: `test_${Date.now()}@example.com`,
          password: users.newUser.password
        };

        signupPage
          .visit()
          .signup(newUser.name, newUser.email, newUser.password);

        // Should redirect to login
        cy.url().should('include', '/login');
      });
    });

    it('should show error for duplicate email', () => {
      cy.fixture('user').then((users) => {
        // First signup
        signupPage
          .visit()
          .signup(users.validUser.username, users.validUser.email, users.validUser.password);

        cy.wait(2000); // Wait for signup to complete

        // Try to signup again with same email
        signupPage
          .visit()
          .signup('Another Name', users.validUser.email, users.validUser.password);

        cy.wait(1000); // Wait for error to appear
        signupPage.verifyErrorMessage();
      });
    });

    it('should navigate to login page from signup', () => {
      signupPage
        .visit()
        .clickLoginLink();

      cy.url().should('include', '/login');
    });
  });

  describe('User Login', () => {
    it('should successfully login with valid credentials', () => {
      cy.fixture('user').then((users) => {
        loginPage
          .visit()
          .login(users.validUser.email, users.validUser.password)
          .verifyRedirectToRoadmaps();
      });
    });

    it('should successfully login with remember me checked', () => {
      cy.fixture('user').then((users) => {
        loginPage
          .visit()
          .login(users.validUser.email, users.validUser.password, true)
          .verifyRedirectToRoadmaps();

        // Verify refresh token is stored (if using cookies)
        cy.getAllCookies().then((cookies) => {
          cy.log('Cookies:', cookies);
        });
      });
    });

    it('should show error for invalid credentials', () => {
      loginPage
        .visit()
        .login('invalid@example.com', 'wrongpassword');
      
      // Wait for error to appear
      cy.wait(1000);
      loginPage.verifyErrorMessage();
    });

    it('should navigate to signup page from login', () => {
      loginPage
        .visit()
        .clickSignupLink();

      cy.url().should('include', '/signup');
    });
  });

  describe('User Logout', () => {
    beforeEach(() => {
      // Login before each logout test
      cy.fixture('user').then((users) => {
        cy.login(users.validUser.email, users.validUser.password);
      });
    });

    it('should successfully logout', () => {
      cy.logout();
      // Should redirect to home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Protected Route Redirects', () => {
    it('should redirect to login when accessing protected route without auth', () => {
      cy.visit('/roadmaps');
      cy.url().should('include', '/login');
    });
  });
});
