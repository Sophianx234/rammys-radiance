"use client";

import React, { useState, useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import { MapPin } from "lucide-react";

interface DeliveryMapProps {
  onAddressSelect: (address: string, city: string, region: string, lat?: number, lng?: number) => void;
}

export default function DeliveryMap({ onAddressSelect }: DeliveryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const marker = useRef<maptilersdk.Marker | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Initialize Map and handle location
  useEffect(() => {
    if (!mapContainer.current) return;

    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_PUBLIC_KEY || "";

    // Default center (e.g. Accra, Ghana)
    const initialCenter: [number, number] = [-0.1870, 5.6037];

    const mapInstance = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: initialCenter,
      zoom: 13,
      geolocateControl: false, 
    });
    
    map.current = mapInstance;

    // Add Geocoding Control for Search
    const gc = new GeocodingControl({
      apiKey: maptilersdk.config.apiKey,
      mapController: mapInstance,
      flyTo: true,
      placeholder: "Search your delivery location...",
    });
    mapInstance.addControl(gc, "top-left");

    // Initialize Marker
    const markerInstance = new maptilersdk.Marker({ color: "#5B7763", draggable: true })
      .setLngLat(initialCenter)
      .addTo(mapInstance);
      
    marker.current = markerInstance;

    const reverseGeocode = async (lngLat: maptilersdk.LngLat) => {
      try {
        const result = await maptilersdk.geocoding.reverse([lngLat.lng, lngLat.lat]);
        if (result && result.features && result.features.length > 0) {
          const feature = result.features[0];
          
          let address = feature.place_name || "";
          let city = "";
          let region = "";

          // Try to extract context for city and region
          if (feature.context) {
            const place = feature.context.find(c => c.id.startsWith("place"));
            const r = feature.context.find(c => c.id.startsWith("region"));
            if (place) city = place.text;
            if (r) region = r.text;
          } else {
            // fallback if it's already a place/region
            if (feature.place_type.includes("place")) city = feature.text;
            if (feature.place_type.includes("region")) region = feature.text;
          }

          onAddressSelect(address, city, region, lngLat.lat, lngLat.lng);
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
      }
    };

    // Listeners for marker drag and map click
    markerInstance.on("dragend", () => {
      const lngLat = markerInstance.getLngLat();
      if (lngLat) reverseGeocode(lngLat);
    });

    mapInstance.on("click", (e) => {
      const lngLat = e.lngLat;
      markerInstance.setLngLat([lngLat.lng, lngLat.lat]);
      reverseGeocode(lngLat);
    });

    gc.on("pick", (event: any) => {
      if (event && event.center) {
        const [lng, lat] = event.center;
        markerInstance.setLngLat([lng, lat]);
        
        let address = event.place_name || "";
        let city = "";
        let region = "";

        if (event.context) {
          const place = event.context.find((c: any) => c.id.startsWith("place"));
          const r = event.context.find((c: any) => c.id.startsWith("region"));
          if (place) city = place.text;
          if (r) region = r.text;
        }

        onAddressSelect(address, city, region, lat, lng);
      }
    });

    // Auto Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const userLngLat = new maptilersdk.LngLat(longitude, latitude);
          
          mapInstance.flyTo({ center: userLngLat, zoom: 14 });
          markerInstance.setLngLat(userLngLat);
          
          reverseGeocode(userLngLat);
          setIsLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLoading(false);
    }

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="space-y-3 mt-8">
      <div className="flex items-center gap-2">
        <h3 className="text-[12px] font-bold text-[#222222] uppercase tracking-wider">Pin Your Location</h3>
      </div>
      <p className="text-[12px] text-text-muted mb-4 leading-relaxed">
        We'll use your current location to automatically fill in your delivery address. You can also drag the pin or click on the map to adjust it.
      </p>
      
      <div className="relative w-full h-[300px] border border-border/60 bg-secondary/50 rounded-none overflow-hidden group">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-pulse flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#5B7763]">
              Locating you...
            </div>
          </div>
        )}
        <div ref={mapContainer} className="absolute inset-0 w-full h-full outline-none" />
      </div>
    </div>
  );
}
