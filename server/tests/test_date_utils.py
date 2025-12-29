
import datetime
import pytest
from app.utils.date_utils import parse_date


class TestParseDate:
    
    def test_parse_valid_date_string(self):
        """Test parsing a valid date string in YYYY-MM-DD format."""
        result = parse_date("2025-03-10")
        assert result == datetime.date(2025, 3, 10)
        assert isinstance(result, datetime.date)
    
    def test_parse_date_with_leading_zeros(self):
        result = parse_date("2025-01-05")
        assert result == datetime.date(2025, 1, 5)
    
    def test_parse_date_leap_year(self):
        result = parse_date("2024-02-29")
        assert result == datetime.date(2024, 2, 29)
        
    def test_parse_date_invalid_format_dd_mm_yyyy(self):
        with pytest.raises(ValueError, match="Invalid date format"):
            parse_date("10-03-2025")
    
  