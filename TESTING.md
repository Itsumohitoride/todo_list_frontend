# Testing Documentation

## Phase 15: Testing and Validation

This project includes a comprehensive testing setup for Phase 15 of the development plan.

## Test Infrastructure

### Installed Packages
- `jest` - Test runner
- `@testing-library/react-native` - React Native testing utilities
- `jest-expo` - Expo preset for Jest
- `@types/jest` - TypeScript types for Jest

### Configuration Files
- `jest.config.js` - Jest configuration with expo preset
- `jest.setup.js` - Global mocks and setup

### Test Scripts
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test Coverage

### Utility Tests (`src/utils/__tests__/`)
- **responsive.test.ts**: Tests for responsive utilities
  - `getDeviceType()` - Device type detection based on screen width
  - `getResponsiveValue()` - Responsive value selection

- **offlineQueue.test.ts**: Tests for offline queue system
  - `add()` - Adding operations to queue
  - `getAll()` - Retrieving all operations
  - `remove()` - Removing specific operations
  - `clear()` - Clearing entire queue
  - `isEmpty()` - Checking if queue is empty

### Store Tests (`src/store/__tests__/`)
- **authStore.test.ts**: Tests for authentication store
  - Login functionality
  - Registration functionality
  - Logout functionality
  - Error handling
  - State management

### Component Tests (`src/components/`)
- **StatCard.test.tsx**: Tests for statistics card component
  - Rendering with different value types
  - Optional subtitle handling
  - Color application

- **CategoryBadge.test.tsx**: Tests for task category badge
  - Visibility based on task type
  - Correct labels for IMPORTANT and URGENT
  - Color application per type

## Mocked Dependencies

The following modules are mocked in `jest.setup.js`:
- `@react-native-async-storage/async-storage` - Local storage
- `@react-native-community/netinfo` - Network connectivity
- `expo-secure-store` - Secure token storage
- `@expo/vector-icons` - Icon components

## Test Structure

Tests follow the Arrange-Act-Assert pattern:
```typescript
it('should perform expected behavior', () => {
  // Arrange: Setup test data
  const mockData = { /* ... */ };

  // Act: Execute the function
  const result = functionUnderTest(mockData);

  // Assert: Verify the result
  expect(result).toBe(expectedValue);
});
```

## Notes

- Tests are located in `__tests__` directories next to the files they test
- All tests use TypeScript
- Component tests use React Native Testing Library
- Store tests use direct Zustand state manipulation
- Utility tests are pure function tests without dependencies

## Future Enhancements

Potential additions for comprehensive testing:
- Integration tests for complete user flows
- E2E tests with Detox
- Snapshot testing for UI components
- API mocking for integration tests
- Performance testing
