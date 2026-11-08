# Notes API

A REST API for notes, built with Node.js, Express and MongoDB (Mongoose).

## How to run

1. Install Node.js 20 or later.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to a new file named `.env` and put your MongoDB connection string in it:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/notes
   PORT=3000
   ```
   A local MongoDB works too: `MONGODB_URI=mongodb://127.0.0.1:27017/notes`
4. Start the server:
   ```bash
   npm run dev
   ```
   The terminal prints `connected to MongoDB`. The API is now running at `http://localhost:3000`.

## The Note resource

| Field | Type | Rules |
|---|---|---|
| `title` | String | required, max 120 characters |
| `body` | String | optional, defaults to `""` |
| `tags` | Array of Strings | optional, defaults to `[]` |
| `_id`, `createdAt`, `updatedAt` | | set by the server |

## Routes

| Method | Path | What it does | Success | Errors |
|---|---|---|---|---|
| GET | `/api/notes` | List all notes | 200 | 500 |
| GET | `/api/notes/:id` | Get one note | 200 | 400, 404 |
| POST | `/api/notes` | Create a note | 201 | 400 |
| PUT | `/api/notes/:id` | Update a note | 200 | 400, 404 |
| DELETE | `/api/notes/:id` | Delete a note | 204 | 400, 404 |

Every error is returned as JSON: `{ "error": "message" }`

- **400** – the id is not a valid id, the title is missing/too long, or the JSON is malformed
- **404** – no note has that id (or the route doesn't exist)
- **500** – something went wrong on the server, e.g. the database is down

In the examples below, replace the id with one from your own database (copy it from the list or from the create response).

---

### GET /api/notes – list all notes

```bash
curl http://localhost:3000/api/notes
```

Response `200 OK`:
```json
[
  {
    "_id": "6aef6d8f6065ef98e47b7d7c",
    "title": "Exam topics",
    "body": "Hooks, Express, REST",
    "tags": ["exam", "week9"],
    "createdAt": "2026-11-07T18:27:27.494Z",
    "updatedAt": "2026-11-07T18:27:27.494Z",
    "__v": 0
  }
]
```

### GET /api/notes/:id – get one note

```bash
curl http://localhost:3000/api/notes/6aef6d8f6065ef98e47b7d7c
```

Response `200 OK`:
```json
{
  "_id": "6aef6d8f6065ef98e47b7d7c",
  "title": "Exam topics",
  "body": "Hooks, Express, REST",
  "tags": ["exam", "week9"],
  "createdAt": "2026-11-07T18:27:27.494Z",
  "updatedAt": "2026-11-07T18:27:27.494Z",
  "__v": 0
}
```

Response `404 Not Found` (valid id, but no such note):
```json
{ "error": "Note not found" }
```

Response `400 Bad Request` (e.g. `/api/notes/abc`):
```json
{ "error": "Invalid id" }
```

### POST /api/notes – create a note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Exam topics","body":"Hooks, Express, REST","tags":["exam","week9"]}'
```

Request body:
```json
{
  "title": "Exam topics",
  "body": "Hooks, Express, REST",
  "tags": ["exam", "week9"]
}
```

Response `201 Created`:
```json
{
  "title": "Exam topics",
  "body": "Hooks, Express, REST",
  "tags": ["exam", "week9"],
  "_id": "6aef6d8f6065ef98e47b7d7c",
  "createdAt": "2026-11-07T18:27:27.494Z",
  "updatedAt": "2026-11-07T18:27:27.494Z",
  "__v": 0
}
```

Response `400 Bad Request` (no title):
```json
{ "error": "Note validation failed: title: Path `title` is required." }
```

### PUT /api/notes/:id – update a note

Send the fields you want to change.

```bash
curl -X PUT http://localhost:3000/api/notes/6aef6d8f6065ef98e47b7d7c \
  -H "Content-Type: application/json" \
  -d '{"title":"Final exam topics","tags":["exam"]}'
```

Request body:
```json
{
  "title": "Final exam topics",
  "tags": ["exam"]
}
```

Response `200 OK` (the updated note):
```json
{
  "_id": "6aef6d8f6065ef98e47b7d7c",
  "title": "Final exam topics",
  "body": "Hooks, Express, REST",
  "tags": ["exam"],
  "createdAt": "2026-11-07T18:27:27.494Z",
  "updatedAt": "2026-11-07T18:27:27.556Z",
  "__v": 0
}
```

Response `400 Bad Request` (e.g. empty title):
```json
{ "error": "Validation failed: title: Path `title` is required." }
```

Response `404 Not Found`:
```json
{ "error": "Note not found" }
```

### DELETE /api/notes/:id – delete a note

```bash
curl -i -X DELETE http://localhost:3000/api/notes/6aef6d8f6065ef98e47b7d7c
```

Response `204 No Content` (no body).

Running it again gives `404 Not Found`:
```json
{ "error": "Note not found" }
```

---

## Testing

Import `notes-api.postman_collection.json` into Postman (**Import** → choose the file), then run the collection. The first request creates a note and saves its id, so the rest use it automatically. It checks all five routes plus the 400 and 404 error cases.

The curl commands above do the same from a terminal (`-i` shows the status code).
