<!-- DELETE THIS SECTION AFTER USING TEMPLATE -->

## About this repository

Provides a UI for volunteer and volunteer session management for the Love Kitchen.

Volunteers will check in and out by visiting a tablet in the Love Kitchen building. Volunteers can see their sessions and general statistics related to them. An admin can manually set the passwords for volunteers to sign in by using Auth0. Staff can add notes to users (e.g. "this person is a no-show", "this volunteer is great"), and add, edit, or delete these notes.

<!-- DELETE THIS SECTION AFTER USING TEMPLATE -->

### What's Included

- React/NextJS
- MongoDB/Mongoose
  - `utils/db-connect.ts` contains connection caching functionality for accessing MongoDB.
- Material UI
- Zod
- Jest
- ESLint
- Prettier
- VS Code
  - Recommended extensions
    - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
    - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    - [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
    - [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)
    - [Pretty TS Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
- GitHub
  - [Pull Request template](https://github.com/hack4impact-utk/nextjs-template/blob/main/.github/pull_request_template.md)
- Pre-commit linting hook

# Love Kitchen Volunteer Manager

## Overview

The Love Kitchen is a nonprofit which offers food to the homeless. This volunteer manager allows for digital access of LK's volunteers and sessions.

## Getting Started

### Prerequisites

<!-- Ensure any other prerequisites your project needs are mentioned here. -->

- [Node.js (v18)](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [Visual Studio Code](https://code.visualstudio.com/)

<!-- Add or modify steps here for getting started as a developer -->

### 1. Clone the repository

```bash
git clone https://github.com/hack4impact-utk/[PROJECT NAME].git
```

### 2. Open project in VS Code and accept recommended extensions

### 3. Install dependencies

```bash
pnpm install
```

### 4. Set the environment variables

Either ask a project lead for the `.env.local` file or create your own. The `.env.local` file should be in the root directory of the project. You need to have the following variables set:

<!-- Add any other environment variables your project requires to this table. -->

| Variable Name         | Description                            |
| --------------------- | -------------------------------------- |
| MONGODB_URI           | URL to MONGODB database                |
| AUTH0_SECRET          | Auth0 client-specific secret           |
| AUTH0_BASE_URL        | Base URL of this site                  |
| AUTH0_ISSUER_BASE_URL | Base URL for client-specific Auth0 API |
| AUTH0_CLIENT_ID       | Auth0's client-specific ID             |
| AUTH0_CLIENT_SECRET   | Another Auth0 client-specific secret   |
| QR_KEY                | random 32-character base 64 number     |
| QR_IV                 | random 16-character base 64 number     |

QR_KEY and QR_IV can be created with the following command:

```bash
openssl rand -base64 <number of characters>
```

### 5. (Optional) Populate database

```bash
python src/server/fill/fillDb.py
```

### 6. Run the development server

```bash
pnpm dev
```

## Building for Production

Make sure you have finished all the setup steps in the [Getting Started](#getting-started) section and you can run the development server before building for production.

### 1. Build the project

```bash
pnpm build
```

### 2. Run the project in production mode

```bash
pnpm start
```

## Testing

### Running tests

```bash
pnpm test
```

## Code/PR Workflow

<!-- Add any project specific workflows in here -->

- Create a new branch in the format `[GITHUB USERNAME]/[SHORT FEATURE DESCRIPTION]-[ISSUE NUMBER]`
  - For example: `hack4impact-utk/add-login-page-1`
- Make changes on your branch, ensuring you adhere to our style guide and best practices (add links here when ready)
- Commit your changes and push them to GitHub
- Create a pull request from your branch to `main`
  - Ensure you diligently follow the pull request template

## Project Structure

- `src/app`: Contains pages for the application using the [NextJS App Router](https://nextjs.org/docs/app)
- `src/components`: Contains React components used across the project
  - There should be a folder for each component with an `index.ts` file that exports the component
- `src/server/actions`: Contains functions that interact with the database through the Mongoose ODM
- `src/server/models`: Contains Mongoose models for the database
- `src/services`: Contains functionality for interacting with external data sources (e.g. APIs)
- `src/types`: Contains TypeScript types and interfaces used across the project
- `src/utils`: Contains utility functions used across the project
