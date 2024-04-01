"use client";

import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const colorSpainPortugal = "#1f2937";
const colorEuropeDestinations = "#536d93";
const colorOtherCountries = "#becada";

const WorldMap = () => {
  return (
    <div className="relative aspect-w-16 aspect-h-9">
      <ComposableMap viewBox="0 30 800 600">
        <Geographies geography="https://unpkg.com/world-atlas@2.0.2/countries-110m.json">
          {({ geographies }: { geographies: any[] }) =>
            geographies
              .filter((geo: any) => geo.properties.name !== "Antarctica")
              .map((geo: any) => {
                const countryName = geo.properties.name;
                let color = colorOtherCountries;

                if (["Spain", "Portugal"].includes(countryName)) {
                  color = colorSpainPortugal;
                } else if (["Italy", "Germany"].includes(countryName)) {
                  color = colorEuropeDestinations;
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="#FFF"
                    strokeWidth={0.2}
                    style={{
                      default: { pointerEvents: "none" },
                      hover: { pointerEvents: "none" },
                      pressed: { pointerEvents: "none" },
                    }}
                  />
                );
              })
          }
        </Geographies>
      </ComposableMap>
      <div className="absolute w-full sm:w-fit bottom-1 left-0 bg-opacity-80 rounded-lg p-4 shadow-md text-sm sm:bottom-4 sm:left-5 lg:bottom-60 lg:left-2">
        <div className="flex justify-between sm:justify-normal sm:flex-col">
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-md bg-sky-900 mr-2"></div>
            <p>Destinos actuales</p>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-md bg-[#536d93] mr-2"></div>
            <p>Futuros destinos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
