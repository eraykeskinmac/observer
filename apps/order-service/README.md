# Order Service

The Order Service is an Express.js application that handles order-related operations.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Navigate to the `apps/order-service` directory:

   ```bash
   cd apps/order-service
   ```

2. Build the Docker image:

   ```bash
   docker build -t order-service .
   ```

3. Run the Docker container:

   ```bash
   docker run -p 4002:4002 order-service
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

The Order Service will be available at [http://localhost:4002](http://localhost:4002).

## Project Structure

- **index.js**: The main entry point of the application.
- **Dockerfile**: Docker configuration for building the service.

## API Endpoints

- `GET /orders`: Retrieve a list of orders.
- `POST /orders`: Create a new order.
- `GET /orders/:id`: Retrieve an order by ID.
