import React, { useEffect, useState, useRef } from "react";
import { createChart } from "lightweight-charts";
import { candleData, rsiData } from "./ChartData.js";
import mockEmotionData from "./mockEmotionData";
import ChartTopBar from "./ChartTopBar.jsx";

const ChartPanel = ({ selectedStock }) => {
  const chartContainerRef = useRef();
  const volumeRef = useRef();
  const rsiRef = useRef();
  const ohlcRef = useRef(null);
  const volumeInfoRef = useRef(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');

  const handleTimeframeChange = (tf) => {
    setSelectedTimeframe(tf);
    // TODO: Trigger chart data refetch based on selected timeframe
  };



  useEffect(() => {
    if (!chartContainerRef.current || !volumeRef.current || !rsiRef.current || !ohlcRef.current) return;

    // Main candlestick chart
    const mainChart = createChart(chartContainerRef.current, {
      layout: { attributionLogo: false, background: { color: "#fff" }, textColor: "#000" },
      rightPriceScale: { scaleMargins: { top: 0.2, bottom: 0.1 } },
      timeScale: { rightOffset: 20, barSpacing: 10, timeVisible: true, fixLeftEdge: true },
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

    // Draw entry, stop-loss and target as short, semi-transparent dashed lines with axis labels
    const overlayRefs = [];
    try {
      const lastClose = candleData[candleData.length - 1]?.close;
      const currentPrice = mockEmotionData?.tla?.currentPrice ?? mockEmotionData?.entry?.price;
      const scaleFactor =
        typeof lastClose === 'number' && typeof currentPrice === 'number'
          ? lastClose / currentPrice
          : undefined;
      const rawEntry = mockEmotionData?.entry?.price;
      const rawStop = mockEmotionData?.exit?.stopLoss;
      const rawTarget = mockEmotionData?.exit?.target;
      if (typeof scaleFactor !== 'number') throw new Error('Scale factor undefined');

      const scaledEntry = typeof rawEntry === 'number' ? rawEntry * scaleFactor : undefined;
      const scaledStop = typeof rawStop === 'number' ? rawStop * scaleFactor : undefined;
      const scaledTarget = typeof rawTarget === 'number' ? rawTarget * scaleFactor : undefined;

      const colors = {
        entry: 'rgba(0, 102, 204, 0.5)',   // semi-transparent blue
        stop: 'rgba(213, 0, 0, 0.5)',     // semi-transparent red
        target: 'rgba(34, 22, 139, 0.5)',    // semi-transparent green
      };

      const addAxisLabel = (price, color, title) => {
        if (typeof price !== 'number') return;
        const line = candleSeries.createPriceLine({
          price,
          color,
          lineWidth: 1,   // hide the line itself
          lineStyle: 2,
          axisLabelVisible: true,
          title,
        });
        overlayRefs.push({ type: 'priceLine', ref: line });
      };

    } catch (err) {
      console.error('ChartPanel: failed to add dim overlays', err);
    }

    // Hover box to display OHLC values
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

    // Volume chart
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
    const rawVolume = candleData.map(() => Math.floor(Math.random() * 100 + 20));
    const avgLookback = 15;
    const volumeData = candleData.map((bar, i) => {
      const value = rawVolume[i];
      const start = Math.max(0, i - avgLookback);
      const recent = rawVolume.slice(start, i);
      const avg = recent.reduce((sum, v) => sum + v, 0) / (recent.length || 1);
      const isSpike = value >= 1.5 * avg;
      return {
        time: bar.time,
        value,
        color: isSpike ? "#b04fecff" : bar.close > bar.open ? "#00b050" : "#ff0000",
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
      const avg = recent.reduce((sum, v) => sum + v, 0) / (recent.length || 1);
      const factor = (hoveredValue / avg).toFixed(2);
      const label =
        hoveredValue >= 1.5 * avg
          ? `Vol: ${hoveredValue} (Above Avg x${factor})`
          : `Vol: ${hoveredValue} (Normal)`;
      volumeInfoRef.current.innerText = label;
      volumeInfoRef.current.style.opacity = 1;
    });

    // RSI chart
    const rsiChart = createChart(rsiRef.current, {
      layout: { attributionLogo: false, background: { color: "#ffffff" }, textColor: "#333" },
      rightPriceScale: { visible: true, scaleMargins: { top: 0.2, bottom: 0.2 } },
      timeScale: { rightOffset: 5, barSpacing: 10, fixLeftEdge: true, timeVisible: true },
      handleScroll: true,
      handleScale: true,
    });
    const rsiSeries = rsiChart.addLineSeries({ color: "#1f75d1ff", lineWidth: 2 });
    const rsiValues = rsiData(candleData);
    rsiSeries.setData(rsiValues.filter((d) => typeof d.value === "number"));
    [40, 60].forEach((value) => {
      rsiSeries.createPriceLine({
        price: value,
        color: value === 40 ? "red" : "green",
        lineStyle: 2,
        lineWidth: 1,
        axisLabelVisible: true,
      });
    });

    // Synchronise scrolling/panning across all charts
    const syncAll = (range) => {
      if (range?.from !== undefined && range?.to !== undefined) {
        mainChart.timeScale().setVisibleLogicalRange(range);
        volumeChart.timeScale().setVisibleLogicalRange(range);
        rsiChart.timeScale().setVisibleLogicalRange(range);
      }
    };
    const unsubscribeMain = mainChart.timeScale().subscribeVisibleLogicalRangeChange(syncAll);
    const unsubscribeVolSync = () => { };
    const unsubscribeRSISync = rsiChart.timeScale().subscribeVisibleLogicalRangeChange(syncAll);

    return () => {
      unsubscribeMain?.();
      unsubscribeVolSync?.();
      unsubscribeRSISync?.();
      unsubscribeCrosshairMove?.();
      unsubscribeVolumeCrosshair?.();
      // Clean up custom overlays
      overlayRefs.forEach(({ type, ref }) => {
        try {
          if (type === 'priceLine') candleSeries.removePriceLine(ref);
          else if (type === 'series') mainChart.removeSeries(ref);
        } catch (_) { }
      });
      mainChart.remove();
      volumeChart.remove();
      rsiChart.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <ChartTopBar
        selectedStock={selectedStock}
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={handleTimeframeChange}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: '14px', color: '#555' }}></div>      <div style={{ position: "relative", width: "100%", height: "500px" }}>
        {/* Floating OHLC box */}
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
        {/* Candlestick chart canvas */}
        <div ref={chartContainerRef} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      </div>

      {/* Volume section */}
      <div style={{ fontSize: "12px", paddingLeft: "10px" }}>Volume</div>
      <div style={{ width: "100%", position: "relative", height: "120px" }}>
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
        <div ref={volumeRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* RSI section */}
      <div style={{ fontSize: "12px", paddingLeft: "10px" }}>RSI (40–60 zone lines)</div>
      <div ref={rsiRef} style={{ width: "100%", height: "150px" }} />
    </div >
  );
};

export default ChartPanel;
