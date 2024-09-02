# Product Service

The Product Service is an Express.js application that handles product-related operations.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Navigate to the `apps/product-service` directory:

   ```bash
   cd apps/product-service
   ```

2. Build the Docker image:

   ```bash
   docker build -t product-service .
   ```

3. Run the Docker container:

   ```bash
   docker run -p 4003:4003 product-service
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

The Product Service will be available at [http://localhost:4003](http://localhost:4003).

## Project Structure

- **index.js**: The main entry point of the application.
- **Dockerfile**: Docker configuration for building the service.

## API Endpoints

- `GET /products`: Retrieve a list of products.
- `POST /products`: Create a new product.
- `GET /products/:id`: Retrieve a product by ID.
