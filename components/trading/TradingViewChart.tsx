"use client";
import useSelectedCoin from "@/lib/hooks/useSelectedCoin";
import { useTradingStore } from "@/store";
import { useEffect } from "react";

const ChartSymbol = {
  bitcoin: "CRYPTO:BTCUSD",
  ethereum: "CRYPTO:ETHUSD",
  solana: "CRYPTO:SOLUSD",
  ripple: "CRYPTO:XRPUSD",
  dogecoin: "CRYPTO:DOGEUSD",
}

export default function TradingViewChart() {
  const { selectedPair } = useTradingStore()
  const { selectedCoinId } = useSelectedCoin();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      new TradingView.widget({
        width: "100%",
        height: "100%",
        symbol: ChartSymbol[selectedCoinId as keyof typeof ChartSymbol] || "CRYPTO:BTCUSD",
        interval: "D",
        theme: "dark",
        style: "1",
        locale: "en",
        container_id: "tv_chart_container",
        // 🎨 تغییر رنگ کندل ها
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#f59145",
          "mainSeriesProperties.candleStyle.downColor": "#f14d4c",
          "mainSeriesProperties.candleStyle.borderUpColor": "#f59145",
          "mainSeriesProperties.candleStyle.borderDownColor": "#f14d4c",
          "mainSeriesProperties.candleStyle.wickUpColor": "#f59145",
          "mainSeriesProperties.candleStyle.wickDownColor": "#f14d4c",
        },
        allow_symbol_change: true,
        calendar: false,
        details: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        hide_legend: false,
        hide_volume: true,
        hotlist: false,
        save_image: true,
        timezone: "Etc/UTC",
        backgroundColor: "#0F0F0F",
        gridColor: "rgba(242, 242, 242, 0.06)",
        watchlist: [],
        withdateranges: false,
        compareSymbols: [],
        studies: [],
        autosize: true
      });
    };

    document.body.appendChild(script);
  }, [selectedPair]);

  return (
    <div className="tradingview-widget-container w-full">
      <div id="tv_chart_container" />
    </div>
  );
}
