# Daily Trends App

This service scrapes El Mundo and El Pais news pages and shows 5 daily news on the main page. There
are CRUD operations are exposed with the endpoints to control the feeds.

## Architecture

![Architecture Diagram](https://mursal.s3.eu-west-1.amazonaws.com/diagram.jpg)

## API Documentation

ALL API endpoints are documented and can be tested using Swagger.

![Swagger UI](https://mursal.s3.eu-west-1.amazonaws.com/swagger.png)

## Main Feed Page

Simple UI are implemented to show feeds on the browser with EJS template engine.

![Swagger UI](https://mursal.s3.eu-west-1.amazonaws.com/main-page.jpg)

## Available Endpoints

- **GET** `/`: Renders main feed page with 5 news.
- **GET** `/feeds`: Retrieve all feeds.
- **POST** `/feeds`: Create a new feed.
- **PUT** `/feeds/:id`: Update a feed by ID.
- **DELETE** `/feeds/:id`: Delete a feed by ID.

## Setup & Installation

### Dependencies

Before setting up the project, ensure you have Node.js 18.x and docker/docker-compose installed. 
After cloning the repository, install the necessary dependencies:

```bash
npm install
```

Make sure you have no local MongoDB and RedisDb are up and running

```bash
docker-compose up -d
```

This will start MongoDB and RedisDB containers and expose ports

```bash
npm run dev
```

This will start the express server in local and the worker will start automatically as well to collect
the data. Currently i have set the worker for 1 minute but it needs to be just once a day for this case.



## Potential Improvements:

- **Configuration Handling**: Utilize `ARG` and `ENV` in Dockerfile instead of static sourcing from `.env` file.
- **Logging**: Adopt advanced logging with libraries like `Winston`.
- **CI/CD**: Implement a YAML pipeline for CI/CD.
- **Error Handling**: Establish better custom error handling using specific error functions and middleware.
- **Performance**: Utilize worker threads for parallelism.
- **Testing**: Increase unit tests and add integration tests.
