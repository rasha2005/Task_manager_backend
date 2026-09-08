
## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

## Installation


Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
FRONTEND_URL=http://localhost:5173
```

## Database

This project uses MongoDB Atlas.

Add your MongoDB Atlas connection string to `MONGO_URI` in the `.env` file.

## Seed Data

A `seed.js` file is included to create the initial demo data required for testing.

Run:

```bash
npm run seed
```

The seed creates the required organizations, users, and tasks.

**Note:** The seed script clears existing data before creating the demo data, so use it only when you want to reset the database.

The demo login credentials can be found in the `seed.js` file.

## Running the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend runs on:

```text
http://localhost:4000
```

API base URL:

```text
http://localhost:4000/api
```

## API Routes

### Authentication

```text
POST /api/auth/login
GET  /api/auth/me
```

### Users

```text
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Tasks

```text
GET    /api/tasks
GET    /api/tasks/my-tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/status
```

### Dashboard

```text
GET /api/dashboard
```

## Authentication & Authorization

The API uses JWT authentication.

Protected requests require:

```text
Authorization: Bearer <token>
```

The backend also enforces role-based access control for Admin, Manager, and Employee roles.

## Multi-Tenant Security

Each user and task belongs to an organization.

The backend ensures that users can only access resources belonging to their own organization.

Tenant isolation and role-based authorization are enforced on the backend and cannot be bypassed through frontend requests.

## Project Structure

```text
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── .env
├── seed.js
├── server.js
├── package.json
└── README.md
```

## Available Scripts

```bash
npm run dev
```

Runs the server in development mode.

```bash
npm start
```

Starts the server.

```bash
npm run seed
```

Seeds the database with demo data.
