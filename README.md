# Trello Clone - Nuxt 3 Application

![image](public/images/screenshot.jpeg)

This project is a **fullstack Trello-like clone** built with **Nuxt 3**. It offers features for managing tasks with drag-and-drop functionality, authentication, and a modern UI. The app uses **MongoDB** as its database and **Mongoose** as its ORM. Authentication is handled via **Sidebase/nuxt-auth**, and it integrates modern libraries and tools like **NuxtUI**, **TailwindCSS**, and more.

## Features

- **Fullstack Application** built with **Nuxt 3**
- Modern **UI components** from **NuxtUI**
- **TailwindCSS** for responsive design
- **MongoDB** as the database with **Mongoose ORM**
- **Sidebase/nuxt-auth** for authentication
- Drag-and-drop functionality using **vuedraggable**
- Secure password management with **bcryptjs**
- Server-side rendering and static site generation
- Stripe integration for subscription management
- ESLint integration for code linting

## Tech Stack

- ![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=flat-square&logo=nuxt.js&logoColor=white) **Nuxt 3**: Framework for building Vue.js applications
- ![NuxtUI](https://img.shields.io/badge/NuxtUI-35495E?style=flat-square&logo=vue.js&logoColor=white) **NuxtUI**: A modern UI library for Nuxt
- ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **TailwindCSS**: Utility-first CSS framework
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) **MongoDB**: NoSQL database
- ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white) **Mongoose ORM**: Object Data Modeling (ODM) for MongoDB
- ![Auth](https://img.shields.io/badge/Auth-SidebaseAuth-000?style=flat-square&logo=auth0&logoColor=white) **Sidebase/nuxt-auth**: Authentication management
- ![vuedraggable](https://img.shields.io/badge/Drag%20%26%20Drop-vuedraggable-4FC08D?style=flat-square&logo=vue.js&logoColor=white) **vuedraggable**: Drag-and-drop feature
- ![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=flat-square&logo=stripe&logoColor=white) **Stripe**: Payment gateway for subscription services
- ![TypeScript](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white) **Typescript**: Type safety for better development experience
- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) **ESLint**: Linting tool for maintaining code quality

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
Create a .env file and add your environment variables (for example, MongoDB URI, Stripe keys, etc.).
```bash
MONGODB_URI=
AUTH_SECRET=
AUTH_ORIGIN=
PIXABAY_API_KEY=

STRIPE_PRICE_ID=
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

3. Run the development server:
```bash
pnpm run dev
```
