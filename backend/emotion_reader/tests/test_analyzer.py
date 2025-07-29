
import pytest
from emotion_reader.emotion_tags import detect_greed, detect_trap

# Updated mock candles to trigger Greed + Trap
mock_candles = [
    { "timestamp": "2025-07-26T09:00:00", "open": 100, "high": 102, "low": 99, "close": 101, "volume": 100000 },
    { "timestamp": "2025-07-26T09:05:00", "open": 101, "high": 103, "low": 100, "close": 102.5, "volume": 120000 },
    { "timestamp": "2025-07-26T09:10:00", "open": 102.5, "high": 106, "low": 102.4, "close": 105.5, "volume": 180000 },  # Greed
    { "timestamp": "2025-07-26T09:15:00", "open": 105.5, "high": 107.8, "low": 105.1, "close": 106.9, "volume": 190000 },  # Breakout
    { "timestamp": "2025-07-26T09:20:00", "open": 106.9, "high": 108.0, "low": 104.0, "close": 104.5, "volume": 220000 }   # Trap
]

mock_rsi = [50, 55, 60, 65, 58]
htf_context = {
    "resistance_zones": [105.0, 108.0]
}

def test_detect_greed():
    results = detect_greed(mock_candles, rsi_values=mock_rsi, htf_context=htf_context)
    assert isinstance(results, list)
    for result in results:
        assert result['type'] == "Greed"
        assert 0 <= result['confidence'] <= 1
        assert 'reason' in result and isinstance(result['reason'], list)

def test_detect_trap():
    results = detect_trap(mock_candles, rsi_values=mock_rsi, htf_context=htf_context)
    assert isinstance(results, list)
    for result in results:
        assert result['type'] == "Trap"
        assert 0 <= result['confidence'] <= 1
        assert 'reason' in result and isinstance(result['reason'], list)

from emotion_reader.emotion_tags import detect_fear

def test_detect_fear():
    candles = [
        { "timestamp": "2025-07-26T09:00:00", "open": 100, "high": 102, "low": 99, "close": 101, "volume": 100000 },
        { "timestamp": "2025-07-26T09:05:00", "open": 101, "high": 103, "low": 100, "close": 102.5, "volume": 120000 },
        { "timestamp": "2025-07-26T09:10:00", "open": 102.5, "high": 106, "low": 102.4, "close": 105.5, "volume": 180000 },
        { "timestamp": "2025-07-26T09:15:00", "open": 105.5, "high": 107.8, "low": 105.1, "close": 106.9, "volume": 190000 },
        { "timestamp": "2025-07-26T09:20:00", "open": 106.9, "high": 107.0, "low": 102.0, "close": 102.8, "volume": 250000 }  # Fear
    ]
    rsi = [50, 55, 60, 62, 38]
    htf_context = {
        "support_zones": [102.0]
    }

    results = detect_fear(candles, rsi_values=rsi, htf_context=htf_context)
    assert isinstance(results, list)
    for result in results:
        assert result['type'] == "Fear"
        assert 0 <= result['confidence'] <= 1
        assert 'reason' in result and isinstance(result['reason'], list)
