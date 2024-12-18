# Ride Rent - Nextjs Platform

## Description

The Ride Rent Client (Next.Js) Platform is a web application designed to allow agents to manage vehicle listings, view portfolio statistics, and handle inquiries on the Ride Rent platform. The application is built using modern web technologies including:

- **NextJs**: A React framework to build SSR web products.
- **TypeScript**: A typed superset of JavaScript that adds static types.
- **Shadcn UI**: A set of accessible and customizable UI components.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Hook Form**: A library for handling form state and validation.
- **React Query**: A library for handling api interaction and caching.
- **Zod**: A TypeScript-first schema declaration and validation library.

## Installation

1. **Clone the repository:**

2. **Navigate to the project directory:**

   ```
   cd ride_rent_client
   ```

3. **Install the dependencies:**
   ```
   pnpm install
   ```

## Running the Project locally

To run the project locally, use the following command:

```bash
pnpm run dev
```

## Building the Project in Development

To build the project, use the following command:

```bash
pnpm run build:dev
```

## Building the Project in Production

To build the project, use the following command:

```bash
pnpm run build:dev
```

## Run the build version

To run/preview the build version, use the following command:

```bash
pnpm run start
```

## Redirection Logic

This project includes custom redirection logic implemented in both the `next.config.js` file and specific components.

1. **Global Redirection in `next.config.js`:**

   - The redirection logic in the `next.config.mjs` file handles the redirection from "ride.rent" to "ride.rent/${state}/${category}.
   - Example of use case:
   - "ride.rent" -> "ride.rent/dubai/cars".
   - "ride.rent/dubai" -> "ride.rent/dubai/cars".
   - "ride.rent/abu-dhabi" -> "ride.rent/abu-dhabi/cars".
   - "ride.rent/abu-dhabi/yachts" -> "ride.rent/abu-dhabi/yachts".

2. **Component-Specific Redirection:**
   - In the Navbar.tsx, the two dropdown components StatesDropdown.tsx and CategoryDropdown.tsx handles the "404 not found" redirection if the current state/category is invalid.

If any changes to redirection behavior are needed, be sure to update both the configuration file and any affected components.
