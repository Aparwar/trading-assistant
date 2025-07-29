# Defines rules for detecting emotions like Greed, Fear

def detect_greed(candles, rsi_values=None, htf_context=None):
    emotions = []
    for i in range(2, len(candles)):
        c = candles[i]
        prev = candles[i-1]

        body = abs(c['close'] - c['open'])
        range_ = c['high'] - c['low']
        body_pct = body / range_ if range_ else 0

        # Rule 1: Large green candle body
        is_green = c['close'] > c['open']
        large_body = body_pct > 0.6

        # Rule 2: Volume spike
        recent_volumes = [x['volume'] for x in candles[max(0, i-10):i]]
        avg_vol = sum(recent_volumes) / len(recent_volumes) if recent_volumes else 0
        volume_spike = c['volume'] > 1.5 * avg_vol

        # Rule 3: RSI above 60
        rsi_high = rsi_values and rsi_values[i] is not None and rsi_values[i] > 60

        # Rule 4: Optional HTF resistance nearby
        near_htf_resistance = False
        if htf_context and 'resistance_zones' in htf_context:
            price = c['close']
            for zone in htf_context['resistance_zones']:
                if abs(price - zone) <= 0.005 * price:  # within 0.5%
                    near_htf_resistance = True
                    break

        # Greed confirmation
        if is_green and large_body and volume_spike:
            confidence = 0.6
            reasons = []
            reasons.append("Large green candle body") if large_body else None
            reasons.append("Volume spike above 1.5x average") if volume_spike else None
            if rsi_high:
                confidence += 0.15
                reasons.append("RSI above 60")
            if near_htf_resistance:
                confidence += 0.1
                reasons.append("Near HTF resistance zone")

            emotions.append({
                "type": "Greed",
                "confidence": round(confidence, 2),
                "candle_index": i,
                "entry_zone": {
                    "price": round(c['close'], 2),
                    "direction": "short"
                },
                "exit_suggestion": {
                    "sl": round(c['high'] * 1.002, 2),
                    "target": round(c['close'] - (c['high'] - c['low']), 2)
                },
                "confirmed_by_HTF": near_htf_resistance,
                "reason": reasons
            })
    return emotions


def detect_trap(candles, rsi_values=None, htf_context=None):
    emotions = []
    for i in range(2, len(candles)):
        c = candles[i]
        prev = candles[i-1]
        prev2 = candles[i-2]

        # Rule 1: Previous candle was a breakout attempt
        breakout_body = abs(prev['close'] - prev['open']) > 0.6 * (prev['high'] - prev['low'])
        breakout_high = prev['close'] > max(prev2['close'], prev2['open'])

        # Rule 2: Current candle reverses and closes red
        is_red = c['close'] < c['open']
        closes_below_prev_open = c['close'] < prev['open']

        # Rule 3: Long upper wick on trap candle
        upper_wick = c['high'] - max(c['close'], c['open'])
        body = abs(c['close'] - c['open'])
        wick_ratio = upper_wick / body if body else 0
        long_wick = wick_ratio > 1.5

        # Rule 4: Volume spike on trap candle
        recent_volumes = [x['volume'] for x in candles[max(0, i-10):i]]
        avg_vol = sum(recent_volumes) / len(recent_volumes) if recent_volumes else 0
        volume_spike = c['volume'] > 1.5 * avg_vol

        # Trap confirmation
        if breakout_body and breakout_high and is_red and closes_below_prev_open and long_wick and volume_spike:
            confidence = 0.65
            reasons = [
                "Previous candle attempted breakout with large body",
                "Current candle reversed and closed below breakout candle's open",
                "Long upper wick on reversal candle",
                "Volume spike on trap candle"
            ]

            # Optional RSI divergence
            if rsi_values and rsi_values[i] is not None and rsi_values[i-1] is not None and rsi_values[i] < rsi_values[i-1]:
                confidence += 0.1
                reasons.append("RSI divergence (lower RSI on reversal)")

            emotions.append({
                "type": "Trap",
                "confidence": round(confidence, 2),
                "candle_index": i,
                "entry_zone": {
                    "price": round(c['close'], 2),
                    "direction": "short"
                },
                "exit_suggestion": {
                    "sl": round(c['high'] * 1.002, 2),
                    "target": round(c['close'] - (c['high'] - c['low']), 2)
                },
                "reason": reasons
            })
    return emotions


def detect_fear(candles, rsi_values=None, htf_context=None):
    emotions = []
    for i in range(2, len(candles)):
        c = candles[i]
        prev = candles[i - 1]

        # Rule 1: Large red candle body
        body = abs(c['close'] - c['open'])
        range_ = c['high'] - c['low']
        body_pct = body / range_ if range_ else 0
        is_red = c['close'] < c['open']
        large_body = body_pct > 0.6

        # Rule 2: Long lower wick (panic)
        lower_wick = min(c['close'], c['open']) - c['low']
        wick_ratio = lower_wick / body if body else 0
        long_lower_wick = wick_ratio > 1.5

        # Rule 3: Volume spike
        recent_volumes = [x['volume'] for x in candles[max(0, i-10):i]]
        avg_vol = sum(recent_volumes) / len(recent_volumes) if recent_volumes else 0
        volume_spike = c['volume'] > 1.5 * avg_vol

        # Rule 4: RSI < 40 (panic territory)
        rsi_low = rsi_values and rsi_values[i] is not None and rsi_values[i] < 40

        # Rule 5: Optional HTF support zone nearby
        near_htf_support = False
        if htf_context and 'support_zones' in htf_context:
            price = c['close']
            for zone in htf_context['support_zones']:
                if abs(price - zone) <= 0.005 * price:
                    near_htf_support = True
                    break

        # Confirmation of Fear
        if is_red and large_body and long_lower_wick and volume_spike:
            confidence = 0.65
            reasons = [
                "Large red candle with strong body",
                "Long lower wick (panic selling)",
                "Volume spike over 1.5x average"
            ]
            if rsi_low:
                confidence += 0.1
                reasons.append("RSI below 40")
            if near_htf_support:
                confidence += 0.1
                reasons.append("Near HTF support zone")

            emotions.append({
                "type": "Fear",
                "confidence": round(confidence, 2),
                "candle_index": i,
                "entry_zone": {
                    "price": round(c['close'], 2),
                    "direction": "long"
                },
                "exit_suggestion": {
                    "sl": round(c['low'] * 0.998, 2),
                    "target": round(c['close'] + (c['high'] - c['low']), 2)
                },
                "confirmed_by_HTF": near_htf_support,
                "reason": reasons
            })

    return emotions
