export class SignupPage {
  // Selectors - Updated to match actual form structure
  private nameInput = 'input[name="name"]';  // Note: uses "name" not "username"
  private emailInput = 'input[name="email"]';
  private passwordInput = 'input[name="password"]';
  private confirmPasswordInput = 'input[name="confirmPassword"]';
  private termsCheckbox = 'input[type="checkbox"]#terms';
  private submitButton = 'button[type="submit"]';
  private errorMessage = '[class*="authError"]';
  private loginLink = 'a[href="/login"]';

  visit() {
    cy.visit('/signup');
    return this;
  }

  fillName(name: string) {
    cy.get(this.nameInput).clear().type(name);
    return this;
  }

  fillEmail(email: string) {
    cy.get(this.emailInput).clear().type(email);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.passwordInput).clear().type(password);
    return this;
  }

  fillConfirmPassword(password: string) {
    cy.get(this.confirmPasswordInput).clear().type(password);
    return this;
  }

  acceptTerms() {
    cy.get(this.termsCheckbox).check();
    return this;
  }

  submit() {
    cy.get(this.submitButton).click();
    return this;
  }

  signup(name: string, email: string, password: string) {
    this.fillName(name);
    this.fillEmail(email);
    this.fillPassword(password);
    this.fillConfirmPassword(password);
    this.acceptTerms();
    this.submit();
    return this;
  }

  verifyErrorMessage(message?: string) {
    if (message) {
      cy.get(this.errorMessage).should('be.visible').and('contain', message);
    } else {
      cy.get(this.errorMessage).should('be.visible');
    }
    return this;
  }

  verifyRedirectToLogin() {
    cy.url().should('include', '/login');
    return this;
  }

  verifyRedirectToRoadmaps() {
    cy.url().should('include', '/roadmaps');
    return this;
  }

  clickLoginLink() {
    cy.get(this.loginLink).click();
    return this;
  }
}
