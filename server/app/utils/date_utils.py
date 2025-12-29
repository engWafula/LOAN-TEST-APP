
import datetime


def parse_date(date_string):
    if date_string is None:
        return None
    
    try:
        return datetime.datetime.strptime(date_string, '%Y-%m-%d').date()
    except (ValueError, TypeError) as e:
        raise ValueError(f"Invalid date format. Expected YYYY-MM-DD, got: {date_string}") from e







