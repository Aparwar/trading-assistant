
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import {candleData} from "./ChartData.js"; // Assuming you have a candleData.js file with your data

const ChartPanel = () => {
  const chartContainerRef = useRef();
  const volumeRef = useRef();
  const rsiRef = useRef();
  const timeScaleRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current || !volumeRef.current || !rsiRef.current) return;

    // Main Candle Chart
    const mainChart = createChart(chartContainerRef.current, {
      height: 300,
      layout: { background: { color: "#fff" }, textColor: "#000" },
      rightPriceScale: { scaleMargins: { top: 0.2, bottom: 0.1 } },
      timeScale: {
        rightOffset: 5,
        barSpacing: 10,
        timeVisible: true,
        fixLeftEdge: true,
      },
      handleScroll: true,
      handleScale: true,
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

    // Volume Chart
    const volumeChart = createChart(volumeRef.current, {
      height: 120,
      handleScroll: false,
      handleScale: false,
      crossHair: { vertLine: { visible: false }, horzLine: { visible: false } },
      layout: { background: { color: "#ffffff" }, textColor: "#333" },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: { visible: true },
      timeScale: { visible: true, borderVisible: false },
    });

    const volumeSeries = volumeChart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
    });

    volumeSeries.setData(
      candleData.map((bar) => ({
        time: bar.time,
        value: Math.floor(Math.random() * 100 + 20),
        color: bar.close > bar.open ? "#00b050" : "#ff0000",
      }))
    );

    // RSI Chart
    const rsiChart = createChart(rsiRef.current, {
      height: 150,
      layout: { background: { color: "#ffffff" }, textColor: "#333" },
      rightPriceScale: {
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
      color: "#007bff",
      lineWidth: 2,
    });

    rsiSeries.setData(
      candleData.map((bar, i) => ({
        time: bar.time,
        value: 40 + 20 * Math.sin(i / 2),
      }))
    );

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
    const unsubscribeVol = () => {}; // dummy
    const unsubscribeRSI = rsiChart.timeScale().subscribeVisibleLogicalRangeChange(syncAll);

    mainChart.timeScale().fitContent();

    return () => {
      unsubscribeMain?.();
      unsubscribeVol?.();
      unsubscribeRSI?.();
      mainChart.remove();
      volumeChart.remove();
      rsiChart.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div ref={chartContainerRef} style={{ width: "100%", height: "300px" }} />
      <div style={{ fontSize: "12px", paddingLeft: "10px" }}>
        Volume
      </div><div ref={volumeRef} style={{ width: "100%", height: "120px",  }} />
      <div style={{ fontSize: "12px", paddingLeft: "10px" }}>
        RSI (40–60 zone lines)
      </div>
      <div ref={rsiRef} style={{ width: "100%", height: "150px" }} />
    </div>
  );
};

export default ChartPanel;
