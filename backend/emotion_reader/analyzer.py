
from emotion_reader.emotion_tags import detect_greed, detect_trap, detect_fear
from emotion_reader.rsi_interpreter import calculate_rsi

def analyze_emotions(candles, htf_context=None):
    # Calculate RSI internally
    rsi = calculate_rsi(candles)

    # Run all detectors
    results = []
    results += detect_greed(candles, rsi_values=rsi, htf_context=htf_context)
    results += detect_trap(candles, rsi_values=rsi, htf_context=htf_context)
    results += detect_fear(candles, rsi_values=rsi, htf_context=htf_context)

    return results
