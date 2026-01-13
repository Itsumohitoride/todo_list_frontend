# TodoList API - Endpoints Documentation

## Base URL
```
http://localhost:8080
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**Endpoint:** `POST /api/auth/register`
**Auth Required:** No
**Description:** Create a new user account

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "nickname": "string (required)",
  "password": "string (required, min 6 characters)"
}
```

**Response:** `201 Created`
```json
{
  "token": "string (JWT token)",
  "type": "Bearer",
  "userId": "uuid",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "nickname": "string",
  "role": "USER"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or email/nickname already exists

---

### 1.2 Login
**Endpoint:** `POST /api/auth/login`
**Auth Required:** No
**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "token": "string (JWT token)",
  "type": "Bearer",
  "userId": "uuid",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "nickname": "string",
  "role": "USER"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid credentials

---

### 1.3 Logout
**Endpoint:** `POST /api/auth/logout`
**Auth Required:** Yes
**Description:** Logout current user (client should discard token)

**Response:** `200 OK`

---

### 1.4 Get Current User
**Endpoint:** `GET /api/auth/me`
**Auth Required:** Yes
**Description:** Get information about currently authenticated user

**Response:** `200 OK`
```json
"Current user: user@example.com"
```

**Error Responses:**
- `401 Unauthorized` - No authentication token provided

---

## 2. User Endpoints

### 2.1 Create User
**Endpoint:** `POST /api/users`
**Auth Required:** Yes
**Description:** Create a new user

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, unique)",
  "nickname": "string (required, unique)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "nickname": "string"
}
```

---

### 2.2 Get User by ID
**Endpoint:** `GET /api/users/{id}`
**Auth Required:** Yes
**Description:** Get user details by ID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "nickname": "string"
}
```

**Error Responses:**
- `404 Not Found` - User not found

---

### 2.3 Get All Users
**Endpoint:** `GET /api/users`
**Auth Required:** Yes
**Description:** Get list of all users

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "nickname": "string"
  }
]
```

---

### 2.4 Get User by Email
**Endpoint:** `GET /api/users/email/{email}`
**Auth Required:** Yes
**Description:** Get user by email address

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "nickname": "string"
}
```

---

### 2.5 Get User by Nickname
**Endpoint:** `GET /api/users/nickname/{nickname}`
**Auth Required:** Yes
**Description:** Get user by nickname

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "nickname": "string"
}
```

---

### 2.6 Update User
**Endpoint:** `PUT /api/users/{id}`
**Auth Required:** Yes
**Description:** Update user information

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "nickname": "string"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "nickname": "string"
}
```

---

### 2.7 Delete User
**Endpoint:** `DELETE /api/users/{id}`
**Auth Required:** Yes
**Description:** Delete a user

**Response:** `204 No Content`

---

## 3. TodoList Endpoints

### 3.1 Create TodoList
**Endpoint:** `POST /api/lists`
**Auth Required:** Yes
**Description:** Create a new todo list

**Request Body:**
```json
{
  "name": "string (required)",
  "color": "string (hex color, e.g., #FF5733)",
  "listType": "PERSONAL | SHARED",
  "userId": "uuid (required)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "string",
  "color": "string",
  "listType": "string",
  "userId": "uuid"
}
```

---

### 3.2 Get TodoList by ID
**Endpoint:** `GET /api/lists/{id}`
**Auth Required:** Yes
**Description:** Get todo list details

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "color": "string",
  "listType": "string",
  "userId": "uuid"
}
```

---

### 3.3 Get TodoLists
**Endpoint:** `GET /api/lists`
**Auth Required:** Yes
**Query Parameters:**
- `userId` (optional): Filter by user ID

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "string",
    "color": "string",
    "listType": "string",
    "userId": "uuid"
  }
]
```

---

### 3.4 Update TodoList
**Endpoint:** `PUT /api/lists/{id}`
**Auth Required:** Yes
**Description:** Update todo list information

**Request Body:**
```json
{
  "name": "string",
  "color": "string",
  "listType": "PERSONAL | SHARED",
  "userId": "uuid"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "color": "string",
  "listType": "string",
  "userId": "uuid"
}
```

---

### 3.5 Change TodoList Color
**Endpoint:** `PUT /api/lists/{id}/color`
**Auth Required:** Yes
**Description:** Update the color of a todo list

**Request Body:**
```json
{
  "color": "string (hex color code, e.g., #FF5733)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "color": "string",
  "listType": "string",
  "userId": "uuid"
}
```

---

### 3.6 Delete TodoList
**Endpoint:** `DELETE /api/lists/{id}`
**Auth Required:** Yes
**Description:** Delete a todo list

**Response:** `204 No Content`

---

### 3.7 Search TodoLists by Name
**Endpoint:** `GET /api/lists/search`
**Auth Required:** Yes
**Query Parameters:**
- `name` (required): Search term (case-insensitive)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "string",
    "color": "string",
    "listType": "string",
    "userId": "uuid"
  }
]
```

---

### 3.8 Search User's TodoLists by Name
**Endpoint:** `GET /api/lists/search/user/{userId}`
**Auth Required:** Yes
**Query Parameters:**
- `name` (required): Search term (case-insensitive)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "string",
    "color": "string",
    "listType": "string",
    "userId": "uuid"
  }
]
```

---

## 4. Task Endpoints

### 4.1 Create Task
**Endpoint:** `POST /api/lists/{listId}/tasks`
**Auth Required:** Yes
**Description:** Create a new task in a todo list

**Request Body:**
```json
{
  "description": "string (required)",
  "status": "PENDING | COMPLETED",
  "date": "date (ISO 8601 format, e.g., 2024-12-31)",
  "taskType": "NORMAL | IMPORTANT | URGENT"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "description": "string",
  "status": "string",
  "date": "date",
  "taskType": "string",
  "listId": "uuid"
}
```

---

### 4.2 Get Task by ID
**Endpoint:** `GET /api/tasks/{id}`
**Auth Required:** Yes
**Description:** Get task details

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "description": "string",
  "status": "string",
  "date": "date",
  "taskType": "string",
  "listId": "uuid"
}
```

---

### 4.3 Get Tasks by List
**Endpoint:** `GET /api/lists/{listId}/tasks`
**Auth Required:** Yes
**Description:** Get all tasks for a specific todo list

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "string",
    "status": "string",
    "date": "date",
    "taskType": "string",
    "listId": "uuid"
  }
]
```

---

### 4.4 Update Task
**Endpoint:** `PUT /api/tasks/{id}`
**Auth Required:** Yes
**Description:** Update task information

**Request Body:**
```json
{
  "description": "string",
  "status": "PENDING | COMPLETED",
  "date": "date",
  "taskType": "NORMAL | IMPORTANT | URGENT"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "description": "string",
  "status": "string",
  "date": "date",
  "taskType": "string",
  "listId": "uuid"
}
```

---

### 4.5 Mark Task as Complete
**Endpoint:** `PUT /api/tasks/{id}/complete`
**Auth Required:** Yes
**Description:** Mark a task as completed

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "description": "string",
  "status": "COMPLETED",
  "date": "date",
  "taskType": "string",
  "listId": "uuid"
}
```

---

### 4.6 Delete Task
**Endpoint:** `DELETE /api/tasks/{id}`
**Auth Required:** Yes
**Description:** Delete a task

**Response:** `204 No Content`

---

### 4.7 Search Tasks by Description
**Endpoint:** `GET /api/tasks/search`
**Auth Required:** Yes
**Query Parameters:**
- `description` (required): Search term (case-insensitive)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "string",
    "status": "string",
    "date": "date",
    "taskType": "string",
    "listId": "uuid"
  }
]
```

---

### 4.8 Search Tasks in List
**Endpoint:** `GET /api/lists/{listId}/tasks/search`
**Auth Required:** Yes
**Query Parameters:**
- `description` (required): Search term (case-insensitive)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "string",
    "status": "string",
    "date": "date",
    "taskType": "string",
    "listId": "uuid"
  }
]
```

---

### 4.9 Filter Tasks by Status
**Endpoint:** `GET /api/lists/{listId}/tasks/filter/status`
**Auth Required:** Yes
**Query Parameters:**
- `status` (required): PENDING | COMPLETED

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "string",
    "status": "string",
    "date": "date",
    "taskType": "string",
    "listId": "uuid"
  }
]
```

---

### 4.10 Filter Tasks by Date Range
**Endpoint:** `GET /api/lists/{listId}/tasks/filter/date`
**Auth Required:** Yes
**Query Parameters:**
- `startDate` (required): ISO 8601 date (e.g., 2024-01-01)
- `endDate` (required): ISO 8601 date (e.g., 2024-12-31)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "string",
    "status": "string",
    "date": "date",
    "taskType": "string",
    "listId": "uuid"
  }
]
```

---

### 4.11 Get Overdue Tasks
**Endpoint:** `GET /api/lists/{listId}/tasks/overdue`
**Auth Required:** Yes
**Description:** Get all pending tasks with past due dates

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "string",
    "status": "PENDING",
    "date": "date",
    "taskType": "string",
    "listId": "uuid"
  }
]
```

---

## 5. Sharing Endpoints

### 5.1 Create Sharing
**Endpoint:** `POST /api/lists/{listId}/share`
**Auth Required:** Yes
**Description:** Create a sharing link for a todo list

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "listId": "uuid",
  "shareToken": "string",
  "qrCodeUrl": "string",
  "shareableLink": "string",
  "createdAt": "datetime"
}
```

---

### 5.2 Get QR Code
**Endpoint:** `GET /api/sharing/{id}/qr`
**Auth Required:** Yes
**Description:** Get QR code image for sharing

**Response:** `200 OK`
**Content-Type:** `image/png`
Returns a PNG image of the QR code

---

### 5.3 Get Shareable Link
**Endpoint:** `GET /api/sharing/{id}/link`
**Auth Required:** Yes
**Description:** Get shareable link URL

**Response:** `200 OK`
```json
{
  "shareableLink": "string (URL)"
}
```

---

### 5.4 Join Shared List
**Endpoint:** `POST /api/sharing/{shareToken}/join`
**Auth Required:** Yes
**Description:** Join a shared todo list using share token

**Response:** `200 OK`
```json
{
  "message": "Successfully joined the shared list",
  "listId": "uuid"
}
```

---

### 5.5 Get Shared Users
**Endpoint:** `GET /api/lists/{listId}/shared-users`
**Auth Required:** Yes
**Description:** Get list of users who have access to a shared list

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "nickname": "string"
  }
]
```

---

### 5.6 Get Sharing Info
**Endpoint:** `GET /api/sharing/{id}`
**Auth Required:** Yes
**Description:** Get sharing information

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "listId": "uuid",
  "shareToken": "string",
  "qrCodeUrl": "string",
  "shareableLink": "string",
  "createdAt": "datetime"
}
```

---

### 5.7 Delete Sharing
**Endpoint:** `DELETE /api/sharing/{id}`
**Auth Required:** Yes
**Description:** Delete a sharing configuration

**Response:** `204 No Content`

---

## 6. Statistics Endpoints

### 6.1 Get User Statistics
**Endpoint:** `GET /api/statistics/users/{userId}`
**Auth Required:** Yes
**Description:** Get general statistics for a user

**Response:** `200 OK`
```json
{
  "userId": "uuid",
  "totalLists": "integer",
  "totalTasks": "integer",
  "completedTasks": "integer",
  "pendingTasks": "integer",
  "completionRate": "double (percentage)",
  "calculatedAt": "datetime"
}
```

---

### 6.2 Get Progress Chart
**Endpoint:** `GET /api/statistics/users/{userId}/progress`
**Auth Required:** Yes
**Description:** Get progress chart data (line chart)

**Response:** `200 OK`
```json
{
  "labels": ["string array of dates"],
  "datasets": [
    {
      "label": "Completed Tasks",
      "data": ["number array"],
      "borderColor": "string",
      "backgroundColor": "string"
    }
  ]
}
```

---

### 6.3 Get Tasks Bar Chart
**Endpoint:** `GET /api/statistics/users/{userId}/tasks`
**Auth Required:** Yes
**Description:** Get tasks statistics for bar chart

**Response:** `200 OK`
```json
{
  "labels": ["string array of categories"],
  "datasets": [
    {
      "label": "Tasks",
      "data": ["number array"],
      "backgroundColor": ["string array of colors"]
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "string (error description)",
  "timestamp": "datetime"
}
```

### 401 Unauthorized
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication required",
  "timestamp": "datetime"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found",
  "timestamp": "datetime"
}
```

### 409 Conflict
```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Resource already exists",
  "timestamp": "datetime"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "timestamp": "datetime"
}
```

---

## Data Models

### User
```typescript
{
  id: string (uuid)
  firstName: string
  lastName: string
  email: string (unique)
  nickname: string (unique)
  role: "USER" | "ADMIN"
}
```

### TodoList
```typescript
{
  id: string (uuid)
  name: string
  color: string (hex color)
  listType: "PERSONAL" | "SHARED"
  userId: string (uuid)
}
```

### Task
```typescript
{
  id: string (uuid)
  description: string
  status: "PENDING" | "COMPLETED"
  date: string (ISO 8601 date)
  taskType: "NORMAL" | "IMPORTANT" | "URGENT"
  listId: string (uuid)
}
```

### Sharing
```typescript
{
  id: string (uuid)
  listId: string (uuid)
  shareToken: string
  qrCodeUrl: string
  shareableLink: string
  createdAt: string (ISO 8601 datetime)
}
```

---

## Notes for Frontend Development

1. **Authentication Flow:**
   - Call `/api/auth/register` or `/api/auth/login` to get JWT token
   - Store token securely (localStorage or sessionStorage)
   - Include token in all subsequent requests via Authorization header
   - Handle 401 responses by redirecting to login

2. **Base URL Configuration:**
   - Use environment variables for base URL
   - Development: `http://localhost:8080`
   - Production: Update as needed

3. **Date Handling:**
   - All dates use ISO 8601 format
   - Frontend should format dates for display
   - Use date pickers for user input

4. **Error Handling:**
   - All errors return consistent JSON structure
   - Display user-friendly messages based on status codes
   - Log detailed errors for debugging

5. **Pagination:**
   - Currently not implemented
   - All list endpoints return complete results
   - Consider implementing pagination for large datasets

6. **Real-time Updates:**
   - Not currently implemented
   - Consider WebSocket or polling for real-time features

7. **File Uploads:**
   - QR codes are generated server-side
   - Profile pictures not yet implemented

8. **Swagger Documentation:**
   - Access interactive API docs at: `http://localhost:8080/swagger-ui.html`
   - Test endpoints directly from Swagger UI
