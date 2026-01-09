# CLAUDE.md - AI Assistant Guide for Bazilisk

This document provides comprehensive guidance for AI assistants working with the Bazilisk repository.

## Table of Contents

- [Repository Overview](#repository-overview)
- [Current State](#current-state)
- [Development Workflow](#development-workflow)
- [Git Operations](#git-operations)
- [Code Conventions](#code-conventions)
- [Development Best Practices](#development-best-practices)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)

## Repository Overview

**Project Name:** Bazilisk
**Repository:** sepbaz/bazilisk
**Initial Commit:** April 1, 2020
**Current Status:** Early stage / skeleton repository

### Purpose

The Bazilisk repository is currently in its initial state. The project's specific purpose and functionality are to be defined as development progresses.

## Current State

As of the latest analysis:

- **Total Files:** 1 tracked file (README.md)
- **Total Commits:** 1 (initial commit)
- **Programming Languages:** Not yet determined
- **Build System:** Not yet configured
- **Test Framework:** Not yet configured
- **CI/CD:** Not yet configured

### Repository Structure

```
bazilisk/
├── .git/           # Git repository metadata
├── README.md       # Basic project readme (10 bytes)
└── CLAUDE.md       # This file - AI assistant guide
```

## Development Workflow

### Branch Strategy

When working on features or fixes, AI assistants should:

1. **Work on designated feature branches** - Branch names typically follow the pattern:
   - `claude/claude-md-<session-id>`
   - Example: `claude/claude-md-mk76gzy5j0o6a335-RB1gv`

2. **Never push directly to main/master** without explicit permission

3. **Create branches locally** if they don't exist yet:
   ```bash
   git checkout -b <branch-name>
   ```

4. **Develop incrementally** with clear, atomic commits

5. **Push changes** when complete:
   ```bash
   git push -u origin <branch-name>
   ```

### Commit Message Guidelines

Follow these conventions for commit messages:

- **Format:** `<type>: <subject>`
- **Types:**
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation changes
  - `refactor:` Code refactoring
  - `test:` Adding or updating tests
  - `chore:` Maintenance tasks
  - `style:` Code style changes (formatting, etc.)

- **Subject:** Clear, concise description (50 characters or less)
- **Body (optional):** Detailed explanation of changes

**Examples:**
```
feat: add user authentication system
fix: resolve null pointer in data processing
docs: update API documentation for v2 endpoints
refactor: simplify configuration loading logic
test: add unit tests for payment module
```

## Git Operations

### Pushing Changes

**CRITICAL:** When using `git push`, always follow these rules:

1. **Use the full push command:**
   ```bash
   git push -u origin <branch-name>
   ```

2. **Branch naming requirement:** Branches must start with `claude/` and end with matching session ID, otherwise push will fail with 403 HTTP code.

3. **Retry logic for network errors:** If push fails due to network errors, retry up to 4 times with exponential backoff:
   - 1st retry: wait 2 seconds
   - 2nd retry: wait 4 seconds
   - 3rd retry: wait 8 seconds
   - 4th retry: wait 16 seconds

### Fetching and Pulling

1. **Prefer fetching specific branches:**
   ```bash
   git fetch origin <branch-name>
   ```

2. **For pulls, use:**
   ```bash
   git pull origin <branch-name>
   ```

3. **Apply same retry logic** as push operations if network failures occur.

### Git Safety Protocol

- **NEVER** update git config
- **NEVER** run destructive/irreversible git commands (like `push --force`, hard reset) unless explicitly requested
- **NEVER** skip hooks (`--no-verify`, `--no-gpg-sign`) unless explicitly requested
- **NEVER** force push to main/master - warn the user if requested
- Avoid `git commit --amend` unless specific conditions are met (see detailed guidelines in development docs)

## Code Conventions

### General Principles

As the codebase develops, follow these principles:

1. **Simplicity over complexity** - Avoid over-engineering
2. **Explicit over implicit** - Clear, readable code
3. **DRY (Don't Repeat Yourself)** - But avoid premature abstraction
4. **YAGNI (You Aren't Gonna Need It)** - Don't add features for hypothetical future requirements
5. **Security first** - Prevent vulnerabilities (SQL injection, XSS, command injection, etc.)

### Code Style

When a programming language is chosen:

- **Follow established language conventions** (PEP 8 for Python, StandardJS for JavaScript, etc.)
- **Use consistent indentation** (spaces or tabs, as determined by project)
- **Meaningful variable and function names** - Self-documenting code
- **Keep functions small and focused** - Single responsibility principle
- **Comments for "why", not "what"** - Code should be self-explanatory

### File Organization

Recommended structure as the project grows:

```
bazilisk/
├── src/              # Source code
│   ├── core/         # Core functionality
│   ├── utils/        # Utility functions
│   └── config/       # Configuration files
├── tests/            # Test files
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   └── fixtures/     # Test fixtures and mock data
├── docs/             # Documentation
│   ├── api/          # API documentation
│   └── guides/       # User guides
├── scripts/          # Build and deployment scripts
├── .github/          # GitHub-specific files
│   └── workflows/    # CI/CD workflows
├── README.md         # Project overview
├── CLAUDE.md         # This file
├── LICENSE           # License information
└── CONTRIBUTING.md   # Contribution guidelines
```

## Development Best Practices

### For AI Assistants

1. **Always read before modifying** - Never propose changes to code you haven't read

2. **Use appropriate tools:**
   - `Read` for reading files
   - `Edit` for modifying existing files
   - `Write` for creating new files
   - `Glob` for finding files by pattern
   - `Grep` for searching code content
   - `Task` tool for complex multi-step operations

3. **Minimize over-engineering:**
   - Only make changes that are directly requested or clearly necessary
   - Don't add extra features, refactoring, or "improvements" beyond what was asked
   - Don't add error handling for scenarios that can't happen
   - Three similar lines of code is better than premature abstraction

4. **Security awareness:**
   - Watch for OWASP Top 10 vulnerabilities
   - Validate at system boundaries (user input, external APIs)
   - Trust internal code and framework guarantees
   - Fix security issues immediately if discovered

5. **Avoid backwards-compatibility hacks:**
   - Don't rename unused variables with underscore prefixes
   - Don't re-export types that are no longer used
   - Don't add `// removed` comments
   - If something is unused, delete it completely

6. **Task management:**
   - Use `TodoWrite` tool to plan and track multi-step tasks
   - Mark todos as completed immediately after finishing
   - Keep exactly ONE task in progress at a time

### Code Review Checklist

Before committing, verify:

- [ ] Code follows project conventions
- [ ] No security vulnerabilities introduced
- [ ] All tests pass (when test suite exists)
- [ ] Documentation updated (if applicable)
- [ ] No unnecessary changes or over-engineering
- [ ] Commit message is clear and follows conventions
- [ ] No debugging code or console.log statements left in
- [ ] No hardcoded secrets or sensitive data

## Project Structure

### When Adding Dependencies

As the project grows and dependencies are added:

1. **Document all dependencies** with their purpose
2. **Pin versions** to ensure reproducibility
3. **Regular security audits** of dependencies
4. **Minimize dependency count** - only add when necessary

### Configuration Management

1. **Environment-specific configs** should use environment variables
2. **Never commit secrets** (.env files should be in .gitignore)
3. **Provide .env.example** with dummy values for reference
4. **Document all configuration options**

## Testing Guidelines

### When Tests Are Added

1. **Write tests for new features** - TDD when appropriate
2. **Maintain existing tests** - Update when code changes
3. **Aim for meaningful coverage** - Not just high percentages
4. **Fast unit tests** - Keep them quick and focused
5. **Integration tests for critical paths**
6. **Test edge cases and error conditions**

### Test Organization

```
tests/
├── unit/           # Fast, isolated tests
├── integration/    # Tests with external dependencies
├── e2e/           # End-to-end tests (if applicable)
└── fixtures/      # Shared test data
```

## Documentation Standards

### Code Documentation

1. **Self-documenting code** is preferred
2. **Add comments** only when logic isn't self-evident
3. **Document public APIs** - Functions, classes, modules
4. **Keep docs in sync** with code changes

### File References

When referencing code, use the pattern: `file_path:line_number`

**Example:**
```
The authentication logic is handled in src/auth/login.js:42
```

### README Maintenance

Keep README.md updated with:
- Project description and purpose
- Installation instructions
- Quick start guide
- Basic usage examples
- Link to detailed documentation
- Contribution guidelines
- License information

## Working with GitHub Issues and PRs

### Creating Pull Requests

When creating PRs:

1. **Analyze all changes** since branch diverged from base
2. **Draft clear PR summary** with:
   - Summary section (1-3 bullet points)
   - Test plan (checklist of testing steps)
3. **Use `gh pr create`** command:
   ```bash
   gh pr create --title "the pr title" --body "$(cat <<'EOF'
   ## Summary
   - Change 1
   - Change 2

   ## Test plan
   - [ ] Test step 1
   - [ ] Test step 2
   EOF
   )"
   ```
4. **Return PR URL** to user

### Commit Before PR

Before creating a PR:

1. Run `git status` to see untracked files
2. Run `git diff` to see changes
3. Check `git log` for commit message style
4. Add relevant files: `git add <files>`
5. Commit with descriptive message
6. Push to remote branch
7. Create PR

## Additional Resources

### Tool Usage

- **Task tool** - Use for complex multi-step operations and codebase exploration
- **Parallel execution** - Call multiple independent tools in one message
- **Sequential execution** - Use `&&` for dependent commands
- Avoid bash commands for file operations - use dedicated tools instead

### Communication

- **Output text directly** to communicate with user
- **Never use echo/printf** for communication
- **Include sources** when using web search
- **Be concise** - CLI output should be clear and brief

## Version History

- **2026-01-09:** Initial CLAUDE.md created with comprehensive guidelines for AI assistants
- Repository analyzed and documented in early skeleton stage

---

**Note:** This document should be updated as the project evolves and conventions are established. AI assistants should review this file before making significant changes to the codebase.
