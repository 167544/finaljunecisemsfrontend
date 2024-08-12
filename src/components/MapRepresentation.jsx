import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import L from "leaflet";
import { Typography } from "@mui/material";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const country_codes = {
  ARM: "Europe",
  AUS: "Asia",
  CAN: "North America",
  CHE: "Europe",
  CHN: "Asia",
  COL: "South America",
  DEU: "Europe",
  ESP: "Europe",
  FRA: "Europe",
  GBR: "Europe",
  HKG: "Asia",
  IND: "Asia",
  IRL: "Europe",
  JPN: "Asia",
  MEX: "North America",
  MYS: "Asia",
  NLD: "Europe",
  PHL: "Asia",
  POL: "Europe",
  PRT: "Europe",
  ROU: "Europe",
  USA: "North America",
};

const MapRepresentation = () => {
  const [geoData, setGeoData] = useState(null);
  const [countryCount, setCountryCount] = useState([]);
  const mapRef = useRef(null);

  const data = useSelector((state) => state.selectedData);

  const getCountsByCountry = () => {
    const counts = {};
    console.log("Data to process:", data);
    
    // Filter out "Exit" employees
    const activeEmployees = data.filter(item => item['Employee Status'] !== 'Exit');
    
    activeEmployees.forEach((item, index) => {
      const country = item.Country;
      const gender = item.Gender;

      // Detailed logging for each item
      console.log(`Processing item ${index}:`, item);
      if (country === undefined || gender === undefined) {
        console.log("Undefined fields found in item:", item);
      }

      if (!counts[country]) {
        counts[country] = { total: 0, male: 0, female: 0 };
      }

      counts[country].total += 1;

      if (gender === "M") {
        counts[country].male += 1;
      } else if (gender === "F") {
        counts[country].female += 1;
      }

      // Log the count for the current country
      console.log(`Counts for ${country}:`, counts[country]);
    });

    console.log("Counts by country after processing:", counts);

    return Object.entries(counts).map(([country, count]) => ({
      _id: country,
      count: count.total,
      male: count.male,
      female: count.female,
    }));
  };

  useEffect(() => {
    console.log("Data from Redux:", data);
    setCountryCount(getCountsByCountry());
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((response) => response.json())
      .then((data) => setGeoData(data));
  }, [data]);

  const findCountryCoordinates = (countryCode) => {
    if (!geoData) return null;
    const countryFeature = geoData.features.find(
      (feature) => feature.properties.ISO_A3 === countryCode
    );
    if (!countryFeature) return null;

    const coordinates = countryFeature.geometry.coordinates;
    let latSum = 0,
      lngSum = 0,
      count = 0;

    const addCoordinates = (coords) => {
      coords.forEach((coord) => {
        if (Array.isArray(coord[0])) {
          addCoordinates(coord);
        } else {
          lngSum += coord[0];
          latSum += coord[1];
          count++;
        }
      });
    };

    addCoordinates(coordinates);

    const latitude = latSum / count;
    const longitude = lngSum / count;

    const name = countryFeature.properties.ADMIN;
    const continent = country_codes[countryCode] || "Unknown";

    return { latitude, longitude, continent, name };
  };

  useEffect(() => {
    if (mapRef.current && countryCount.length > 0) {
      const bounds = L.latLngBounds(
        countryCount.map((country) => {
          const coordinates = findCountryCoordinates(country._id);
          console.log(`Coordinates for ${country._id}:`, coordinates);
          if (coordinates) {
            return [coordinates.latitude, coordinates.longitude];
          }
          return null;
        }).filter((coords) => coords !== null)
      );

      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50],
        });

        mapRef.current.setMaxBounds(bounds);
      }
    }
  }, [countryCount]);

  useEffect(() => {
    console.log("Country counts:", countryCount);
  }, [countryCount]);

  return (
    <div style={{ backgroundColor: "#0A2342", borderRadius: "10px", padding: "10px", boxSizing: "border-box", width: "1050px" }}>
      <Typography variant="h2" style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>
        Country Graph
      </Typography>
      <div style={{ height: "410px", width: "1030px", borderRadius: "10px", overflow: "hidden" }}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%", borderRadius: "10px" }}
          ref={mapRef}
          minZoom={2}
          maxZoom={10}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {countryCount.map((country) => {
            const coordinates = findCountryCoordinates(country._id);
            if (!coordinates) return null;

            return (
              <Marker
                key={country._id}
                position={[coordinates.latitude, coordinates.longitude]}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                  },
                }}
              >
                <Popup>
                  {coordinates.name}, {coordinates.continent}
                  <br />
                  Employees: {country.count}
                  <br />
                  {/* Male: {country.male} */}
                  <br />
                  {/* Female: {country.female} */}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapRepresentation;
