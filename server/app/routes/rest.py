import logging
from flask import Blueprint, request, jsonify
from marshmallow import ValidationError as MarshmallowValidationError
from app.services.loan_service import LoanService
from app.validators.payment_schema import PaymentCreateSchema

logger = logging.getLogger(__name__)
rest_bp = Blueprint("rest", __name__)
payment_schema = PaymentCreateSchema()


@rest_bp.route("/api/payments", methods=["POST"])
def add_payment():
    try:
        try:
            json_data = request.get_json(force=True, silent=True) or {}
            validated_data = payment_schema.load(json_data)
        except MarshmallowValidationError as err:
            logger.warning(f"Validation error: {err.messages}")
            return jsonify({"error": "Validation failed", "details": err.messages}), 400
        
        loan_id = validated_data["loan_id"]
        payment_date = validated_data.get("payment_date")
        
        service = LoanService()
        payment = service.add_payment(loan_id, payment_date)
        
        logger.info(f"Payment added: {payment.id} for loan {loan_id}")
        
        return jsonify({
            "message": "Payment added successfully",
            "payment": payment.to_dict()
        }), 201
    
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        return jsonify({"error": str(e)}), 400
    
    except Exception as e:
        logger.error(f"Error adding payment: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500



