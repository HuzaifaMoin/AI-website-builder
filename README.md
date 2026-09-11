# AI Website Builder

AI Website Builder is a full-stack application that turns a natural-language description into an editable React website. Users can create an account, generate projects with an AI agent, inspect and edit generated files, request revisions through chat, preview the result, and publish a project at a public URL.

## Features

- Email and password registration and login
- HTTP-only cookie sessions backed by JSON Web Tokens
- AI-assisted website planning and code generation
- Progressive generation status with planned, generated, and active file details
- In-browser file explorer and code editing
- Debounced automatic saving of manual file changes
- AI-powered project revisions through chat prompts
- Sandpack-based project preview
- Project deletion and version tracking
- Public project publishing and read-only public previews
- Project export utilities in the client

## Technology Stack

### Client

- React 19
- Vite
- React Router
- Tailwind CSS with the Vite plugin
- Sandpack for previews
- Axios for API requests
- Lucide React for icons
- React Hot Toast for notifications
- Oxlint

### Server

- Node.js with ECMAScript modules
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens stored in HTTP-only cookies
- bcrypt for password hashing
- OpenRouter through the Vercel AI SDK
- Zod schemas for structured AI responses
- p-map for concurrent file generation
- Vercel serverless deployment configuration

## Repository Structure

```text
.
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/                 Axios API client
│   │   ├── assets/              Client assets
│   │   ├── components/          Builder, preview, auth, and publishing UI
│   │   ├── context/             Shared authentication and project state
│   │   ├── pages/               Application routes and layouts
│   │   └── utils/               Export and Sandpack helpers
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── server/
│   ├── api/                     Vercel API entry point
│   ├── config/                  Database connection
│   ├── controllers/             Auth, project, and chat handlers
│   ├── middleware/              Authentication middleware
│   ├── models/                  User and project schemas
│   ├── routes/                  Express route definitions
│   ├── services/                AI generation, validation, prompts, and diffs
│   ├── tests/                   Server tests
│   ├── app.js                   Express application
│   ├── server.js                Local server entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database, local or hosted
- An OpenRouter API key with access to the configured model

## Installation

Install dependencies separately for the two applications:

```bash
cd server
npm install

cd ../client
npm install
```

The repository does not currently define a root-level npm workspace, so commands must be run from `client/` or `server/`.

## Environment Variables

Create `server/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-website-builder
JWT_SECRET=replace-with-a-long-random-secret
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=openrouter/free
AI_MAX_CONCURRENCY=6
ORIGINS=http://localhost:5173
NODE_ENV=development
```

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000
```

### Server variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string. The server exits if this is missing or the connection fails. |
| `OPENROUTER_API_KEY` | Yes for AI generation | API key used by the OpenRouter client. |
| `JWT_SECRET` | Recommended | Secret used to sign and verify session tokens. The code has a development fallback, but production deployments should always set this. |
| `PORT` | No | Local HTTP port. Defaults to `3000`. |
| `ORIGINS` | No | Comma-separated allowed client origins. Defaults to localhost and the deployed client URL. |
| `OPENROUTER_MODEL` | No | OpenRouter model identifier. Defaults to `openrouter/free`. |
| `AI_MAX_CONCURRENCY` | No | Maximum number of files generated concurrently. Defaults to `6`. |
| `NODE_ENV` | No | Set to `production` for secure cookies in production. |

### Client variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_BASE_URL` | No | API base URL. Defaults to `http://localhost:3000`. |

Do not commit `.env` files or expose server secrets through `VITE_` variables.

## Running Locally

Start the API in one terminal:

```bash
cd server
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm run dev
```

Open the Vite URL shown in the client terminal, normally:

```text
http://localhost:5173
```

The API is normally available at `http://localhost:3000`. The API root returns `Server is Live!`, and `/db-test` checks the MongoDB connection.

For a production-style local run:

```bash
cd client
npm run build
npm run preview

cd ../server
npm start
```

## Client Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Guest | Sign in |
| `/register` | Guest | Create an account |
| `/` | Authenticated | View and manage projects |
| `/builder/:id` | Authenticated | Generate, inspect, edit, and revise a project |
| `/preview/:id` | Authenticated | Preview an owned project |
| `/publish/:id` | Public | View a published project |

Unknown routes redirect to `/`.

## API Reference

All API routes are served from the server base URL. Authenticated requests use the HTTP-only `token` cookie; the client sends cookies with `withCredentials: true`.

### Health

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/` | No | Returns the server health message. |
| `GET` | `/db-test` | No | Connects to MongoDB and reports the result. |

### Authentication

| Method | Endpoint | Body | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | `{ name, email, password }` | Creates a user and starts a session. |
| `POST` | `/api/auth/login` | `{ email, password }` | Authenticates a user and starts a session. |
| `POST` | `/api/auth/logout` | None | Clears the session cookie. |
| `GET` | `/api/auth/me` | None | Returns the current authenticated user. |

### Projects

| Method | Endpoint | Body | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/projects` | `{ prompt }` | Yes | Creates a pending project and starts background AI generation. |
| `GET` | `/api/projects` | None | Yes | Lists the authenticated user's project summaries. |
| `GET` | `/api/projects/:id` | None | Yes | Returns full project details and file contents. |
| `DELETE` | `/api/projects/:id` | None | Yes | Deletes an owned project. |
| `PUT` | `/api/projects/:id/files` | `{ files }` | Yes | Replaces the project's file map and saves content hashes. |
| `POST` | `/api/projects/:id/chat` | `{ prompt }` | Yes | Generates and applies AI revision operations. |
| `POST` | `/api/projects/:id/publish` | None | Yes | Marks an owned project as published. |
| `GET` | `/api/projects/public/:id` | None | No | Returns files for a published project. |

## Generation Flow

1. The client submits a prompt to `POST /api/projects`.
2. The server immediately creates a project with `pending` status and returns its ID.
3. A background task asks the AI model to plan the project file structure.
4. Files are generated concurrently, normalized, validated, and stored as they complete.
5. The client polls the project endpoint while the status is `pending`, `generating`, or `revising`.
6. The builder displays progress, generated files, messages, and the current file.
7. Once generation completes, the project is marked `completed` and starts at version `1`.

The generation service ensures `/App.js` and `/styles.css` are included in the plan. Failed files receive retry attempts, and unrecoverable file failures are represented with placeholders where possible.

## Revision and Saving Flow

- Manual editor changes are sent to `PUT /api/projects/:id/files` after a one-second debounce.
- Each saved file receives an MD5 content hash for manifest and diff operations.
- Chat revisions send the project manifest, file contents, and recent messages to the AI service.
- The resulting operations are applied to the stored files, the project version increments, and the updated project is returned.

## Deployment

### Client on Vercel

1. Create a Vercel project pointing to the `client/` directory.
2. Use `npm install` for installation and `npm run build` for the build command.
3. Set `VITE_BASE_URL` to the deployed server URL.
4. Add the deployed client URL to the server's `ORIGINS` value.

### Server on Vercel

The `server/vercel.json` file configures `server.js` as a Vercel Node function. Deploy the `server/` directory as the server project and configure these environment variables in Vercel:

- `MONGODB_URI`
- `JWT_SECRET`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` if overriding the default
- `AI_MAX_CONCURRENCY` if overriding the default
- `ORIGINS`
- `NODE_ENV=production`

Because authentication uses cookies, the client and server must be configured for credentialed CORS, and the production client origin must be listed exactly in `ORIGINS`.

## Available Scripts

### Client scripts

Run from `client/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the client for production. |
| `npm run preview` | Serves the production build locally. |
| `npm run lint` | Runs Oxlint. |

### Server scripts

Run from `server/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the server with Nodemon. |
| `npm start` | Starts the server with Node.js. |

## Testing

The server currently contains tests for content normalization:

```bash
cd server
npx jest
```

The server package does not currently declare a Jest script or Jest dependency. Install and configure the test runner before relying on this command in a clean environment.

## Troubleshooting

### The server exits during startup

Check that `MONGODB_URI` is set and that MongoDB is reachable. The local server connects to MongoDB before it begins listening.

### The browser cannot call the API

Check `VITE_BASE_URL`, the server's `ORIGINS` list, and that the browser is sending credentials. Restart Vite after changing client environment variables.

### AI generation fails

Confirm `OPENROUTER_API_KEY` is valid, the selected model is available, and the server has outbound network access. Review server logs for validation, retry, or provider errors.

### Published projects are inaccessible

Publishing requires an authenticated owner request. Public viewing requires the project to have `published: true` and uses `/publish/:id` in the client.

## Security Notes

- Keep `JWT_SECRET`, `MONGODB_URI`, and `OPENROUTER_API_KEY` private.
- Use a strong, unique `JWT_SECRET` in production; do not rely on the fallback secret.
- Restrict `ORIGINS` to known frontend origins.
- Use HTTPS in production so secure cookies and credentialed requests are protected in transit.
- Validate and limit user-provided prompts and generated code before exposing the application publicly.

##Live Demo
https://ai-website-builder-z4os.vercel.app/