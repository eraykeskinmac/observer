# User Service

The User Service is an Express.js application that handles user-related operations.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Navigate to the `apps/user-service` directory:

   ```bash
   cd apps/user-service
   ```

2. Build the Docker image:

   ```bash
   docker build -t user-service .
   ```

3. Run the Docker container:

   ```bash
   docker run -p 4001:4001 user-service
   ```

### Running with Docker Compose

1. Navigate to the root directory of the project:

   ```bash
   cd ../../
   ```

2. Start the services using Docker Compose:

   ```bash
   docker-compose up -d
   ```

The User Service will be available at [http://localhost:4001](http://localhost:4001).

## Project Structure

- **index.js**: The main entry point of the application.
- **Dockerfile**: Docker configuration for building the service.

## API Endpoints

- `GET /users`: Retrieve a list of users.
- `POST /users`: Create a new user.
- `GET /users/:id`: Retrieve a user by ID.
