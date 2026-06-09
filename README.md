## About
ClearAgenda AI is a productivity app that removes the overwhelm of planning and maintaining a calender.

Live Link: [ClearAgenda.ai](https://clearagenda.ai)<br />
> Check out the "How it Works" section on the landing page to see the app interface

## Tech Stack
* React
* Next.js
* TypeScript
* Prisma
* MySQL

## Architecture Layers
1. Client
2. Route Handler
3. Authentication
4. Request Parsing + Validation
5. Authorization
6. Business Logic
7. DAO Layer
8. Database
9. Response + Error Handling

## Deployment
Deployed on a Hostinger VPS server running Ubuntu with an Apache web server and a reverse proxy

## APIs
This project uses Next.js Route Handlers with the App Directory<br />
All API routes are in the /app/api directory

## Request Pipeline
### Authentication
Authentication is handled with an Authorization header "Bearer <jwt_token>"
```ts
Auth.authenticate(req) // Returns a user object of undefined
```

### Parsing & Validation
All validation is done with zod schemas.<br />
The schemas all live in the /schemas directory

There are 3 helper functions for parsing and validating request data
```ts
const params = await Request.params(props, paramsSchema)
const query = Request.query(req, querySchema)
const body = await Request.body(req, bodySchema)
```
These helper functions all return typed objects or throw a HttpError with a VALIDATION_ERROR http response

### Authorization
```ts
if (!user) throw new HttpError(Response.unauthorized())
if (user.id !== params.user_id) throw new HttpError(Response.forbidden())
```

### Business Logic
(Open ended), but this is the layer where file managment and database interactions live

### Response & Error Handling
```ts
return Response.ok({ avitar }) // Success response
```
Otherwise all errors are caught in a catch block
```ts
if (err instanceof HttpError) return err.response
Error.notify(err) // Sends error report email in production
return Response.internalServerError()
```

## Businss Logic
[Tasks, Events & Reminders Busines Logic](docs/scheduling-pipeline-business-logic.md)<br />
This document outlines agenda item system design and comprehensive standards for handling all edge cases associated with agenda items (floating and fixed dates and times, timezones, calendar day boundaries, Etc.)

## Libraries
All libraries live in the /lib directory
* AI - for all AI querying actions
* Events - global methods for handling business logic for events
* Reminders - global methods for handling business logic for reminders
* Tasks - global methods for handling business logic for tasks
* API - an adapter for sending API requests with encapsulated auth and generic response typing
* Auth - global backend methods for API auth
* Email - sending emails
* Error - methods for handling backend errors
* HttpError - a class for throwing http response errors
* Request - methods for parsing, validating, and typing request URL params, body, and query strings
* Response - methods for handling all types of http response statuses with custom error codes.
* Utility - miscellaneous global methods
* Validation - validation methods for user inputs