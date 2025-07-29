
from emotion_reader.emotion_tags import detect_greed, detect_trap

# Example LTF candles
candles = [
    { "timestamp": "2025-07-26T09:00:00", "open": 100, "high": 102, "low": 99, "close": 101, "volume": 100000 },
    { "timestamp": "2025-07-26T09:05:00", "open": 101, "high": 103, "low": 100, "close": 102.5, "volume": 120000 },
    { "timestamp": "2025-07-26T09:10:00", "open": 102.5, "high": 106, "low": 102.4, "close": 105.5, "volume": 180000 },
    { "timestamp": "2025-07-26T09:15:00", "open": 105.5, "high": 107, "low": 105.2, "close": 106.8, "volume": 190000 },
    { "timestamp": "2025-07-26T09:20:00", "open": 106.8, "high": 107.5, "low": 104.5, "close": 105.0, "volume": 200000 }
]

# Mock RSI values
rsi_values = [50, 55, 60, 62, 58]

# HTF resistance zones
htf_context = {
    "resistance_zones": [105.0, 108.0]
}

# Run detectors
greed_results = detect_greed(candles, rsi_values=rsi_values, htf_context=htf_context)
trap_results = detect_trap(candles, rsi_values=rsi_values, htf_context=htf_context)

# Print output
import json
print("=== Greed Detection ===")
print(json.dumps(greed_results, indent=2))
print("\n=== Trap Detection ===")
print(json.dumps(trap_results, indent=2))
