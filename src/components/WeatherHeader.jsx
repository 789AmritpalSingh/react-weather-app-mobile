import React from "react";
import { Box, Typography } from "@mui/material";
import DigitalClock from "./digitalClock";

const WeatherHeader = ({ parsedWeatherData, setBackgroundImage, isMobile }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      backgroundImage: `url(${setBackgroundImage()})`, // Background image for the top section
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "20px",
      borderRadius: "12px",
      mb: isMobile ? 0 : 1, // Margin bottom to separate from other sections
      position: "relative", // To allow absolute positioning of child elements
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        mt: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start", // Adjust alignment to move the description up
          mt: 2,
        }}
      >
        <Typography
          variant="body3"
          sx={{
            color: "white",
            mr: 2,
            fontSize: isMobile ? "1.2rem" : "2rem",
          }}
        >
          {parsedWeatherData.weather[0].description.toUpperCase()}
        </Typography>
      </Box>
      <Box
        sx={{
          top: "20px",
          right: "20px",
          textAlign: "right",
          mb: 10,
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h2"
          sx={{ color: "white" }}
        >
          {parsedWeatherData?.name}
        </Typography>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h2"
          sx={{ color: "white" }}
        >
          {parsedWeatherData?.sys.country}
        </Typography>
      </Box>
    </Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        mt: 2,
        position: "relative",
      }}
    >
      <DigitalClock timeZone={parsedWeatherData?.timezone} />
      {parsedWeatherData && (
        <Typography
          variant="h3"
          component="h2"
          sx={{
            color: "white",
            textAlign: "right",
            fontSize: isMobile ? "1.5rem" : "2.5rem",
            position: "absolute",
            bottom: "10px",
            right: isMobile ? "0px" : "10px",
          }}
        >
          {parsedWeatherData.main.temp}°c
        </Typography>
      )}
    </Box>
  </Box>
);

export default WeatherHeader;
