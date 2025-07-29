
from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from emotion_reader.analyzer import analyze_emotions

app = FastAPI()

class Candle(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: float

class Context(BaseModel):
    resistance_zones: Optional[List[float]] = []
    support_zones: Optional[List[float]] = []

class EmotionRequest(BaseModel):
    candles: List[Candle]
    context: Optional[Context] = None

@app.post("/analyze")
async def analyze(request: EmotionRequest):
    candles = [c.dict() for c in request.candles]
    context = request.context.dict() if request.context else None
    result = analyze_emotions(candles, htf_context=context)
    return { "emotions": result }
