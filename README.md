<!-- DELETE THIS SECTION AFTER USING TEMPLATE -->

## About this repository

Provides a UI for volunteer and volunteer session verification for Love's Kitchen.

Volunteers will sign in by scanning their driver's license and can check out by visiting the site. Volunteers should
be able to see their sessions and general statistics related to them. An admin can manually set the passwords for
volunteers to sign in by using Auth0. Admins should also be able to add notes to users or even sessions (e.g. "this
person is a no-show", "this volunteer is great"), and add, edit, or delete them.

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

# Project Title

## Overview

Put an overview of the non-profit you are working with and what you are doing for them here.

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

| Variable Name | Description              |
| ------------- | ------------------------ |
| MONGODB_URI   | URI for MongoDB database |

### 5. Run the development server

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

## Things to fix:

- prevent users from seeing anything on staff or admin page with layout
- clicking on someone in user table shouldn't undo the search filter
- nonstaff shouldn't be able to visit staff/checkin
- show email in user tables? helps with multiple users
- user/register should prevent people from registering an email already in the database
- deleting yourself should automatically log you out, lol
- tell users above the QR code in staff page to scan if it's their first time
- disclaimer legal stuff at bottom of register page
- hour minimum length for sessions
- delete staff/volunteer confirmation

- replace age with emergency contact in volunteer model and registration form

  - display emergency contact in staff page
  - allow for it to be changed by users

- total hours from all or one volunteer in time block (only on admin)

  - kinda like the volunteer search bar, but two fields
  - update the two boxes "Total Hours" and "Avg"

- add tablet role to prevent access to staff page
  - cannot visit user page either

## Completed fixes:

- user page should show name of username-password users, use auth0 email if not found
- stylize the auth0 login page
- have link to staff/checkin and admin somewhere on site
- don't allow for setting password of someone that signed in via google auth
- basic verification for phone number and email in user/register
- basic verification for phone number in user page
