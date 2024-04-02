"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
  Graticule,
} from "react-simple-maps";

const colorSpainPortugal = "rgb(8 47 73)";
const colorFutureDestinations = "rgb(3 105 161)";
const colorOtherCountries = "rgb(203 213 225)";

interface MousePosition {
  x: number;
  y: number;
}

interface CountryAnnotation {
  name: string;
  coordinates: [number, number];
}

const WorldMap: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [countryAnnotations, setCountryAnnotations] = useState<
    CountryAnnotation[]
  >([
    { name: "Spain", coordinates: [-3, 40] },
    { name: "Portugal", coordinates: [-8, 39] },
  ]);

  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getBBox().width);
    }
  }, [hoveredCountry]);

  const handleMouseMove = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseEnter = (countryName: string) => {
    setHoveredCountry(countryName);
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <div>
      <ComposableMap
        projectionConfig={{ rotate: [0, 0, 0] }}
        onMouseMove={handleMouseMove}
        className="overflow-visible px-10 "
        viewBox="0 30 800 600"
      >
        <Graticule stroke="#1f2937" strokeWidth={0.1} />
        <Geographies geography="https://unpkg.com/world-atlas@2.0.2/countries-110m.json">
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.name !== "Antarctica")
              .map((geo) => {
                const countryName = geo.properties.name;
                let color = colorOtherCountries;

                if (["Spain", "Portugal"].includes(countryName)) {
                  color = colorSpainPortugal;
                } else if (
                  ["Italy", "Germany", "Philippines"].includes(countryName)
                ) {
                  color = colorFutureDestinations;
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="#FFF"
                    strokeWidth={0.2}
                    onMouseEnter={() => handleMouseEnter(countryName)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
          }
        </Geographies>
        {hoveredCountry &&
          countryAnnotations.map((annotation, index) => {
            if (annotation.name === hoveredCountry) {
              return (
                <Annotation
                  key={index}
                  subject={annotation.coordinates}
                  dx={-25}
                  dy={-25}
                  connectorProps={{
                    stroke: "transparent",
                  }}
                >
                  <g>
                    <rect
                      x={-textWidth / 2 - 10}
                      y="-10"
                      width={textWidth + 20}
                      height="20"
                      fill="#1f2937"
                      opacity={0.9}
                      rx="4"
                      ry="4"
                    />
                    <text
                      ref={textRef}
                      x="0"
                      fontSize={10}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill="#fff"
                    >
                      {hoveredCountry}
                    </text>
                  </g>
                </Annotation>
              );
            }
          })}
      </ComposableMap>
      <div className="absolute w-full sm:w-fit bottom-1 left-0 bg-white bg-opacity-80 rounded-lg p-3 border border-sky-950 border-opacity-20 text-sm sm:bottom-7 sm:left-5 lg:bottom-60 lg:left-2">
        <div className="flex justify-between sm:justify-normal sm:flex-col">
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-full bg-sky-950 mr-2"></div>
            <p>Destinos actuales</p>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-full bg-sky-700 mr-2"></div>
            <p>Futuros destinos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
