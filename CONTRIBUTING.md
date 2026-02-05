# Contributing to Matterbridge Gardena Plugin

Thank you for your interest in contributing to the Matterbridge Gardena Smart System Plugin! This guide explains how to set up your development environment and contribute.

## Code of Conduct

Be respectful and professional. We welcome contributions from developers of all skill levels.

## Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/matterbridge-gardena-smart-system.git
cd matterbridge-gardena-smart-system
```

### 2. Install Dependencies

```bash
npm install
# Link Matterbridge for development
npm link --no-fund --no-audit matterbridge
```

### 3. Development Setup

```bash
# Watch TypeScript compilation
npm run watch

# In another terminal, run tests in watch mode
npm run test:watch
```

## Development Workflow

### Making Changes

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**:
   - Edit files in `src/` directory
   - Write/update tests in `test/` directory

3. **Verify your changes**:

   ```bash
   npm run build
   npm run lint:fix
   npm run format
   npm test
   ```

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "Add my feature"
   ```

5. **Push and create pull request**:
   ```bash
   git push origin feature/my-feature
   ```

### Code Quality Standards

All contributions must:

- ✅ Pass ESLint check: `npm run lint`
- ✅ Pass Prettier format: `npm run format:check`
- ✅ Pass all tests: `npm test`
- ✅ Have TypeScript strict mode compliance
- ✅ Include JSDoc comments for public APIs
- ✅ Have unit tests for new functionality

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with verbose output
npm run test:verbose

# Generate coverage report
npm run test:coverage
```

## File Modifications Guide

### Adding a New Device Type

1. **Update `GardenaDevice` interface** in `src/module.ts`:

   ```typescript
   interface GardenaDevice {
     // Add new device type
     category: 'new-type'; // Add to union
   }
   ```

2. **Add mock device** in `GardenaAPI.fetchDevices()`:

   ```typescript
   {
     id: 'new-device-1',
     name: 'New Device',
     type: 'NEW_DEVICE_TYPE',
     category: 'new-type',
     value: 0,
     connected: true,
   }
   ```

3. **Add device registration logic** in `registerGardenaDevice()`:

   ```typescript
   case 'new-type':
     endpoint = new MatterbridgeEndpoint(...)
       // Configure endpoint
     break;
   ```

4. **Add tests** in `test/module.test.ts`:
   ```typescript
   it('should handle new device type', async () => {
     // Test implementation
   });
   ```

### Adding a New Command

1. **Add handler in `registerGardenaDevice()`**:

   ```typescript
   .addCommandHandler('newCommand', async (_data) => {
     this.log.info(`Executing newCommand on ${device.name}`);
     if (this.gardenaAPI) {
       await this.gardenaAPI.controlDevice(device.id, 'newCommand');
     }
   })
   ```

2. **Add test**:
   ```typescript
   it('should execute new command', async () => {
     // Test implementation
   });
   ```

## Testing Guidelines

### Test Structure

```typescript
it('should do something specific', async () => {
  // Arrange: Set up test conditions
  jest.clearAllMocks();

  // Act: Perform the action
  const result = await functionUnderTest();

  // Assert: Verify the result
  expect(result).toBe(expectedValue);
  expect(mockLog.info).toHaveBeenCalledWith(expectedMessage);
});
```

### Test Best Practices

1. **Use descriptive test names**: "should X when Y occurs"
2. **Test both success and failure paths**
3. **Mock external dependencies**: API calls, network requests
4. **Include error cases**: Missing configs, invalid data
5. **Verify logging**: Check that proper messages are logged
6. **Test state changes**: Verify device state updates

### Coverage Requirements

- Minimum 80% code coverage
- All public methods must have tests
- All error paths must be tested
- All device types must have tests

## Coding Standards

### TypeScript

- Use strict type checking (no `any`)
- Add type annotations for function parameters
- Use interfaces for data structures
- Document complex logic with comments

### Naming Conventions

```typescript
// Classes: PascalCase
class GardenaAPI { }

// Functions/methods: camelCase
async controlDevice() { }

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = '...';

// Private members: _camelCase prefix
private _apiKey: string;
```

### Comments & Documentation

```typescript
/**
 * Brief description of what this does
 *
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 */
public methodName(paramName: Type): Type { }
```

### Error Handling

```typescript
try {
  // Operation
} catch (error) {
  this.log.error(`Detailed error context: ${error}`);
  // Graceful fallback
}
```

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages

```
[Type] Brief description

Detailed explanation of changes if needed.

References: #123 (if applicable)
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactor

## Testing
- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] New tests added
- [ ] 80%+ coverage maintained

## Checklist
- [ ] Code follows standards
- [ ] JSDoc comments added
- [ ] README updated (if needed)
- [ ] CHANGELOG updated
- [ ] No breaking changes
```

## Building and Publishing

### Build Process

```bash
# Development build
npm run build

# Production build
npm run buildProduction

# Clean build
npm run cleanBuild
```

### Pre-commit Checks

These run automatically before publishing:

```bash
npm run lint           # ESLint check
npm run format:check   # Prettier check
npm run test:coverage  # 80% coverage requirement
```

## Common Development Tasks

### Adding a New Feature

1. Create feature branch
2. Write failing test
3. Implement feature
4. Verify test passes
5. Update documentation
6. Submit pull request

### Fixing a Bug

1. Create bugfix branch
2. Add test that reproduces bug
3. Fix the bug
4. Verify test passes
5. Update CHANGELOG
6. Submit pull request

### Updating Dependencies

```bash
npm run updateDependencies
npm run test
npm run lint
```

## Debugging

### Enable Debug Logging

```json
{
  "platform": "matterbridge-gardena-smart-system",
  "debug": true
}
```

### Use VS Code Debugger

1. Add breakpoints in `src/module.ts`
2. Run: `npm run watch`
3. Attach debugger in VS Code

### Log Device State

```typescript
console.log('Current devices:', this.gardenaAPI?.getAllDevices());
```

## Performance Optimization

- Minimize API calls (cache when possible)
- Use WebSocket for real-time updates
- Batch device operations
- Profile memory usage

## Security Considerations

- Never log sensitive data (API keys, passwords)
- Validate all inputs
- Use secure protocols (WSS, HTTPS only)
- Follow principle of least privilege

## Documentation Updates

When updating code, also update:

1. **JSDoc comments**: In the code
2. **README.md**: If public API changes
3. **ARCHITECTURE.md**: If architecture changes
4. **CHANGELOG.md**: All significant changes
5. **Tests**: Test documentation

## Asking for Help

- **GitHub Issues**: Report bugs
- **GitHub Discussions**: Ask questions
- **Pull Request Reviews**: Get feedback on code

## Release Process

Releases are managed by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Publish to NPM
5. Create GitHub release

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Matterbridge Documentation](https://github.com/Luligu/matterbridge)
- [Jest Testing Guide](https://jestjs.io/docs/getting-started)
- [ESLint Rules](https://eslint.org/docs/rules/)

## FAQ

**Q: How do I run a specific test?**

```bash
npm test -- --testNamePattern="device discovery"
```

**Q: How do I update the schema?**
Edit `gardena.schema.json` and update validation in configuration handling.

**Q: Can I add dependencies?**
Discuss in GitHub issue first. Minimize external dependencies.

**Q: How long until my PR is reviewed?**
Typically 1-2 weeks. Thank you for your patience!

## Thank You!

Your contributions help make this plugin better for everyone. Thank you for contributing! 🎉

---

**Happy coding!** If you have questions, please open a GitHub issue or discussion.
