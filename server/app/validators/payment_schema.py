from marshmallow import Schema, fields, validate


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
        allow_none=True,
        format="%Y-%m-%d",
        error_messages={
            "required": "payment_date is required",
            "invalid": "payment_date must be in YYYY-MM-DD format"
        }
    )
    
    class Meta:
        strict = True

