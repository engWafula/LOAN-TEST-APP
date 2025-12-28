import datetime
from typing import List, Optional
from app.models.loan import Loan, LoanPayment
from app.repositories.loan_repository import LoanRepository
from app.repositories.payment_repository import PaymentRepository


class LoanService:
    
    def __init__(
        self,
        loan_repository: Optional[LoanRepository] = None,
        payment_repository: Optional[PaymentRepository] = None
    ):
        self._loan_repository = loan_repository or LoanRepository()
        self._payment_repository = payment_repository or PaymentRepository()
    
    def get_all_loans(self) -> List[Loan]:
        """Get all loans."""
        return self._loan_repository.get_all()
    
    def get_loan_by_id(self, loan_id: int) -> Optional[Loan]:
        return self._loan_repository.get_by_id(loan_id)
    
    def get_all_payments_by_loan_id(self, loan_id: int) -> List[LoanPayment]:
        """Get all payments for a loan."""
        return self._payment_repository.get_by_loan_id(loan_id)
    
    def add_payment(
        self, 
        loan_id: int, 
        payment_date: Optional[datetime.date] = None
    ) -> LoanPayment:
        if not self._loan_repository.exists(loan_id):
            raise ValueError(f"Loan with id {loan_id} does not exist")
        
        return self._payment_repository.create(
            loan_id=loan_id,
            payment_date=payment_date
        )

