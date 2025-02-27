# API Endpoints Documentation

## Tickets Endpoints

### POST /tickets

Creates a new ticket.

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "deadline": "string"
}
```

**Curl Example:**

```bash
curl -X POST http://localhost:3001/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Example Ticket",
    "description": "This is an example ticket description.",
    "deadline": "2025-03-01"
  }'
```

**Response:**

- Status Code: `201 Created`
- Body: The created ticket object in JSON format.

```json
{
  "id": number,
  "title": string,
  "description": string,
  "deadline": string,
  "assignedTo"?: string
}
```

### GET /tickets

Retrieves all tickets.

**Curl Example:**

```bash
curl http://localhost:3001/tickets
```

**Response:**

- Status Code: `200 OK`
- Body: An array of ticket objects in JSON format.

```json
[
  {
    "id": number,
    "title": string,
    "description": string,
    "deadline": string,
    "assignedTo"?: string
  },
  ...
]
