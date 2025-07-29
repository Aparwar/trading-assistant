
import numpy as np

def calculate_rsi(candles, period=14):
    closes = [c['close'] for c in candles]
    if len(closes) < period + 1:
        return [None] * len(closes)

    deltas = np.diff(closes)
    seed = deltas[:period]
    up = seed[seed > 0].sum() / period
    down = -seed[seed < 0].sum() / period
    rs = up / down if down != 0 else 0
    rsi = [None] * period + [100 - 100 / (1 + rs)]

    for i in range(period, len(closes) - 1):
        delta = deltas[i]
        gain = max(delta, 0)
        loss = -min(delta, 0)
        up = (up * (period - 1) + gain) / period
        down = (down * (period - 1) + loss) / period
        rs = up / down if down != 0 else 0
        rsi.append(100 - 100 / (1 + rs))

    return rsi
