"""
Unit tests for models.
"""
import datetime
import pytest
from app.models.loan import Loan, LoanPayment


class TestLoan:
    """Tests for Loan model."""
    
    def test_loan_creation(self):
        """Test creating a loan."""
        loan = Loan(
            id=1,
            name="Test Loan",
            interest_rate=5.0,
            principal=10000,
            due_date=datetime.date(2025, 3, 1)
        )
        
        assert loan.id == 1
        assert loan.name == "Test Loan"
        assert loan.interest_rate == 5.0
        assert loan.principal == 10000
        assert loan.due_date == datetime.date(2025, 3, 1)
    
    def test_loan_to_dict(self):
        """Test converting loan to dictionary."""
        loan = Loan(
            id=1,
            name="Test Loan",
            interest_rate=5.0,
            principal=10000,
            due_date=datetime.date(2025, 3, 1)
        )
        
        result = loan.to_dict()
        
        assert result["id"] == 1
        assert result["name"] == "Test Loan"
        assert result["interest_rate"] == 5.0
        assert result["principal"] == 10000
        assert result["due_date"] == "2025-03-01"


class TestLoanPayment:
    """Tests for LoanPayment model."""
    
    def test_payment_creation_with_date(self):
        """Test creating a payment with date."""
        payment = LoanPayment(
            id=1,
            loan_id=1,
            payment_date=datetime.date(2025, 3, 4)
        )
        
        assert payment.id == 1
        assert payment.loan_id == 1
        assert payment.payment_date == datetime.date(2025, 3, 4)
    
    def test_payment_creation_without_date(self):
        """Test creating a payment without date."""
        payment = LoanPayment(
            id=1,
            loan_id=1,
            payment_date=None
        )
        
        assert payment.id == 1
        assert payment.loan_id == 1
        assert payment.payment_date is None
    
    def test_payment_to_dict_with_date(self):
        """Test converting payment to dictionary with date."""
        payment = LoanPayment(
            id=1,
            loan_id=1,
            payment_date=datetime.date(2025, 3, 4)
        )
        
        result = payment.to_dict()
        
        assert result["id"] == 1
        assert result["loan_id"] == 1
        assert result["payment_date"] == "2025-03-04"
    
