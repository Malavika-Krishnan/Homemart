# HomeMart REST API Documentation

Comprehensive API documentation for the HomeMart smart shopping list and family management backend platform.

---

## Base URL
`http://localhost:5000/api/v1`

---

## Authentication Header
Protected endpoints require a permanent JWT access token supplied in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints Summary

### 1. Authentication API (`/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new user account |
| `POST` | `/auth/login` | Public | Authenticate user & get permanent JWT |
| `POST` | `/auth/logout` | Private | Log out user (client invalidation) |

#### Request Example (`POST /auth/register`)
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

#### Response Example (`201 Created`)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "66a6a123bc45678901234567",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "MEMBER",
      "familyId": null,
      "createdAt": "2026-07-28T20:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. User Profile API (`/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/profile` | Private | Get profile details of authenticated user |
| `PUT` | `/users/profile` | Private | Update name |
| `PATCH` | `/users/avatar` | Private | Update profile picture URL |
| `POST` | `/users/change-password` | Private | Change user password |

---

### 3. Family Management API (`/families`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/families/create` | Private | Create a new family group (creator becomes ADMIN) |
| `POST` | `/families/join` | Private | Join family using permanent invite code |
| `GET` | `/families` | Private (Family) | Get current family details & members |
| `POST` | `/families/invite-code` | Private (Admin) | Generate permanent invite code / link |
| `POST` | `/families/invite` | Private (Admin) | Send invitation notification by email |
| `DELETE` | `/families/members/:memberId` | Private (Admin) | Remove member from family |
| `PATCH` | `/families/members/:memberId/role` | Private (Admin) | Change member role (`ADMIN` or `MEMBER`) |
| `POST` | `/families/leave` | Private (Family) | Leave current family |

---

### 4. Shopping List API (`/lists`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/lists` | Private (Family) | Create a new shopping list |
| `GET` | `/lists` | Private (Family) | Retrieve all active lists for family |
| `GET` | `/lists/:id` | Private (Family) | Get single shopping list details |
| `PUT` | `/lists/:id` | Private (Family) | Update list name, description, or color |
| `DELETE` | `/lists/:id` | Private (Family) | Delete shopping list and associated items |

---

### 5. Shopping Item API (`/items`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/items` | Private (Family) | Add new item to a shopping list |
| `GET` | `/items/list/:listId` | Private (Family) | Get all items in list (supports `?category=` & `?search=`) |
| `PUT` | `/items/:id` | Private (Family) | Edit item details |
| `PATCH` | `/items/:id/quantity` | Private (Family) | Update item quantity |
| `PATCH` | `/items/:id/priority` | Private (Family) | Update priority (`LOW`, `MEDIUM`, `HIGH`) |
| `PATCH` | `/items/:id/toggle-purchase` | Private (Family) | Toggle purchased state (triggers notification) |
| `DELETE` | `/items/:id` | Private (Family) | Delete item |

---

### 6. Notification API (`/notifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | Private | Get paginated user notifications |
| `PATCH` | `/notifications/:id/read` | Private | Mark notification as read |
| `PATCH` | `/notifications/read-all` | Private | Mark all notifications as read |

---

### 7. Offline Synchronization API (`/sync`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/sync` | Private (Family) | Sync offline batched changes to server |

#### Request Example (`POST /sync`)
```json
{
  "clientTimestamp": "2026-07-28T20:30:00.000Z",
  "operations": [
    {
      "action": "CREATE",
      "entity": "item",
      "clientItemId": "uuid-12345",
      "listId": "66a6a999bc45678901234567",
      "clientTimestamp": "2026-07-28T20:25:00.000Z",
      "data": {
        "name": "Apples",
        "category": "Produce",
        "quantity": 6,
        "priority": "MEDIUM"
      }
    }
  ]
}
```

#### Response Example (`200 OK`)
```json
{
  "success": true,
  "message": "Offline synchronization completed",
  "data": {
    "processedCount": 1,
    "conflictsResolved": 0,
    "status": "SUCCESS",
    "results": [
      {
        "operationIndex": 0,
        "action": "CREATE",
        "entity": "item",
        "status": "SUCCESS",
        "message": "Offline item created successfully"
      }
    ],
    "syncLogId": "66a6a888bc45678901234567"
  }
}
```
