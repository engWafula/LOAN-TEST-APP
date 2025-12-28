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

## Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html
```


## API Documentation

### GraphQL Endpoint

**URL:** `/graphql`

**Method:** `POST`

The GraphQL endpoint provides a flexible way to query loan data. You can use the GraphiQL interface at the same URL for interactive querying (enabled by default in development).

**Example Query - Get all loans:**

```graphql
{
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
}
```

**Example Query - Get loans with specific fields:**

```graphql
{
  loans {
    id
    name
    principal
    loanPayments {
      paymentDate
    }
  }
}
```

**Response Example:**

```json
{
  "data": {
    "loans": [
      {
        "id": 1,
        "name": "Tom's Loan",
        "interestRate": 5.0,
        "principal": 10000,
        "dueDate": "2025-03-01",
        "loanPayments": [
          {
            "id": 1,
            "loanId": 1,
            "paymentDate": "2025-03-04"
          }
        ]
      }
    ]
  }
}
```

**Available Fields:**
- `loans`: Returns a list of all loans
  - `id` (Int): Unique loan identifier
  - `name` (String): Loan name
  - `interestRate` (Float): Interest rate percentage
  - `principal` (Int): Loan principal amount
  - `dueDate` (String): Loan due date in ISO format (YYYY-MM-DD)
  - `loanPayments` (List): Associated payments for the loan
    - `id` (Int): Payment identifier
    - `loanId` (Int): Associated loan ID
    - `paymentDate` (String): Payment date in ISO format, or null if not paid

**Notes:**
- All loans are returned (no pagination)
- Each loan includes its associated payments in the `loanPayments` field
- Payment dates can be `null` for unpaid loans
- Use GraphiQL interface for interactive query building and schema exploration

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
**Content-Type:** `application/json`

Adds a new payment for a loan. The endpoint validates input using Marshmallow schemas.

**Request Body:**
```json
{
  "loan_id": 1,
  "payment_date": "2025-03-10"
}
```

**Request Parameters:**
- `loan_id` (required, integer): The ID of the loan to add a payment for. Must be a positive integer.
- `payment_date` (optional, string): Payment date in `YYYY-MM-DD` format. If omitted or `null`, the payment is recorded without a date.

**Success Response (201 Created):**
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

**Error Responses:**

**400 Bad Request - Validation Error:**
```json
{
  "error": "Validation failed",
  "details": {
    "loan_id": ["loan_id is required"]
  }
}
```

**400 Bad Request - Business Logic Error:**
```json
{
  "error": "Loan with id 999 does not exist"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

**Validation Rules:**
- `loan_id` is required and must be a positive integer (≥ 1)
- `payment_date` is optional and must be in `YYYY-MM-DD` format if provided
- Empty strings for `payment_date` are treated as `null`
- The loan must exist in the system

## Implementation Details

### Data Storage

 Data is loaded from fixtures in `app/data/fixtures.py`. Each service instance maintains its own copy of the data.

### Input Validation

Input validation is handled using Marshmallow schemas defined in `app/validators/`. This provides:
- Type checking
- Required field validation
- Custom validation rules
- Clear error messages


### Error Handling

The application includes error handlers for common HTTP status codes:
- 400: Bad request (validation errors)
- 404: Resource not found
- 500: Internal server error

Routes handle validation errors explicitly and return appropriate error messages.


## Testing

The project includes unit tests covering:
- Models (Loan, LoanPayment)
- Services (LoanService)
- Repositories (LoanRepository, PaymentRepository)
- REST API routes (validation, error handling)
- GraphQL schema (queries)

Run tests with:
```bash
pytest
```

Generate coverage report:
```bash
pytest --cov=app --cov-report=html
```
