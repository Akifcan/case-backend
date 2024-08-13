# README

## Server

- Backend Server URL: **http://139.59.210.72:3004**
- Backend Comment Microservice URL: **http://139.59.210.72:3005**
- Web App URL: 

## Installation

## Case Comment Microservice

- Docker 
  - Run docker file first inside the **docker** folder.
  - `docker compose up -d`

- Set up .env file.
  - create **.env** file in the root folder.
  - **.env** file should look like this.
  ```
  # DB_NAME=case_db
  # DB_USER=case_user
  # DB_PASSWORD=case_password
  # DB_PORT=5432
  # DB_HOST=localhost

  DB_NAME=postgres
  DB_USER=postgres.kgoxitgoblfsqshfufge
  DB_PASSWORD=QGj5k2olkRqpGvNL
  DB_PORT=6543
  DB_HOST=aws-0-eu-central-1.pooler.supabase.com

  APP_PORT=3002

  JWT_SECRET=af5++23dxsFFsx
  #JWT_EXPIRES_IN=60s
  JWT_EXPIRES_IN=1d

  FALLBACK_LANGUAGE=en

  REDIS_PORT=6379
  REDIS_HOST=127.0.0.1
  REDIS_TTL=10

  RATE_LIMITER_TTL=60000
  RATE_LIMIT=10

  COMMENT_SERVICE_PORT=3002
  COMMENT_SERVICE_HOST=localhost```

---

-  ## Run the service

 - `yarn install`
 - `yarn start:dev` 

- ## Tests
 - `yarn test`

- ## Please run the seeder before execute the tests.


## Case Backend

- Docker 
  - Run docker file first inside the **docker** folder.
  - `docker compose up -d`

- Set up .env file.
  - create **.env** file in the root folder.
  - **.env** file should look like this.
  ```
    # DB_NAME=case_db
    # DB_USER=case_user
    # DB_PASSWORD=case_password
    # DB_PORT=5432
    # DB_HOST=localhost

    DB_NAME=postgres
    DB_USER=postgres.kgoxitgoblfsqshfufge
    DB_PASSWORD=QGj5k2olkRqpGvNL
    DB_PORT=6543
    DB_HOST=aws-0-eu-central-1.pooler.supabase.com

    APP_PORT=3000

    JWT_SECRET=af5++23dxsFFsx
    #JWT_EXPIRES_IN=60s
    JWT_EXPIRES_IN=1d

    FALLBACK_LANGUAGE=en

    REDIS_PORT=6379
    REDIS_HOST=127.0.0.1
    REDIS_TTL=10

    RATE_LIMITER_TTL=60000
    RATE_LIMIT=10

    COMMENT_SERVICE_PORT=3002
    COMMENT_SERVICE_HOST=localhost

    HEALTHCHECK_URI=http://localhost:3000/health```

  
 - `yarn install`
 - `yarn start:dev` 

- ## Seeder (IMPORTANT)

- Please run these endpoints before use the app.
- `localhost:3000/seed`
- `localhost:3000/seed/external-comment-merge`
- Please read this comment lines: https://github.com/Akifcan/case-backend/blob/93160f4671059e1d6d25a13a187584f034531fcd/src/seed/seed.controller.ts#L446

- Postman Collection: **https://github.com/Akifcan/case-backend/blob/main/case.postman_collection.json**

- ## Tests
- # Please run seeder before the tests.
- `yarn test`
- `yarn test:2e`


---

# Next App

- # Please run seeder before the run web app.

- ## .env file

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

- ## Setup

- `yarn install`
- `yarn dev --port 3001` 

- ## Tests

- `yarn cy:open`