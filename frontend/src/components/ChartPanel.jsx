
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { candleData, rsiData } from "./ChartData.js"; // Assuming you have a candleData.js file with your data

const ChartPanel = () => {
  const chartContainerRef = useRef();
  const volumeRef = useRef();
  const rsiRef = useRef();
  const timeScaleRef = useRef();
  const ohlcRef = useRef(null);
  const volumeInfoRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || !volumeRef.current || !rsiRef.current || !ohlcRef.current) return;

    // Main Candle Chart
    const mainChart = createChart(chartContainerRef.current, {
      layout: { attributionLogo: false, background: { color: "#fff" }, textColor: "#000" },
      rightPriceScale: { scaleMargins: { top: 0.2, bottom: 0.1 } },
      timeScale: {
        rightOffset: 5,
        barSpacing: 10,
        timeVisible: true,
        fixLeftEdge: true,
      },
    });

    const candleSeries = mainChart.addCandlestickSeries({
      upColor: "#00b050",
      downColor: "#ff0000",
      borderUpColor: "#00b050",
      borderDownColor: "#ff0000",
      wickUpColor: "#00b050",
      wickDownColor: "#ff0000",
    });
    candleSeries.setData(candleData);
    timeScaleRef.current = mainChart.timeScale();

    // const ohlcBox = ohlcRef.current;

    const unsubscribeCrosshairMove = mainChart.subscribeCrosshairMove((param) => {
      if (!param || !param.seriesData || !ohlcRef.current) {
        ohlcRef.current.style.opacity = 0;
        return;
      }

      const candlePoint = param.seriesData.get(candleSeries);
      if (!candlePoint) {
        ohlcRef.current.style.opacity = 0;
        return;
      }

      const { open, high, low, close } = candlePoint;

      ohlcRef.current.innerText = `O: ${open}  H: ${high}  L: ${low}  C: ${close}`;
      ohlcRef.current.style.opacity = 1;
    });


    // Volume Chart
    const volumeChart = createChart(volumeRef.current, {
      height: 120,
      handleScroll: false,
      handleScale: false,
      crossHair: { vertLine: { visible: false }, horzLine: { visible: false } },
      layout: { attributionLogo: false, background: { color: "#ffffff" }, textColor: "#333" },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: { visible: true },
      timeScale: { visible: true, borderVisible: false },
    });

    const volumeSeries = volumeChart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
    });

    const rawVolume = candleData.map(() =>
      Math.floor(Math.random() * 100 + 20)
    );

    const avgLookback = 15;

    const volumeData = candleData.map((bar, i) => {
      const value = rawVolume[i];

      const start = Math.max(0, i - avgLookback);
      const recent = rawVolume.slice(start, i);
      const avg =
        recent.reduce((sum, v) => sum + v, 0) / (recent.length || 1);

      const isSpike = value >= 1.5 * avg;

      return {
        time: bar.time,
        value,
        color: isSpike
          ? "#b04fecff"
          : bar.close > bar.open
            ? "#00b050"
            : "#ff0000",
      };
    });


    volumeSeries.setData(volumeData);

    const unsubscribeVolumeCrosshair = volumeChart.subscribeCrosshairMove((param) => {
      if (!param || !param.seriesData || !volumeInfoRef.current) {
        volumeInfoRef.current.innerText = "";
        volumeInfoRef.current.style.opacity = 0;
        return;
      }

      const point = param.seriesData.get(volumeSeries);
      if (!point || point.time === undefined) {
        volumeInfoRef.current.innerText = "";
        volumeInfoRef.current.style.opacity = 0;
        return;
      }

      const hoveredTime = point.time;
      const hoveredIndex = volumeData.findIndex((d) => d.time === hoveredTime);
      if (hoveredIndex === -1) return;

      const hoveredValue = rawVolume[hoveredIndex];

      const start = Math.max(0, hoveredIndex - avgLookback);
      const recent = rawVolume.slice(start, hoveredIndex);
      const avg =
        recent.reduce((sum, v) => sum + v, 0) / (recent.length || 1);

      const factor = (hoveredValue / avg).toFixed(2);

      const label =
        hoveredValue >= 1.5 * avg
          ? `Vol: ${hoveredValue} (Above Avg x${factor})`
          : `Vol: ${hoveredValue} (Normal)`;

      volumeInfoRef.current.innerText = label;
      volumeInfoRef.current.style.opacity = 1;
    });



    // RSI Chart
    const rsiChart = createChart(rsiRef.current, {
      // height: 200,
      layout: { attributionLogo: false, background: { color: "#ffffff" }, textColor: "#333" },
      rightPriceScale: {
        visible: true,
        scaleMargins: { top: 0.2, bottom: 0.2 },
      },
      timeScale: {
        rightOffset: 5,
        barSpacing: 10,
        fixLeftEdge: true,
        timeVisible: true,
      },
      handleScroll: true,
      handleScale: true,
    });

    const rsiSeries = rsiChart.addLineSeries({
      color: "#1f75d1ff",
      lineWidth: 2,
    });

    const rsiValues = rsiData(candleData);
    rsiSeries.setData(rsiValues.filter(d => typeof d.value === 'number'));

    // Price lines for RSI zone
    [40, 60].forEach((value) => {
      rsiSeries.createPriceLine({
        price: value,
        color: value === 40 ? "red" : "green",
        lineStyle: 2,
        lineWidth: 1,
        axisLabelVisible: true,
      });
    });

    // 2-way sync across all charts
    const syncAll = (range) => {
      if (range?.from !== undefined && range?.to !== undefined) {
        mainChart.timeScale().setVisibleLogicalRange(range);
        volumeChart.timeScale().setVisibleLogicalRange(range);
        rsiChart.timeScale().setVisibleLogicalRange(range);
      }
    };

    const unsubscribeMain = mainChart.timeScale().subscribeVisibleLogicalRangeChange(syncAll);
    // 🔒 Volume chart is now read-only (no scroll emit)
    const unsubscribeVol = () => { }; // dummy
    const unsubscribeRSI = rsiChart.timeScale().subscribeVisibleLogicalRangeChange(syncAll);
    //mainChart.timeScale().fitContent();

    return () => {
      unsubscribeMain?.();
      unsubscribeVol?.();
      unsubscribeRSI?.();
      unsubscribeCrosshairMove?.();
      unsubscribeVolumeCrosshair?.();
      mainChart.remove();
      volumeChart.remove();
      rsiChart.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* 📦 Chart area wrapper: position-relative, fixed height */}
      <div style={{ position: "relative", width: "100%", height: "500px" }}>
        {/* 📌 OHLC box */}
        <div
          ref={ohlcRef}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "#fff",
            padding: "6px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />

        {/* 📈 Candle chart fills the whole container */}
        <div
          ref={chartContainerRef}
          style={{
            position: "absolute",      // ✅ Important to make it fill correctly
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </div>

      {/* 📊 Volume label + chart */}
      <div style={{ fontSize: "12px", paddingLeft: "10px" }}>
        Volume
      </div>
      <div style={{ width: "100%", position: "relative", height: "120px" }}>
        {/* Hover Info Box for Volume */}
        <div
          ref={volumeInfoRef}
          style={{
            position: "absolute",
            top: -19,
            left: 55,
            background: "#fff",
            padding: "4px 10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />

        {/* Volume Chart Canvas */}
        <div
          ref={volumeRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* 📉 RSI label + chart */}
      <div style={{ fontSize: "12px", paddingLeft: "10px" }}>
        RSI (40–60 zone lines)
      </div>
      <div ref={rsiRef} style={{ width: "100%", height: "150px" }} />
    </div>


  );
};

export default ChartPanel;
