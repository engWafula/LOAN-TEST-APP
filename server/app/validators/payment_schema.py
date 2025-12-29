from marshmallow import Schema, fields, validate, pre_load
from app.utils.date_utils import parse_date


class PaymentCreateSchema(Schema):
    loan_id = fields.Int(
        required=True,
        validate=validate.Range(min=1),
        error_messages={
            "required": "loan_id is required",
            "invalid": "loan_id must be a positive integer"
        }
    )
    
    payment_date = fields.Date(
        required=True,
        format="%Y-%m-%d",
        error_messages={
            "invalid": "payment_date must be in YYYY-MM-DD format"
        }
    )
    
    amount = fields.Float(
        required=True,
        validate=validate.Range(min=0),
        error_messages={
            "invalid": "amount must be a valid number",
            "validator_failed": "amount must be greater than or equal to 0"
        }
    )
    
    @pre_load
    def parse_payment_date(self, data, **kwargs):
        """process payment_date to handle empty strings and None values before validation is applied.."""
        if 'payment_date' in data:
            if data['payment_date'] == '' or data['payment_date'] is None:
                data['payment_date'] = None
            elif isinstance(data['payment_date'], str):
                try:
                    parse_date(data['payment_date'])
                except ValueError:
                    pass
        return data
    
    class Meta:
        strict = True

