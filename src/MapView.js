// src/MapView.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Paper, Typography } from '@mui/material';
import { db, ref, onValue } from './firebase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const locationRef = ref(db, 'busLocation');
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.lat && data.lng) {
        setLocation(data);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        height: 'calc(100vh - 100px)',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      {location ? (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>
              <Typography variant="subtitle2">Bus Location</Typography>
              <Typography variant="body2">
                Latitude: {location.lat.toFixed(6)}
                <br />
                Longitude: {location.lng.toFixed(6)}
              </Typography>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading live bus location...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MapView;