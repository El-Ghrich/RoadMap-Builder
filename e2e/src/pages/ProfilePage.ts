export class ProfilePage {
  // Selectors - Updated for CSS modules (use attribute selectors)
  private profileContainer = '[class*="profileContainer"]';
  private profileEmail = '[class*="profileEmail"]';
  private statsGrid = '[class*="statsGrid"]';
  private statItem = '[class*="statItem"]';
  private statValue = '[class*="statValue"]';
  private statLabel = '[class*="statLabel"]';
  private editButton = 'a[href="/profile/edit"]';
  private logoutButton = '[class*="logoutButton"], button:contains("Logout")';

  visit() {
    cy.visit('/profile');
    return this;
  }

  verifyEmail(email: string) {
    cy.get(this.profileEmail).should('contain', email);
    return this;
  }

  verifyRoadmapCount(count: number) {
    // Find the stat item with "Roadmaps" label and check its value
    cy.get(this.statsGrid).within(() => {
      cy.contains(this.statItem, 'Roadmaps').within(() => {
        cy.get(this.statValue).should('contain', count.toString());
      });
    });
    return this;
  }

  verifyFollowersCount(count: number) {
    cy.get(this.statsGrid).within(() => {
      cy.contains(this.statItem, 'Followers').within(() => {
        cy.get(this.statValue).should('contain', count.toString());
      });
    });
    return this;
  }

  verifyFollowingCount(count: number) {
    cy.get(this.statsGrid).within(() => {
      cy.contains(this.statItem, 'Following').within(() => {
        cy.get(this.statValue).should('contain', count.toString());
      });
    });
    return this;
  }

  clickEditProfile() {
    cy.get(this.editButton).click();
    return this;
  }

  clickLogout() {
    cy.get(this.logoutButton).click();
    return this;
  }

  verifyProfileLoaded() {
    cy.get(this.profileContainer).should('be.visible');
    return this;
  }
}
