"use client";

import React, { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function OrderMap({ lat, lng, isInteractive = false }: { lat: number; lng: number, isInteractive?: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const marker = useRef<maptilersdk.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_PUBLIC_KEY || "";

    const center: [number, number] = [lng, lat];

    const mapInstance = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center,
      zoom: 15,
      geolocateControl: false, 
      navigationControl: isInteractive,
      interactive: isInteractive
    });
    
    map.current = mapInstance;

    marker.current = new maptilersdk.Marker({ color: "#5B7763" })
      .setLngLat(center)
      .addTo(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [lat, lng, isInteractive]);

  return <div ref={mapContainer} className="w-full h-72 border border-border/40" />;
}
