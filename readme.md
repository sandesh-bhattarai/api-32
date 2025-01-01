# Express with Node server

# REST API

## Folder Structure

### MVC Pattern (Model, View, Controller)

    - node_modules/
    - src/
        - constants/
        - config/
        - app(modules)/
            - module/       eg. auth/ banner/
        - utilities/
        - services/
    - public/

## Expressjs

- config setup
- routing setup

# HealthCheck URL

- on Any method /health

## Response Codes

- 1x to 8x
- 200 - 599
- 200, 204, 300, 400, 401, 403, 404, 405, 422, 500, 502, 503

- 200 => Success OK
  - whenever server sends a success call to the client's request
- 204 => No Content
  - if sever doesn't return anything to the client but request is success
- 400 => Bad Request
  - validation if failed in API server
  - api expect age: 10000, response => set response code => 400
- 422 => Unprocessabel Entity
  - age field
  - ages
    - look for age field
    - failed validation => response = 422
- 401 => Unauthorized Access
  - BE routes API
    - public/open
      - can be called by any one no need of authorization
    - privated/closed
      - protected by some algorithms or token
  - if we try to access protected routes without login 401
- 403 => Access Denied/Forbidden
  - 3 users admin, customer, seller
  - protected routes by role
    - to access these routes I need to be logged in by that role
- 404 => Not found
  - called for some resource in server
  - does not exists in server
- 405 => method not allowed
  - server expected method does match
- 500 - Internal Server Error
  - code syntax does not match
- 502 => Bad Gateway
  - 1gb server => 10gb
  - 1 req 1mb => 1mb\*10240 => 10gb
- ## 503 => Temporary service Unavailable
- 504 => Gateway Timeout
  - default server timeout: 30s

### Requirements

a. Authentication and Authorization

- registration
- login
- forget password
- set password
- activation
- logout (optional)
- profile

## MVC (Model - View(React) - Controller)

- RCSM (Route ====> Controller ====> Service ====> Model)

## Mongodb

- to create/select the database:
  - `use <dbName>;`
- To view all the available dabases:
  - `show dbs;`
- To view all the table(collections) names of the database:
  - `show tables;`
- Active database
  - `db;`
- Data releated Operations

### Create Operation

- `db.<tableName/collectionName>.insertOne(json Object);`
  or
- `db.<tableName/collectionName>.insertMany([JsonObject]);`
- these functions returns acknowledgement
- single Insert ack:
  `{acknowledged: <boolean>, insertedId: ObjectId('hexcode')}`
- with every insert operation, an \_id field will be added with each row
- and this \_id is always unique and works as a primary key

### Read Operation

- `db.<tableName/CollectionName>.find(filter, projection, options);`
- `db.<tableName/CollectionName>.findOne(filter, projection, options);`

#### aggregation Pipeline

`
SELECT <fields> FROM <table>
[<JOIN Operations >]
[WHERE <Conditions>]
[GROUP BY <conditions>]
[HAVING conditions]
[ORDER BY <column> <Direction>]
[LIMIT <startingIndex>, <count>]

    id, name, email, address, .....

    select * from users;

    select * from users where role = 'admin';

`

#### Query Filter

- object to handle search and operations
- `{key: value, key1=value, .....}` => ~ `WEHRE key = "value" and key1 = 'value'  and ....`
- `{$operation: <exp>}`, `{key: <exp>}`
- `$and, $or, $gt, $gte, $lt, $lte, $eq, $in, $nin, $nq, $not, $regex`

### Query Projection

- `{key: 1}`

### Query Options

- `{sort: {column: dir}, skip: number, limit: number}`

### Update Operation

- `db.<collectionName/TableName>.updateOne(filter, updateBody, option);`
- `db.<collectionName/TableName>.updateMany(filter, updateBody, option);`

#### UpdateBody

- `{$set: {key: value}}`

### Delete Operation

- `db.<collectionName/TableName>.deleteOne(filter)`
- `db.<collectionName/TableName>.deleteMany(filter)`

#### Db Intergrate with our code

### Use or test

- GUI Based App=> compass

- protocol => mongodb, mysql, pgsql, odbc,
- host => localhost, 127.0.0.1, online host, ::1
- port => mysql -> 3306, mongodb -> 27017, pgsql -> 5432, odbc ->
- username => root, general
- password => set
- db name => db custom

=> connection url  
-> mongodb://<username>:<password>@host:portno?dbName
-> mongodb://127.0.0.1:27017/

#### Sql Db application

a. Build your db
b. Create a table
-> we have to run migrations

c. Create Model
-> DB physical table -> virtually application defined in js format in a class structure
d. Query Execution

## Atlas (cloud platform to host your mongodb)

- mongodb+srv://mern-32:MpwGvq135h3i4XHY@cluster0.nss1a.mongodb.net/
- mongodb://127.0.0.1:27017/

## Based on our DB, packages ORM/ODB provider

- Object Document/Relational Model/Mapping provider
- sql Server(mysql, postgresql, oracle, ms-sql, ....) => sequelize, typeorm, prism
- NoSQL(mongodb) => mongoose, mongodb(core)

## Localhost or Atlas

## ORM/ODM

- map physical db Table/collection into js/code model
- Schema Fetaures/Entity
-

### Features

- Users
  - \_id, name, email, password, gender, phone, role, address, image,
- User Information
  - \_id, userId, seller Information, organization, regisrtion, detail
- Banner
- Brand
- Category
- Product
- Order
- Transaction

- Offer/Voucher/Coupons
- Inventory
- Logistic

### Task

- Create a todo application api using express with mongodb
- Create a todo
- Push your codes to a new repository and assign to me(@sandesh-bhattarai)

### RBAC

- Role based access control

## Banner Data

- DDD (Design Driven Development)
- TDD (Test Driven Development)
- BDD (Behavioural/Busniess driven Development)
-

### api-32

- git clone repo
- cd api-32/
- npm install
- npm i nodemon -g
- copy .env.sample to .env
- at root directory make public/ folder
- npm start

- git pull origin main

- http://localhost:9005/api/v1/
