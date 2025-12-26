import { CanvasPage } from '../../src/pages/CanvasPage';

describe('Roadmap Canvas Operations', () => {
  const canvasPage = new CanvasPage();

  beforeEach(() => {
    // Login and create a roadmap before each test
    cy.fixture('user').then((users) => {
      cy.login(users.validUser.email, users.validUser.password);
    });

    cy.createRoadmap();
    cy.wait(1000); // Wait for canvas to load
  });

  describe('Roadmap Title Editing', () => {
    it('should edit roadmap title inline', () => {
      const newTitle = 'Updated Roadmap Title';
      
      canvasPage.editTitle(newTitle);
      
      // Wait a bit for title to update
      cy.wait(500);
      
      canvasPage.verifyTitle(newTitle);
    });

    it('should save title changes', () => {
      const newTitle = 'Saved Title';
      
      canvasPage.editTitle(newTitle);
      
      cy.wait(500);
      
      canvasPage.clickSave();

      // Wait for save
      cy.wait(1000);

      // Reload and verify title persisted
      cy.reload();
      cy.wait(1000);
      canvasPage.verifyTitle(newTitle);
    });
  });

  describe('Auto-Save Toggle', () => {
    it('should toggle auto-save on and off', () => {
      canvasPage.toggleAutoSave();
      
      cy.wait(500);
      
      canvasPage.toggleAutoSave();
      
      cy.wait(500);
    });
  });

  describe('Add Nodes', () => {
    it('should add minimal node by clicking template', () => {
      canvasPage.addMinimalNodeByClick();
      
      canvasPage.verifyNodeCount(1);
    });

    it('should add custom node by clicking template', () => {
      canvasPage.addCustomNodeByClick();
      
      canvasPage.verifyNodeCount(1);
    });

    it('should add multiple nodes', () => {
      canvasPage.addMinimalNodeByClick();
      canvasPage.addMinimalNodeByClick();
      canvasPage.addCustomNodeByClick();
      
      canvasPage.verifyNodeCount(3);
    });
  });

  describe('Node Toolbar Actions', () => {
    beforeEach(() => {
      // Add a minimal node before each test (has toolbar)
      canvasPage.addMinimalNodeByClick();
      cy.wait(1000); // Wait for node to be fully added
    });

    it('should click edit button on node toolbar', () => {
      // Just verify the button can be clicked
      canvasPage.clickEditOnNode(0);
      
      cy.wait(1000);
      
      // Verify modal/editor appeared
      canvasPage.verifyNodeEditorVisible();
    });

    it('should click view button on node toolbar', () => {
      // Just verify the button can be clicked
      canvasPage.clickViewOnNode(0);
      
      cy.wait(1000);
      
      // Verify sidebar appeared
      canvasPage.verifyNodeSidebarVisible();
    });

    it('should duplicate node when clicking duplicate button', () => {
      canvasPage.clickDuplicateOnNode(0);
      
      cy.wait(1000);
      
      canvasPage.verifyNodeCount(2);
    });

    it('should delete node when clicking delete button', () => {
      canvasPage.clickDeleteOnNode(0);
      
      cy.wait(1000);
      
      canvasPage.verifyNodeCount(0);
    });
  });

  describe('Save Operations', () => {
    it('should manually save roadmap', () => {
      canvasPage.addMinimalNodeByClick();
      
      cy.wait(500);
      
      canvasPage.clickSave();

      // Wait for save to complete
      cy.wait(1000);
      
      // Verify no error (page still loads)
      cy.get('.react-flow').should('exist');
    });
  });
});
