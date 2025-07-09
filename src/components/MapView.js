import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ foodItems }) {
  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {foodItems.map((item) => {
        const [lat, lng] = item.location?.split(",").map(Number) || [];
        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker key={item._id} position={[lat, lng]}>
            <Popup>
              <strong>{item.name}</strong><br />
              {item.quantity} available<br />
              {item.provider?.name}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;
