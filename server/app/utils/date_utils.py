"""
Date utility functions for consistent date handling across the application.
"""
import datetime
from typing import Optional
from pytz import UTC


def parse_date(date_string: Optional[str]) -> Optional[datetime.date]:
    if date_string is None:
        return None
    
    try:
        return datetime.datetime.strptime(date_string, '%Y-%m-%d').date()
    except (ValueError, TypeError) as e:
        raise ValueError(f"Invalid date format. Expected YYYY-MM-DD, got: {date_string}") from e







