# HomeMart Standard Error Codes & Responses

All API error responses follow a consistent schema:

```json
{
  "success": false,
  "message": "Human readable error description",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

## HTTP Status Codes Reference
| Status Code | Meaning | Description |
| :--- | :--- | :--- |
| `200` | OK | Request succeeded |
| `201` | Created | Resource successfully created |
| `400` | Bad Request | Validation failure or invalid input parameters |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Insufficient permissions or family membership required |
| `404` | Not Found | Target resource does not exist |
| `409` | Conflict | Duplicate entry (e.g. email or invite code already exists) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Error | Server error |
