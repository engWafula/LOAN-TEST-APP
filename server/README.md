![Numida](./logo.numida.png)

# SERVER SETUP INSTRUCTIONS

This is a python server and requires that you have `python 3.9+` installed on your machine.

## Installation

> You will need docker installed in order to run the server

1. Change directory to the server folder `cd server`
2. Build and run the server `docker compose up --build`
3. Confirm your application is available at http://localhost:2024

## Local Development (Without Docker)

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Or use Makefile:
   ```bash
   make install
   make run
   ```

## Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html

# Or use Makefile
make test
make test-cov
```

## Project Structure

```
server/
├── app/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configuration management
│   ├── errors.py            # Error handlers
│   ├── models/              # Data models
│   │   ├── __init__.py
│   │   └── loan.py
│   ├── schemas/             # GraphQL schemas
│   │   ├── __init__.py
│   │   └── schema.py
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   └── loan_service.py
│   ├── routes/              # API routes
│   │   ├── __init__.py
│   │   ├── rest.py          # REST endpoints
│   │   └── graphql.py       # GraphQL endpoint registration
│   ├── validators/          # Input validation schemas
│   │   ├── __init__.py
│   │   └── payment_schema.py
│   └── data/                # Seed data fixtures
│       ├── __init__.py
│       └── fixtures.py
├── tests/                   # Unit tests
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_routes.py
│   └── test_graphql.py
├── app.py                   # Application entry point
├── requirements.txt         # Python dependencies
├── pytest.ini              # Pytest configuration
├── Dockerfile              # Docker configuration
├── compose.yaml            # Docker Compose configuration
└── Makefile                # Make commands
```

## API Documentation

### GraphQL Endpoint

**URL:** `/graphql`

**Method:** `POST`

The GraphQL endpoint supports querying loans with optional pagination. You can use GraphiQL interface at the same URL for interactive querying.

**Example Query - Get all loans:**

```graphql
{
  loans {
    loans {
      id
      name
      interestRate
      principal
      dueDate
      loanPayments {
        id
        loanId
        paymentDate
      }
    }
    pagination {
      page
      pageSize
      total
      totalPages
      hasNext
      hasPrev
    }
  }
}
```

**Example Query - Get loans with pagination:**

```graphql
{
  loans(page: 1, pageSize: 10) {
    loans {
      id
      name
      interestRate
      principal
      dueDate
    }
    pagination {
      page
      pageSize
      total
      totalPages
      hasNext
      hasPrev
    }
  }
}
```

**Notes:**
- If `pageSize` is 0 or omitted, all loans are returned
- Default page size when paginating is 10, max is 100
- Each loan includes its associated payments in the `loanPayments` field

### REST Endpoints

#### Home Endpoint

**URL:** `/`  
**Method:** `GET`

Returns a welcome message and health status.

**Response:**
```json
{
  "message": "Welcome to the Loan Application API",
  "status": "healthy"
}
```

#### Health Check

**URL:** `/health`  
**Method:** `GET`

Simple health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy"
}
```

#### Add Payment

**URL:** `/api/payments`  
**Method:** `POST`

Adds a new payment for a loan. The endpoint validates input using Marshmallow schemas.

**Request Body:**
```json
{
  "loan_id": 1,
  "payment_date": "2025-03-10"
}
```

**Success Response (201):**
```json
{
  "message": "Payment added successfully",
  "payment": {
    "id": 4,
    "loan_id": 1,
    "payment_date": "2025-03-10"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "loan_id": ["loan_id is required"]
  }
}
```

Or for business logic errors:
```json
{
  "error": "Loan with id 999 does not exist"
}
```

**Validation Rules:**
- `loan_id` is required and must be a positive integer
- `payment_date` is optional and must be in `YYYY-MM-DD` format if provided
- The loan must exist in the system

## Implementation Details

### Data Storage

The application uses in-memory storage for simplicity. Initial data is loaded from fixtures in `app/data/fixtures.py`. Each service instance maintains its own copy of the data.

### Input Validation

Input validation is handled using Marshmallow schemas defined in `app/validators/`. This provides:
- Type checking
- Required field validation
- Custom validation rules
- Clear error messages

### Pagination

Pagination is implemented for the GraphQL `loans` query. The pagination info includes:
- Current page number
- Page size
- Total number of items
- Total pages
- Whether next/previous pages exist

### Error Handling

The application includes error handlers for common HTTP status codes:
- 400: Bad request (validation errors)
- 404: Resource not found
- 500: Internal server error

Routes handle validation errors explicitly and return appropriate error messages.

## Configuration

Configuration is managed through environment variables. See `.env.example` for available options.

Key environment variables:
- `SECRET_KEY`: Flask secret key (required in production)
- `FLASK_DEBUG`: Enable debug mode (default: False)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 5000)
- `GRAPHIQL_ENABLED`: Enable GraphiQL interface (default: True)
- `LOG_LEVEL`: Logging level (default: INFO)

## Production Deployment

1. Set environment variables (especially `SECRET_KEY`)
2. Set `FLASK_DEBUG=False`
3. Set `GRAPHIQL_ENABLED=False` for production
4. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

## Testing

The project includes unit tests covering:
- Models (Loan, LoanPayment)
- Services (LoanService with pagination)
- REST API routes (validation, error handling)
- GraphQL schema (queries, pagination)

Run tests with:
```bash
pytest
```

Generate coverage report:
```bash
pytest --cov=app --cov-report=html
```

