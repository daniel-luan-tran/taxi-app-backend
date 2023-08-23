## Description

API for Darren Walter's no1propertyguide.

## Technology

| Package                                                                                         | Description       |
| ----------------------------------------------------------------------------------------------- | ----------------- |
| [NestJS](https://nestjs.com/)                                                                   | Backend Framework |
| [Prisma](https://www.prisma.io/) + [nestjs-prisma](https://www.npmjs.com/package/nestjs-prisma) | ORM               |
| [PostgreSQL](https://www.postgresql.org/)                                                       | Database          |
| [PassportJS](http://www.passportjs.org/)                                                        | Authentication    |

## Getting started

### 1. Install dependencies

```bash
$ yarn install
```

### 2. Setup database

#### 2.1 Database connection

Ensure you have a Postgres database setup and the corresponding connection string has been added to the `.env` file.

#### 2.2 Run migrations

Use the following command to run migrations and create the database tables (this should be repeated whenever you pull new changes):

```bash
$ yarn run prisma migrate dev
```

### 3. Run the app

To run the application in development mode, run the following:

```bash
$ yarn run start:dev
```

## Test

Use the following to run the tests:

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Security

Ensure all best practices in the following documents are followed:

- [Secure design principles](https://bb-better-practices.azurewebsites.net/#/docs/Better%20Practices/General/security)
- [Security checklist](https://bb-better-practices.azurewebsites.net/#/docs/Processes/Delivery2/Internal%20UAT/security-checklist)
- [Event logging checklist](https://bb-better-practices.azurewebsites.net/#/docs/Processes/Delivery2/Internal%20UAT/api-logging-checklist)

### Potential improvements

- Ensure auth routes return 401 on login (with tests to validate and enforce)
- Ensure no timing attacks on the /login route

## Logging

You can import the custom logger and use like follows:

```typescript
// 1. Import the logger
import { CustomLogger } from '../logger/logger.service';

export class SomeService {
  // 2. Inject as dependancy
  constructor(private readonly logger: CustomLogger) {}

  public async someMethod() {
    // 3. Call logger method required values
    this.logger.log({
      context: 'SomeService someMethod',
      event_type: LogEventType, // enum
      reason: LogEventReason, // enum
      metadata: {}, // any additional data
    });
  }
}
```

## Versioning

When we change the logic of a route for a backend in production, we need to ensure it is backward compatible for other versions of the frontend. Therefore, it is necessary to version these methods within their respective controllers.

Check out the example below to see how it works:

```typescript
import { Controller, Get, Version } from '@nestjs/common';

@Controller('books')
export class BookController {
  // GET: http://localhost:3000/api/v1/books
  @Get('/')
  public getBooks(): string {
    return new Date().toISOString();
  }

  // GET: http://localhost:3000/api/v2/books
  // When we make large changes to `getBooks`, we need to create a getBooksV2 with the following Version decorator instead of directly modifying the old method.
  @Get('/')
  @Version('2')
  public getBooksV2(): string {
    return new Date().toISOString();
  }
}
```

## Azure Active Direct authentication

When we need to login via Azure Active Direct, front end just need to access link http://localhost:3000/api/v1/auth/azureAD/login, authentication is handled by Azure, then it will redirect to your front end home page with parameter.

```typescript
const loginAD = async () => {
  window.location.href = 'http://localhost:3000/api/v1/auth/azureAD/login';
};
```

```typescript
const testAD = async () => {
  const user = await axios.get(
    'http://localhost:3000/api/v1/auth/azureAD/check',
    {
      withCredentials: true,
    },
  );
};
```

When logging out, call api get http://localhost:3000/api/v1/auth/azureAD/logout, api will return a logoutLink,then access this link to complete logout from Azure Active Direct, then it will redirect to your front end home page.

```typescript
const logoutAD = async () => {
  const data = await axios.get(
    'http://localhost:3000/api/v1/auth/azureAD/logout',
  );
  window.location.href = data.data.logoutLink;
};
```

Backend Azure AD guard: Use Decorator @UseGuards(SessionAuthGuard) to protect the resource api
