# E2E Test Selector Fixes

Based on actual UI implementation, here are the key findings and fixes needed:

## Key Findings

### 1. Roadmap Creation Flow
- **NO FORM**: Roadmap creation doesn't use a modal or form
- Creates directly with default title "New Roadmap"
- Button: `Create New Roadmap` or `Create Your First Roadmap`
- Immediately navigates to canvas after creation

### 2. Profile Page Structure
- Container class: `.profileContainer`
- Stats are in `.statsGrid` with `.statCard` items
- Each stat has `.statValue` and `.statLabel`

### 3. Error Messages
- Auth errors use `.authError` class
- Not `[role="alert"]`

### 4. Logout Flow
- Redirects to home `/` not `/login`
- Home page is valid for logged-out users

## Files to Fix

1. `commands.ts` - Remove form-based roadmap creation
2. `RoadmapListPage.ts` - Update to click button only
3. `ProfilePage.ts` - Update selectors to match actual classes
4. `profile.cy.ts` - Fix variable reference error
5. `navigation.cy.ts` - Fix logout redirect expectation
6. `auth.cy.ts` - Update error message handling
