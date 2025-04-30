# Code Standards

This project follows Microsoft's best practices for TypeScript development and uses Prettier for code formatting. Below are the key standards and guidelines to follow when contributing to this project.

## General Guidelines

- **TypeScript First**: Always use TypeScript for new files and features. Avoid using `any` unless absolutely necessary.
- **Strict Typing**: Enable strict mode in `tsconfig.json` and ensure all code adheres to strict typing rules.
- **Modular Design**: Keep code modular and reusable. Avoid large, monolithic functions or classes.
- **Documentation**: Use JSDoc comments to document functions, classes, and interfaces.
- **Error Handling**: Use the provided `handleError` utility for consistent error handling.

## Code Formatting

### Prettier Rules

This project uses Prettier for consistent code formatting. The `.prettierrc` file defines the following rules:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 120,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "quoteProps": "consistent",
  "jsxSingleQuote": true,
  "objectWrap": "preserve",
  "bracketSameLine": false,
  "proseWrap": "always",
  "singleAttributePerLine": true,
  "htmlWhitespaceSensitivity": "css"
}
```

Run Prettier before committing code:

```bash
npx prettier --write .
```

## Naming Conventions

- **Files**: Use `camelCase` for file names (e.g., `makeRequest.ts`).
- **Variables**: Use `camelCase` for variables and functions.
- **Classes**: Use `PascalCase` for class names.
- **Constants**: Use `UPPER_CASE` for constants.

## Folder Structure

- **`src/config`**: Configuration files and types.
- **`src/constants`**: Constants such as API endpoints.
- **`src/entities`**: Entity definitions and schemas.
- **`src/tests`**: Test files for the project.
- **`src/utils`**: Utility functions for logging, error handling, and HTTP requests.

## Testing

- Write unit tests for all new features and bug fixes.
- Place test files in the `src/tests` folder.
- Use descriptive names for test cases.

Run tests using:

```bash
npm test
```

## Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (e.g., updating dependencies)

## Additional Resources

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [Microsoft TypeScript Guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
