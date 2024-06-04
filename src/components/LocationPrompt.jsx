import React from "react";
import { Box, Paper, Typography } from "@mui/material";

// LocationPrompt component to prompt user to enable location access
const LocationPrompt = ({ weatherIconGIF, isLocationBlocked }) => (
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    }}
  >
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
        width: "300px",
      }}
    >
      <img src={weatherIconGIF} alt="Forecast" style={{ width: "100%" }} />
      <Typography variant="h6">Loading the weather information...</Typography>

      {isLocationBlocked && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Location access is currently blocked. Please enable location access in
          your browser settings and reload the page to view weather data for
          your current location.
        </Typography>
      )}
    </Paper>
  </Box>
);

export default LocationPrompt;
