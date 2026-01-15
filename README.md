# AccArenas - Game Account Trading Platform

This project consists of a .NET backend and a Next.js frontend.

## Project Structure

- `backend/AccArenas.Api`: .NET 9 Web API using Controllers and Clean Architecture principles.
- `frontend/web-app`: Next.js 15 App Router project with Tailwind CSS and TypeScript.

## Getting Started

### Backend
1. Navigate to `backend/AccArenas.Api`.
2. Run `dotnet run`.
3. Access Swagger UI at `https://localhost:<port>/swagger/index.html`.

### Frontend
1. Navigate to `frontend/web-app`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Access the app at `http://localhost:3000`.

## Architecture

The backend follows a simplified Clean Architecture:
- `Controllers`: API endpoints.
- `Application`: Business logic and DTOs.
- `Domain`: Core entities and interfaces.
- `Infrastructure`: Database and external services.

The frontend uses Next.js App Router:
- `src/app`: File-based routing.
- `src/components`: UI components.
- `src/services`: API clients.
- `src/types`: TypeScript definitions.
