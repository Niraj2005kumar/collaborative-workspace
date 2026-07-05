# Database Schema

## User Collection

| Field | Type | Description |
|-------|------|-------------|
| name | String | User Full Name |
| email | String | Unique Email Address |
| password | String | Hashed Password |
| avatar | String | Profile Image URL |
| role | String | admin / member |
| workspaces | ObjectId[] | User Workspaces |
| createdAt | Date | Account Creation Time |

---

## Workspace Collection

| Field | Type | Description |
|-------|------|-------------|
| name | String | Workspace Name |
| description | String | Workspace Description |
| owner | ObjectId | Workspace Owner |
| members | ObjectId[] | Workspace Members |
| createdAt | Date | Creation Date |

---

## Board Collection

| Field | Type | Description |
|-------|------|-------------|
| title | String | Board Name |
| workspace | ObjectId | Workspace Reference |
| createdAt | Date | Creation Date |

---

## List Collection

| Field | Type | Description |
|-------|------|-------------|
| title | String | List Name |
| board | ObjectId | Board Reference |
| position | Number | Order Position |

---

## Card Collection

| Field | Type | Description |
|-------|------|-------------|
| title | String | Card Title |
| description | String | Task Description |
| assignee | ObjectId | Assigned User |
| priority | String | Low / Medium / High |
| dueDate | Date | Due Date |
| list | ObjectId | Parent List |
| position | Number | Card Position |
| createdAt | Date | Creation Time |

---

## Comment Collection

| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Comment Author |
| card | ObjectId | Card Reference |
| message | String | Comment Text |
| createdAt | Date | Comment Time |