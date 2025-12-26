# Roadmap Builder E2E Tests

End-to-end tests for the Roadmap Builder application using Cypress.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your local configuration if needed.

## Running Tests

### Interactive Mode (Recommended for Development)
```bash
npm run test:open
```

This opens the Cypress Test Runner where you can:
- Select and run individual tests
- See tests execute in real-time
- Debug failures easily
- Use time-travel debugging

### Headless Mode (CI/CD)
```bash
npm test
```

### Specific Browser
```bash
npm run test:chrome
npm run test:firefox
```

### Headed Mode (See Browser)
```bash
npm run test:headed
```

## Test Structure

```
e2e/
├── cypress/
│   ├── e2e/                    # Test suites
│   │   ├── auth.cy.ts          # Authentication tests
│   │   ├── roadmap-crud.cy.ts  # Roadmap CRUD tests
│   │   ├── roadmap-canvas.cy.ts # Canvas operations tests
│   │   ├── profile.cy.ts       # Profile and stats tests
│   │   └── navigation.cy.ts    # Navigation tests
│   ├── fixtures/               # Test data
│   │   ├── user.json
│   │   └── roadmap.json
│   └── support/
│       ├── commands.ts         # Custom commands
│       └── e2e.ts             # Global config
├── src/
│   └── pages/                  # Page objects
│       ├── LoginPage.ts
│       ├── SignupPage.ts
│       ├── RoadmapListPage.ts
│       ├── CanvasPage.ts
│       └── ProfilePage.ts
└── cypress.config.ts           # Cypress configuration
```

## Writing Tests

### Using Page Objects

```typescript
import { LoginPage } from '../../src/pages/LoginPage';

describe('My Test', () => {
  const loginPage = new LoginPage();

  it('should login', () => {
    loginPage
      .visit()
      .login('test@example.com', 'password')
      .verifyRedirectToRoadmaps();
  });
});
```

### Using Custom Commands

```typescript
// Login command
cy.login('test@example.com', 'password', true);

// Create roadmap command
cy.createRoadmap('My Roadmap', 'Description');

// Logout command
cy.logout();
```

### Using Fixtures

```typescript
cy.fixture('user').then((users) => {
  cy.login(users.validUser.email, users.validUser.password);
});
```

## Test Coverage

- ✅ Authentication (signup, login, logout, redirects)
- ✅ Roadmap CRUD operations
- ✅ Canvas operations (title editing, node management)
- ✅ Node hover toolbar (edit, view, duplicate, delete)
- ✅ Auto-save functionality
- ✅ Profile stats display
- ✅ Navigation and routing

## Debugging

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`

### Debug Mode

```bash
npm run test:debug
```

### Browser DevTools

When running in headed mode, you can:
- Open browser DevTools
- Set breakpoints in test code
- Inspect application state

## Best Practices

1. **Use Page Objects**: Keep selectors and actions in page objects
2. **Use Custom Commands**: Reuse common workflows
3. **Use Fixtures**: Manage test data centrally
4. **Clear State**: Use `beforeEach` to reset state
5. **Wait Properly**: Use Cypress's built-in retry logic
6. **Descriptive Tests**: Write clear test descriptions

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
```

## Troubleshooting

### Tests Failing Locally

1. Ensure frontend is running on `http://localhost:5173`
2. Ensure backend is running on `http://localhost:3000`
3. Check test database is configured
4. Clear browser cache and cookies

### Flaky Tests

- Increase timeout in `cypress.config.ts`
- Add explicit waits for async operations
- Use `cy.intercept()` to stub network requests

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)
