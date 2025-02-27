# API Documentation

## Base URL

All endpoints are relative to `http://localhost:3000`.

## Endpoints

### Get Root

Endpoint: `GET /`

Description: Checks if the API is running.

Example Request using curl:

```bash
curl http://localhost:3000/
```

Response:

- Status Code `200 OK`: API is running. Returns the text "Express JS on Vercel".

Example Response (Success - 200 OK):

```text
Express JS on Vercel
```

### Create Ticket

Endpoint: `POST /tickets`

Description: Creates a new ticket in the system.

Request Body:

```json
{
  "title": "Ticket Title",
  "description": "Ticket description",
  "deadline": "YYYY-MM-DD",
  "skills": ["Skill1", "Skill2"]
}
```

- `title`: (string, required) The title of the ticket. Must be at least 3 characters long.
- `description`: (string, required) A detailed description of the ticket. Must be at least 3 characters long.
- `deadline`: (string, required) The deadline for the ticket in `YYYY-MM-DD` format. Must be a future date.
- `skills`: (array of strings, optional) An array of skills required for the ticket.

Example Request using curl:

```bash
curl -X POST \
  http://localhost:3000/tickets \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Example Ticket",
    "description": "This is an example ticket description.",
    "deadline": "2025-03-01",
    "skills": ["Frontend", "React"]
  }'
```

Response:

- Status Code `201 Created`: Ticket created successfully. Returns the created ticket object in JSON format.
- Status Code `400 Bad Request`:  Indicates validation errors in the request body. The response body will contain an error message.

Example Response (Success - 201 Created):

```json
{
  "id": 1,
  "title": "Example Ticket",
  "description": "This is an example ticket description.",
  "deadline": "2025-03-01T00:00:00.000Z",
  "assignedTo": "Alice",
  "skills": ["Frontend", "React"]
}
```

Example Response (Error - 400 Bad Request):

```json
{
  "error": "Title is required and must be at least 3 characters long"
}
```

### Get Tickets

Endpoint: `GET /tickets`

Description: Retrieves all tickets in the system.

Example Request using curl:

```bash
curl http://localhost:3000/tickets
```

Response:

- Status Code `200 OK`: Returns an array of ticket objects in JSON format.

Example Response (Success - 200 OK):

```json
[
  {
    "id": 1,
    "title": "Example Ticket",
    "description": "This is an example ticket description.",
    "deadline": "2025-03-01T00:00:00.000Z",
    "assignedTo": "Alice",
    "skills": ["Frontend", "React"]
  }
]

### Update Ticket Status

Endpoint: `PUT /tickets?id={ticketId}`

Description: Updates the status of an existing ticket.

Request Parameters:

- `id` (query parameter, required): The ID of the ticket to update.

Request Body:

```json
{
  "status": "Status Value"
}
```

- `status`: (string, required) The new status for the ticket. Allowed values are: "To do", "Doing", "Done".

Example Request using curl:

```bash
curl -X PUT \\
  http://localhost:3000/tickets?id=1 \\
  -H 'Content-Type: application/json' \\
  -d '{
    "status": "Doing"
  }'
```

Response:

- Status Code `200 OK`: Ticket status updated successfully. Returns the updated ticket object in JSON format.
- Status Code `400 Bad Request`: Indicates validation errors in the request. The response body will contain an error message.
- Status Code `404 Not Found`: Ticket with the given ID not found.

Example Response (Success - 200 OK):

```json
{
  "id": 1,
  "title": "Example Ticket",
  "description": "This is an example ticket description.",
  "deadline": "2025-03-01T00:00:00.000Z",
  "assignedTo": "Alice",
  "skills": ["Frontend", "React"],
  "status": "Doing"
}
```

Example Response (Error - 400 Bad Request):

```json
{
  "error": "Status is required"
}
```

Example Response (Error - 404 Not Found):

```json
{
  "error": "Ticket not found"
}
```

### Get Team Members

Endpoint: `GET /team-members`

Description: Retrieves all team members.

Example Request using curl:

```bash
curl http://localhost:3000/team-members
```

Response:

- Status Code `200 OK`: Returns an array of team member objects in JSON format.

Example Response (Success - 200 OK):

```json
[
  {
    "id": "1",
    "name": "Alice",
    "role": "Developer"
  },
  {
    "id": "2",
    "name": "Bob",
    "role": "Developer"
  },
  {
    "id": "3",
    "name": "Charlie",
    "role": "Designer"
  }
]
