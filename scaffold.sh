#!/bin/bash
set -e

mkdir -p apps packages examples docs .github/workflows .changeset .husky

# Root package.json
cat << 'PKG' > package.json
{
  "name": "promptforge-monorepo",
  "private": true,
  "engines": {
    "node": ">=18"
  },
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@types/node": "^20.12.7",
    "@typescript-eslint/eslint-plugin": "^7.8.0",
    "@typescript-eslint/parser": "^7.8.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.2",
    "prettier": "^3.2.5",
    "turbo": "^1.13.2",
    "typescript": "^5.4.5"
  }
}
PKG

# pnpm-workspace.yaml
cat << 'PNPM' > pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "examples/*"
  - "docs"
PNPM

# turbo.json
cat << 'TURBO' > turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
TURBO

# tsconfig.json (Root)
cat << 'TSCONFIG_ROOT' > tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/analyzer" },
    { "path": "./packages/optimizer" },
    { "path": "./packages/templates" },
    { "path": "./packages/react" },
    { "path": "./packages/cli" },
    { "path": "./packages/registry" },
    { "path": "./packages/schema" },
    { "path": "./packages/vscode" }
  ]
}
TSCONFIG_ROOT

# tsconfig.base.json
cat << 'TSCONFIG_BASE' > tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "isolatedModules": true
  }
}
TSCONFIG_BASE

# .prettierrc
cat << 'PRETTIER' > .prettierrc
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "tabWidth": 2
}
PRETTIER

# .prettierignore
cat << 'PRETTIER_IGNORE' > .prettierignore
node_modules
dist
.turbo
coverage
PRETTIER_IGNORE

# .eslintrc.js
cat << 'ESLINT' > .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', 'node_modules', '.turbo', '*.js'],
  env: {
    node: true,
    browser: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
ESLINT

# lint-staged
cat << 'LINT_STAGED' > .lintstagedrc.json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
LINT_STAGED

# Changesets config
cat << 'CHANGESET' > .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
CHANGESET

# GitHub Actions
cat << 'CI' > .github/workflows/ci.yml
name: CI

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v3
        with:
          version: 9
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Lint
        run: pnpm run lint
        
      - name: Typecheck
        run: pnpm run typecheck
        
      - name: Build
        run: pnpm run build
        
      - name: Test
        run: pnpm run test
CI

# Create Packages
PACKAGES=("core" "analyzer" "optimizer" "templates" "react" "cli" "registry" "schema" "vscode")

for PKG in "${PACKAGES[@]}"; do
  DIR="packages/$PKG"
  mkdir -p "$DIR/src" "$DIR/tests"
  
  cat << PKG_JSON > "$DIR/package.json"
{
  "name": "@promptforge/$PKG",
  "version": "0.1.0",
  "description": "PromptForge $PKG package",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint src/ --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "tsup": "^8.0.2",
    "vitest": "^1.6.0",
    "typescript": "^5.4.5"
  }
}
PKG_JSON

  cat << TSCONFIG > "$DIR/tsconfig.json"
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
TSCONFIG

  cat << TSUP > "$DIR/tsup.config.ts"
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
TSUP

  cat << VITEST > "$DIR/vitest.config.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
VITEST

  cat << INDEX > "$DIR/src/index.ts"
export const hello = () => 'Hello from @promptforge/$PKG';
INDEX

  cat << TEST > "$DIR/tests/index.test.ts"
import { describe, it, expect } from 'vitest';
import { hello } from '../src/index';

describe('@promptforge/$PKG', () => {
  it('should say hello', () => {
    expect(hello()).toBe('Hello from @promptforge/$PKG');
  });
});
TEST

  cat << README > "$DIR/README.md"
# @promptforge/$PKG

The $PKG package for PromptForge.
README
done

# Initialize git if not already (it is already)
# set up husky hook
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

