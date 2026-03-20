# Lead Manager

A small full-stack lead management app built to satisfy the assessment requirements.

## Stack

- Frontend: Next.js 15
- Backend: Node.js, Express
- Database: MongoDB with Mongoose

## Features

- `POST /leads` to create a lead
- `GET /leads` to fetch all leads
- Lead fields:
  - `name` (required)
  - `email` (required, unique)
  - `status` (`New`, `Engaged`, `Proposal Sent`, `Closed-Won`, `Closed-Lost`)
  - `createdAt` (auto-generated timestamp)
- Next.js UI to list leads and add new ones

## Project Structure

```text
.
|-- backend
|   |-- package.json
|   |-- .env.example
|   `-- src
|       |-- index.js
|       |-- config
|       |   `-- db.js
|       |-- models
|       |   `-- Lead.js
|       `-- routes
|           `-- leads.js
|-- frontend
|   |-- package.json
|   |-- .env.local.example
|   `-- app
|       |-- globals.css
|       |-- layout.js
|       `-- page.js
`-- package.json
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create these files from the examples:

- `backend/.env`
- `frontend/.env.local`

Backend example:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/lead-manager
CLIENT_ORIGIN=http://localhost:3000
```

Frontend example:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Start the app

```bash
npm run dev
```

This runs:

- Backend on `http://localhost:4000`
- Frontend on `http://localhost:3000`

## API Endpoints

### Create a lead

```http
POST /leads
Content-Type: application/json

{
  "name": "Dorkas",
  "email": "odswei@gmail.com",
  "status": "New"
}
```

### Fetch all leads

```http
GET /leads
```

## Notes

- Duplicate emails return a `409 Conflict`
- Leads are returned newest first
- The frontend reads the backend URL from `NEXT_PUBLIC_API_URL`
- Technical SEO routes are included:
  - `/robots.txt`
  - `/sitemap.xml`
- Set `NEXT_PUBLIC_SITE_URL` to your deployed frontend URL for canonical, sitemap, and metadata consistency
