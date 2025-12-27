export class CanvasPage {
  // Selectors - Updated to match actual implementation
  private canvasTitle = '[class*="title"]'; // EditableTitle h1
  private titleInput = '[class*="input"]'; // EditableTitle input when editing
  private saveButton = 'button:contains("Save")';
  private autoSaveToggle = 'button:contains("Auto")';
  private templateSidebarToggle = '[class*="toggleButton"]'; // When sidebar is closed
  private templateSidebar = '[class*="sidebar"]'; // The actual sidebar
  private nodeItem = '[class*="nodeItem"]'; // Template node items
  private minimalNodeTemplate = '[class*="nodeItem"]:contains("Minimal Node")';
  private customNodeTemplate = '[class*="nodeItem"]:contains("Custom Node")';
  private reactFlowCanvas = '.react-flow';
  private node = '.react-flow__node';
  private nodeToolbar = '[class*="nodeToolbar"]'; // CSS module class from MinimalNode
  private editButton = 'button[title="Edit"]';
  private viewButton = 'button[title="View"]';
  private duplicateButton = 'button[title="Duplicate"]';
  private deleteButton = 'button[title="Delete"]';
  // Modal/Sidebar selectors - these appear as overlays
  private nodeSidebarOverlay = '[class*="sidebarOverlay"]';
  private nodeSidebar = '[class*="sidebar"]:not([class*="template"])'; // Exclude template sidebar
  private nodeEditorOverlay = '[class*="overlay"]';
  private nodeEditorModal = '[class*="modal"]';

  visit(roadmapId?: string) {
    if (roadmapId) {
      cy.visit(`/canvas/${roadmapId}`);
    } else {
      // Get current URL and extract ID
      cy.url().then(url => {
        if (!url.includes('/canvas/')) {
          cy.visit('/canvas');
        }
      });
    }
    return this;
  }

  editTitle(newTitle: string) {
    // Click the title to enter edit mode
    cy.get(this.canvasTitle).first().click();
    
    // Wait for input to appear and type
    cy.get(this.titleInput).should('be.visible').clear().type(newTitle);
    
    // Press Enter or blur to save
    cy.get(this.titleInput).type('{enter}');
    
    return this;
  }

  verifyTitle(title: string) {
    cy.get(this.canvasTitle).first().should('contain', title);
    return this;
  }

  clickSave() {
    cy.contains('button', 'Save').click();
    return this;
  }

  toggleAutoSave() {
    cy.get(this.autoSaveToggle).click();
    return this;
  }

  verifyAutoSaveEnabled() {
    cy.get(this.autoSaveToggle).should('contain', 'Auto Save: On');
    return this;
  }

  verifyAutoSaveDisabled() {
    cy.get(this.autoSaveToggle).should('contain', 'Auto Save: Off');
    return this;
  }

  ensureTemplateSidebarOpen() {
    // Check if sidebar is already open
    cy.get('body').then($body => {
      if ($body.find(this.templateSidebar).length === 0) {
        // Sidebar is closed, click toggle button
        cy.get(this.templateSidebarToggle).click();
      }
    });
    return this;
  }

  addMinimalNodeByClick() {
    this.ensureTemplateSidebarOpen();
    cy.get(this.minimalNodeTemplate).click();
    cy.wait(500); // Wait for node to be added
    return this;
  }

  addCustomNodeByClick() {
    this.ensureTemplateSidebarOpen();
    cy.get(this.customNodeTemplate).click();
    cy.wait(500); // Wait for node to be added
    return this;
  }

  selectNode(nodeIndex: number = 0) {
    // Click on the node to select it (this makes toolbar visible)
    cy.get(this.node).eq(nodeIndex).click({ force: true });
    cy.wait(300); // Wait for toolbar to appear
    return this;
  }

  clickEditOnNode(nodeIndex: number = 0) {
    this.selectNode(nodeIndex);
    
    // Find toolbar and click edit button
    cy.get(this.nodeToolbar).should('be.visible').within(() => {
      cy.get(this.editButton).click({ force: true });
    });
    return this;
  }

  clickViewOnNode(nodeIndex: number = 0) {
    this.selectNode(nodeIndex);
    
    cy.get(this.nodeToolbar).should('be.visible').within(() => {
      cy.get(this.viewButton).click({ force: true });
    });
    return this;
  }

  clickDuplicateOnNode(nodeIndex: number = 0) {
    this.selectNode(nodeIndex);
    
    cy.get(this.nodeToolbar).should('be.visible').within(() => {
      cy.get(this.duplicateButton).click({ force: true });
    });
    return this;
  }

  clickDeleteOnNode(nodeIndex: number = 0) {
    this.selectNode(nodeIndex);
    
    cy.get(this.nodeToolbar).should('be.visible').within(() => {
      cy.get(this.deleteButton).click({ force: true });
    });
    
    // Confirm deletion if browser confirm appears
    cy.on('window:confirm', () => true);
    
    return this;
  }

  verifyNodeCount(count: number) {
    if (count === 0) {
      cy.get(this.node).should('not.exist');
    } else {
      cy.get(this.node).should('have.length', count);
    }
    return this;
  }

  verifyNodeSidebarVisible() {
    // Check for either the overlay or the sidebar itself
    cy.get('body').then($body => {
      const hasSidebarOverlay = $body.find(this.nodeSidebarOverlay).length > 0;
      const hasSidebar = $body.find(this.nodeSidebar).length > 0;
      
      expect(hasSidebarOverlay || hasSidebar).to.be.true;
    });
    return this;
  }

  verifyNodeEditorVisible() {
    // Check for either the overlay or the modal itself
    cy.get('body').then($body => {
      const hasOverlay = $body.find(this.nodeEditorOverlay).length > 0;
      const hasModal = $body.find(this.nodeEditorModal).length > 0;
      
      expect(hasOverlay || hasModal).to.be.true;
    });
    return this;
  }

  closeNodeSidebar() {
    cy.get(this.nodeSidebar).within(() => {
      cy.get('button[aria-label*="Close"]').click();
    });
    return this;
  }
}
