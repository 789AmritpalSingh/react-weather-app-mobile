import React from "react";
import {
  Box,
  Container,
} from "@mui/material";
import LocationPrompt from "./LocationPrompt";
import WeatherHeader from "./WeatherHeader";
import SearchBar from "./SearchBar";
import SnackbarAlerts from "./SnackbarAlerts";
import WeatherDetails from "./WeatherDetails";
import useWeather from "./useWeather";

// Main component responsible for rendering the weather app ui
const Weather = () => {
  const {
    parsedWeatherData,
    options,
    isLocationAllowed,
    isLocationBlocked,
    isMobile,
    weatherIconGIF,
    backgroundImage,
    snackbarOpen,
    snackbarMessage,
    snackbarOpen1,
    snackbarMessage1,
    showMoreDetails,
    setShowMoreDetails,
    setSnackbarOpen,
    setSnackbarOpen1,
    handleInputChange,
    handleOptionsChange,
    handleKeyDown,
    handleSubmit,
    setBackgroundImage,
  } = useWeather();

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <SnackbarAlerts // Snackbar alert message if the weather details are not found for entered location.
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        isMobile={isMobile}
      />
      <SnackbarAlerts // Snackbar for alert message if the user has not entered anything in the search bar and try searching.
        open={snackbarOpen1}
        message={snackbarMessage1}
        onClose={() => setSnackbarOpen1(false)}
        isMobile={isMobile}
      />
      {!isLocationAllowed && ( // When the user has not allowed the location yet.
        <LocationPrompt
          weatherIconGIF={weatherIconGIF}
          isLocationBlocked={isLocationBlocked}
        />
      )}
      {isLocationAllowed && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
          sx={{
            mt: -4, // Reduce the margin from the top, adjust this value as needed
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                opacity: 1,
                padding: "10px",
                height: "auto",
                maxHeight: "90vh", // Limit height to make it scrollable
                overflowY: "auto", // Enable vertical scrolling
              }}
            >
              <WeatherHeader
                parsedWeatherData={parsedWeatherData}
                setBackgroundImage={setBackgroundImage}
                isMobile={isMobile}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <SearchBar
                  options={options}
                  handleInputChange={handleInputChange}
                  handleOptionsChange={handleOptionsChange}
                  handleKeyDown={handleKeyDown}
                  handleSubmit={handleSubmit}
                  isMobile={isMobile}
                />
              </Box>

              {parsedWeatherData && (
                <WeatherDetails
                  parsedWeatherData={parsedWeatherData}
                  showMoreDetails={showMoreDetails}
                  setShowMoreDetails={setShowMoreDetails}
                  isMobile={isMobile}
                />
              )}
            </Box>
          </Container>
        </Box>
      )}
    </div>
  );
};

export default Weather;
