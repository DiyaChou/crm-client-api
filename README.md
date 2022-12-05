# CRM Client side API

This api is a part of create CRM Ticket system with MERN stack from scratch tutorial series.
Link for the series is

## How to use

- run `git clone ...`
- run `npm start`

Note: Make sure you have nodemon is installed in your system otherwise you can install as a dev dependencies in the project.

## API Resources

### User API RESOURCES

All the user API router follows `/v1/user/`

| #   | Routers                   | verbs  | Progress | Is Private | Description                                      |
| --- | ------------------------- | ------ | -------- | ---------- | ------------------------------------------------ |
| 1   | `/v1/user`                | GET    | DONE     | Yes        | Get users Info                                   |
| 2   | `/v1/user`                | POST   | DONE     | No         | Create a user                                    |
| 3   | `/v1/user/login`          | POST   | DONE     | No         | Verify user Authentication and return JWT        |
| 4   | `/v1/user/reset-password` | POST   | DONE     | No         | Verify email and email pin to reset the password |
| 5   | `/v1/user/reset-password` | PATCH  | DONE     | No         | Replace with new password                        |
| 6   | `/v1/user/logout`         | DELETE | DONE     | Yes        | Delete user accessJWT                            |

### Ticket API Resources

All the user API router follows `/v1/ticket/`

| #   | Routers                        | verbs  | Progress | Is Private | Description                             |
| --- | ------------------------------ | ------ | -------- | ---------- | --------------------------------------- |
| 1   | `/v1/ticket`                   | GET    | DONE     | Yes        | Get all ticket for the logged in user   |
| 2   | `/v1/ticket/{id}`              | GET    | DONE     | Yes        | Get a ticket details                    |
| 3   | `/v1/ticket`                   | POST   | DONE     | Yes        | Create a new ticket                     |
| 4   | `/v1/ticket/{id}`              | PUT    | DONE     | Yes        | Update ticket details ie. reply message |
| 5   | `/v1/ticket/close_ticket/{id}` | PUT    | DONE     | Yes        | Update ticket status to close ticket    |
| 6   | `/v1/ticket/{id}`              | DELETE | TODO     | Yes        | Delete a ticket                         |

### Token API Resources

All the token API routes follows `/v1/token`

| #   | Routers     | verbs | Progress | Is Private | Description            |
| --- | ----------- | ----- | -------- | ---------- | ---------------------- |
| 1   | `/v1/token` | GET   | DONE     | No         | Get a fresh access JWT |
