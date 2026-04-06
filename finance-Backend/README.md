# Finance Dashboard

A full-stack finance management system built with the MERN stack. Supports role-based access control across four roles — Viewer, Analyst, Accountant, and Admin.

## Live Demo

- Backend API: https://finance-dashboard-78xd.onrender.com

## Tech Stack

**Backend** — Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Joi  

## Role Permissions

| Role        | View Records | Create/Edit | Delete | Dashboard | Manage Users |
|-------------|:---:|:---:|:---:|:---:|:---:|
| Viewer      | ✓ | ✗ | ✗ | ✗ | ✗ |
| Analyst     | ✓ | ✗ | ✗ | ✓ | ✗ |
| Accountant  | ✓ | ✓ | Soft only | ✓ | ✗ |
| Admin       | ✓ | ✓ | Full | ✓ | ✓ |


## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login and get token |
| GET | /api/auth/me | Any logged-in | Get current user |




### Records
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/records | All roles | List with filters |
| GET | /api/records/:id | All roles | Single record |
| POST | /api/records | Accountant+ | Create record |
| PUT | /api/records/:id | Accountant+ | Update record |
| DELETE | /api/records/:id | Accountant+ | Soft delete |
| DELETE | /api/records/:id?hard=true | Admin | Hard delete |
| GET | /api/records/deleted | Admin | View deleted |
| PATCH | /api/records/:id/restore | Admin | Restore deleted |



### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/dashboard | Analyst+ | Full dashboard data |
| GET | /api/dashboard/summary | All roles | Summary stats only |



### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users | Admin | List all users |
| PATCH | /api/users/:id/status | Admin | Toggle active |
| PATCH | /api/users/:id/role | Admin | Change role |



### Query Filters for GET /api/records

?type=income|expense
?category=salary|rent|...
?startDate=2025-01-01
?endDate=2025-12-31
?minAmount=1000
?maxAmount=50000
?sortBy=amount|date|createdAt
?order=asc|desc
?page=1
?limit=10


## Assumptions Made
- Role is set at registration for demo purposes. In production, only admins would assign roles.
- Soft delete hides records from all views except admin's deleted records page.
- Accountants can only edit/delete their own records; admins can edit anyone's.
- Dashboard trends cover the past 12 months only.
- Amount is always stored as a positive number; the type field (income/expense) carries the sign.
