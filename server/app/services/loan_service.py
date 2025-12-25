"""Business logic service for loan operations."""
import datetime
from typing import List, Optional, Tuple
from app.models.loan import Loan, LoanPayment
from app.repositories.loan_repository import LoanRepository
from app.repositories.payment_repository import PaymentRepository


class LoanService:
    """Service layer for loan business logic."""
    
    def __init__(
        self,
        loan_repository: Optional[LoanRepository] = None,
        payment_repository: Optional[PaymentRepository] = None
    ):
        self._loan_repository = loan_repository or LoanRepository()
        self._payment_repository = payment_repository or PaymentRepository()
    
    def get_all_loans(self, page: int = 1, page_size: int = 10) -> Tuple[List[Loan], dict]:
        return self._loan_repository.get_paginated(page=page, page_size=page_size)
    
    def get_loan_by_id(self, loan_id: int) -> Optional[Loan]:
        return self._loan_repository.get_by_id(loan_id)
    
    def get_payments_by_loan_id(
        self, 
        loan_id: int, 
        page: int = 1, 
        page_size: int = 10
    ) -> Tuple[List[LoanPayment], dict]:
        return self._payment_repository.get_paginated_by_loan_id(
            loan_id=loan_id,
            page=page,
            page_size=page_size
        )
    
    def add_payment(
        self, 
        loan_id: int, 
        payment_date: Optional[datetime.date] = None
    ) -> LoanPayment:
        """
        Add a payment for a loan.
        
        Raises:
            ValueError: If loan_id does not exist
        """
        if not self._loan_repository.exists(loan_id):
            raise ValueError(f"Loan with id {loan_id} does not exist")
        
        return self._payment_repository.create(
            loan_id=loan_id,
            payment_date=payment_date
        )

