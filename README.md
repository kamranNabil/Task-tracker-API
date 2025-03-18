# Task Tracker API ????

A RESTful API for task management with priority scheduling, filtering, paginating, and Redis caching. Implemented with Node.js, Express, MongoDB, and Redis.

![GitHub stars](https://img.shields.io/github/stars/kamranNabil/Task-tracker-API?style=social)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)

## Features ✨

- **CRUD Operations**: Create, read, update, and delete tasks.
- **Priority Scheduling**: Tasks ordered by priority (High → Medium → Low) and creation time.
- **Redis Caching**: Cache frequent requests to enhance performance.
- **Pagination & Filtering**: Filter the tasks based on `status` or `priority`, and paginate the results.
- **JWT Authentication** (Optional): User authentication over endpoints.

## Tech Stack ????

- **Backend**: Node.js, Express
- **Database**: MongoDB (using Mongoose)
- **Caching**: Redis
- **Testing**: Jest, Supertest
- **Tools**: Postman, Redis CLI

## Installation ????️

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kamranNabil/Task-tracker-API.git
   cd Task-tracker-API
```
