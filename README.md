# REST API YELP CLONE

This example shows how to implement a **REST API with TypeScript** using [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client). The example uses an SQLite database file with some initial dummy data which you can find at [`./prisma/dev.db`](./prisma/dev.db).

## Getting started

### 1. Download example and install dependencies

Download this example:

```
pnpm dlx try-prisma@latest --template typescript/rest-express
```

Install pnpm dependencies:

```
cd rest-express
pnpm install
```

<details><summary><strong>Alternative:</strong> Clone the entire repo</summary>

Clone this repository:

```
git clone git@github.com:egomaragustaf/62teknologi-backend-test-ego-maragustaf.git --depth=1
```

Install pnpm dependencies:

```
cd 62teknologi-backend-test-ego-maragustaf
pnpm install
```

</details>

### 2. Create and seed the database

Run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
pnpm dlx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

### 3. Start the REST API server

```
pnpm run dev
```

The server is now running on `http://localhost:3000`. You can now run the API requests, e.g. [`http://localhost:3000/feed`](http://localhost:3000/feed).

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `GET`

- `/business/:id`: Fetch a single business by its `id`
- `/business/search?q={searchString}&limit={limit}&offset={offset}&sort_by={sort_by}`: Fetch all _published_ businesses
  - Query Parameters
    - `q` (optional): This filters businesses by `title` or `content`
    - `limit` (optional): This specifies how many objects should be returned in the list
    - `offset` (optional): This specifies how many of the returned objects in the list should be offsetped
    - `sort_by` (optional): The sort order for businesses in either ascending or descending order. The value can either `asc` or `desc`

### `POST`

- `/business/add`: Create a new business
  - Body:
    - `name: String` (required): The name of the businesses
    - `locations: String`: The locations of the businesses
    - `alias: String` (required): The alias the slug of the businesses

### `PUT`

- `/business/:id/edit`: Toggle the publish value of a business by its `id`

### `DELETE`

- `/business/:id/delete`: Delete a business by its `id`

## Evolving the app

Evolving the application typically requires two steps:

1. Migrate your database using Prisma Migrate
1. Update your application code

For the following example scenario, assume you want to add a "business" feature to the app where users can create a business and write a short bio about themselves.

### 1. Migrate your database using Prisma Migrate

The first step is to add a new table, e.g. called `Business`, to the database. You can do this by adding a new model to your [Prisma schema file](./prisma/schema.prisma) file and then running a migration afterwards:

```diff
// ./prisma/schema.prisma

model Business {
    id           String             @id @default(cuid())
    alias        String
    name         String
    is_closed    Boolean
    review_count Int
    rating       Float
    price        String
    locations    BusinessLocation[]

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model BusinessLocation {
    id         String    @id @default(cuid())
    address1   String
    address2   String?
    city       String
    zip_code   String
    country    String
    state      String
    business   Business? @relation(fields: [businessId], references: [id], onUpdate: Cascade, onDelete: Cascade)
    businessId String?

    @@index([businessId])
}
```

Once you've updated your data model, you can execute the changes against your database with the following command:

```
pnpm dlx prisma migrate dev --name add-business
```

This adds another migration to the `prisma/migrations` directory and creates the new `Business` table in the database.

### 2. Update your application code

You can now use your `PrismaClient` instance to perform operations against the new `Business` table. Those operations can be used to implement API endpoints in the REST API.

#### 2.1 Add the API endpoint to your app

Update your `index.ts` file by adding a new endpoint to your API:

```ts
app.get("/", (req: Request, res: Response) => {
  res.send("Yelp Clone by Ego Maragustaf");
});
```

## Switch to another database (e.g. PostgreSQL, MySQL, SQL Server, MongoDB)

If you want to try this example with another database than SQLite, you can adjust the the database connection in [`prisma/schema.prisma`](./prisma/schema.prisma) by reconfiguring the `datasource` block.

Learn more about the different connection configurations in the [docs](https://www.prisma.io/docs/reference/database-reference/connection-urls).

<details><summary>Expand for an overview of example configurations with different databases</summary>

### PostgreSQL

For PostgreSQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
}
```

Here is an example connection string with a local PostgreSQL database:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://janedoe:mypassword@localhost:5432/notesapi?schema=public"
}
```

### MySQL

For MySQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://USER:PASSWORD@HOST:PORT/DATABASE"
}
```

Here is an example connection string with a local MySQL database:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://janedoe:mypassword@localhost:3306/notesapi"
}
```

### Microsoft SQL Server

Here is an example connection string with a local Microsoft SQL Server database:

```prisma
datasource db {
  provider = "sqlserver"
  url      = "sqlserver://localhost:1433;initial catalog=sample;user=sa;password=mypassword;"
}
```

### MongoDB

Here is an example connection string with a local MongoDB database:

```prisma
datasource db {
  provider = "mongodb"
  url      = "mongodb://USERNAME:PASSWORD@HOST/DATABASE?authSource=admin&retryWrites=true&w=majority"
}
```

</details>

## Next steps

- Check out the [Prisma docs](https://www.prisma.io/docs)
- Share your feedback in the [`#product-wishlist`](https://prisma.slack.com/messages/CKQTGR6T0/) channel on the [Prisma Slack](https://slack.prisma.io/)
- Create issues and ask questions on [GitHub](https://github.com/prisma/prisma/)
- Watch our biweekly "What's new in Prisma" livestreams on [Youtube](https://www.youtube.com/channel/UCptAHlN1gdwD89tFM3ENb6w)
