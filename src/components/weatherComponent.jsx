import React, { useEffect, useRef, useState } from "react";
import ErrorIcon from "@mui/icons-material/Error"; // Importing ErrorIcon
import weatherIconGIF from "./images/WeatherIcons.gif"; // Importing the forecast image
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import backgroundImage from "./images/background.jpg";
import DigitalClock from "./digitalClock";
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto"; // For Feels like temperature
import ThermostatIcon from "@mui/icons-material/Thermostat"; // For Min Temperature
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WindPowerIcon from "@mui/icons-material/WindPower";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Brightness7, Compress, Loop, WbTwilight } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search"; // Importing the search icon
import {
  fetchCoordsByCity,
  fetchLocations,
  fetchWeatherDataByCoords,
} from "./api";
import WeatherElementBox from "./weatherElementBox";
import { convertDegreesToCompass, formatTime } from "./utils";
import backgroundWeatherImages from "./backgroundWeatherImages";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

const Weather = () => {
  const [parsedWeatherData, setParsedWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [options, setOptions] = useState([]);
  const autocompleteServiceRef = useRef(null); // Ref to store autocomplete service instance
  // Snackbar showing the error message if the weather of the location is not found
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // Snackbar showing the error message if the location is not found
  const [snackbarOpen1, setSnackbarOpen1] = useState(false); // initially setting the snackbar as to be closed.
  const [snackbarMessage1, setSnackbarMessage1] = useState("");
  const selectedOptionRef = useRef(null); // Ref hook to store the selected option
  const [isLocationAllowed, setIsLocationAllowed] = useState(false); // Hook to store if user allowed location access or not
  const [isLocationBlocked, setIsLocationBlocked] = useState(false); // Hook to manage the status of the location blocking.
  const isMobile = useMediaQuery("(max-width:800px)"); //  for mobile screens
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAOCA-NU2T7UXdvE3rImCaN63P_vRGr368",
    libraries,
  });

  useEffect(() => {
    // useEffect will ask the user to know its current location on page render and when allowed will show the weather of his/her location on the page.
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const data = await fetchWeatherDataByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
        console.log("Data", data);
        setParsedWeatherData(data);
        setIsLocationAllowed(true); // location acess was provided
      },
      (error) => {
        // when the user blocks the location
        console.error("Error getting location: ", error);
        setIsLocationAllowed(false); // location access was denied
        setIsLocationBlocked(true);
      }
    );
  }, []);

  useEffect(() => {
    // Initialize the autocomplete service once the Google Maps API is loaded
    if (isLoaded && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleWeatherSearch = async (searchLocation) => {
    console.log("Location value", searchLocation);
    const geoData = await fetchCoordsByCity(searchLocation);
    console.log("Geo data", geoData);
    if (geoData.length > 0) {
      const weatherData = await fetchWeatherDataByCoords(
        geoData[0].lat,
        geoData[0].lon
      );
      console.log("Weather data ", weatherData);
      if (weatherData) {
        setParsedWeatherData(weatherData);
      } else {
        setSnackbarMessage(
          `Cannot find the weather details for location - ${searchLocation}`
        );
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage(
        `Cannot find the weather details for location - ${searchLocation}`
      );
      setSnackbarOpen(true);
    }
    console.log("Setting the location as null");
    setLocation(null); // Clearing the text field after hitting enter.
  };

  const setBackgroundImage = () => {
    // function to set the background image according to the weather
    const condition = parsedWeatherData?.weather[0].main;
    return (
      backgroundWeatherImages[condition] || backgroundWeatherImages["Clear"]
    ); // If the type of weather not found then setting Clear weather background image
  };

  // Function to handle the change in input, like when the user types in the search bar, it provides the matching locations
  const handleInputChange = async (event, newInputValue, reason) => {
    const locations = await fetchLocations(newInputValue);
    // Below setting the options hook with the location
    console.log(
      `Location found in onInputChange from the fetch location - ${JSON.stringify(
        locations
      )}`
    );
    setOptions(locations);
    // Below setting the location because when manually typed without selecting from the autocomplete and hitting enter, onKeyDown executes first and later onChange, leading to empty location passed.
    // So below location is being set as soon as there is any change in the input.
    if (reason === "input") {
      setLocation({ label: newInputValue });
    }
  };

  // Below function handles any change in the input field
  const handleOptionsChange = (event, newValue) => {
    if (typeof newValue === "string") {
      // Below gives a string and this happens when user types something by itself and hit enters
      console.log(
        `Setting location on change as string - ${JSON.stringify(newValue)}`
      );
      setLocation({ label: newValue });
    } else {
      // Below gives an object , and this happens when user selects something from the autocomplete option
      // The object contains the key - label so no need to add label key here
      console.log(
        `Setting location on change not string - ${JSON.stringify(newValue)}`
      );
      setLocation(newValue);
    }
    selectedOptionRef.current = newValue; // Store the selected option from the dropdown in the ref
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Now after hitting the enter key, selectedOptionRef checks if search value from the dropdown, if not from dropdown then it gets the location from location.label and if nothing is entered then searchValue is empty, then it goes to else block
      event.preventDefault();
      setTimeout(() => {
        const searchValue =
          selectedOptionRef.current && selectedOptionRef.current.label
            ? selectedOptionRef.current.label
            : location?.label;

        console.log(`Search value found - ${searchValue}`);
        if (searchValue) {
          handleWeatherSearch(searchValue);
        } else {
          console.log("Please enter something to search weather data for.");
          setSnackbarMessage1(
            `Please enter something to search weather data for`
          );
          setSnackbarOpen1(true);
        }
      }, 100); // Short delay to allow selection to register
    }
  };

  const handleSubmit = (event) => {
    // function for handling the search in the phone, because in phone users can't press enter, so pressing search icon will trigger search
    console.log("Handle submit called.");
    event.preventDefault(); // preventing form from submitting
    const searchValue =
      selectedOptionRef.current && selectedOptionRef.current.label
        ? selectedOptionRef.current.label
        : location?.label;

    console.log(`Search value found - ${searchValue}`);
    if (searchValue) {
      handleWeatherSearch(searchValue);
    } else {
      console.log("Please enter something to search weather data for.");
      setSnackbarMessage1(`Please enter something to search weather data for`);
      setSnackbarOpen1(true);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        minHeight: "100vh",
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setSnackbarOpen(false);
          }}
          severity="error"
          sx={{
            width: isMobile ? "100%" : "70%",
            backgroundColor: "red",
            color: "white",
            fontSize: isMobile ? "1.2rem" : "1rem",
          }}
          iconMapping={{
            error: (
              <ErrorIcon
                style={{
                  color: "white",
                  fontSize: isMobile ? "2rem" : "1.5rem",
                }}
              />
            ),
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbarOpen1}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbarOpen1(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setSnackbarOpen1(false);
          }}
          severity="error"
          sx={{
            width: isMobile ? "100%" : "70%",
            backgroundColor: "red",
            color: "white",
            fontSize: isMobile ? "1.2rem" : "1rem",
          }}
          iconMapping={{
            error: (
              <ErrorIcon
                style={{
                  color: "white",
                  fontSize: isMobile ? "2rem" : "1.5rem",
                }}
              />
            ),
          }}
        >
          {snackbarMessage1}
        </Alert>
      </Snackbar>
      {!isLocationAllowed && (
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
            <img
              src={weatherIconGIF}
              alt="Forecast"
              style={{ width: "100%" }}
            />
            <Typography variant="h6">
              Loading the weather information...
            </Typography>

            {isLocationBlocked && (
              <Typography variant="h6" sx={{ mt: 2 }}>
                Location access is currently blocked. Please enable location
                access in your browser settings and reload the page to view
                weather data for your current location.
              </Typography>
            )}
          </Paper>
        </Box>
      )}
      {isLocationAllowed && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
        >
          <Container maxWidth="lg">
            <Card
              sx={{
                opacity: 1,
                padding: "20px",
                mt: 3,
                backgroundColor: "rgba(50, 50, 50, 0.8)", // Overall gray background with opacity
                height: "auto",
                mb: 2,
                maxHeight: "90vh", // Limit height to make it scrollable
                overflowY: "auto", // Enable vertical scrolling
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
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
                        mb: 2,
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

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <Autocomplete
                    freeSolo
                    disableClearable
                    options={options?.map((option) => option)}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label || ""
                    }
                    onInputChange={handleInputChange}
                    onChange={handleOptionsChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Location"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          type: "search",
                          style: {
                            fontSize: "1rem",
                            color: "white",
                            backgroundColor: "black",
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleSubmit}>
                                <SearchIcon style={{ color: "white" }} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "1rem",
                            backgroundColor: "black",
                            color: "white",
                          },
                        }}
                        onKeyDown={handleKeyDown}
                      />
                    )}
                    sx={{
                      width: isMobile ? "100%" : "50%", // Adjust width based on screen size
                      mr: isMobile ? 0 : 2, // Margin right for spacing in non-mobile view
                    }}
                  />
                </Box>

                {parsedWeatherData && (
                  <Grid container spacing={2} sx={{ mt: isMobile ? 0 : 0 }}>
                    <Grid item xs={12} sm={6} md={6}>
                      <WeatherElementBox
                        icon={ThermostatAutoIcon}
                        label="Feels like"
                        value={`${parsedWeatherData.main.feels_like}°C`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <WeatherElementBox
                        icon={() => (
                          <ThermostatIcon
                            sx={{ color: "skyblue", fontSize: "3rem" }}
                          />
                        )}
                        label="Min Temp"
                        value={`${parsedWeatherData.main.temp_min}°C`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <WeatherElementBox
                        icon={() => (
                          <ThermostatIcon
                            sx={{ color: "red", fontSize: "3rem" }}
                          />
                        )}
                        label="Max Temp"
                        value={`${parsedWeatherData.main.temp_max}°C`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <WeatherElementBox
                        icon={WaterDropIcon}
                        label="Humidity"
                        value={`${parsedWeatherData.main.humidity}%`}
                      />
                    </Grid>
                  </Grid>
                )}
                {parsedWeatherData && (
                  <Box>
                    <Button
                      onClick={() => setShowMoreDetails(true)}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      {showMoreDetails ? "Less Details" : "More Details"}
                    </Button>
                    <Modal
                      open={showMoreDetails}
                      onClose={() => {
                        setShowMoreDetails(false);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "rgba(50, 50, 50, 0.8)",
                          padding: 4,
                          borderRadius: 2,
                          width: isMobile ? "60%" : "40%",
                          maxHeight: "90vh",
                          overflowY: "auto",
                          position: "relative", // Ensure positioning for the close button
                        }}
                      >
                        <IconButton
                          onClick={() => setShowMoreDetails(false)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "white"
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={6}>
                            <WeatherElementBox
                              icon={Loop}
                              label="Wind Direction"
                              value={`${convertDegreesToCompass(
                                parsedWeatherData.wind.deg
                              )}`}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={6}>
                            <WeatherElementBox
                              icon={VisibilityIcon}
                              label="Visibility"
                              value={`${parsedWeatherData.visibility}m`}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={6}>
                            <WeatherElementBox
                              icon={Brightness7}
                              label="Sunrise"
                              value={`${formatTime(
                                parsedWeatherData.sys.sunrise
                              )}`}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={6}>
                            <WeatherElementBox
                              icon={WbTwilight}
                              label="Sunset"
                              value={`${formatTime(
                                parsedWeatherData.sys.sunset
                              )}`}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={6}>
                            <WeatherElementBox
                              icon={Compress}
                              label="Pressure"
                              value={`${parsedWeatherData.main.pressure} hpa`}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={6}>
                            <WeatherElementBox
                              icon={WindPowerIcon}
                              label="Wind Speed"
                              value={`${(
                                parsedWeatherData.wind.speed * 3.6
                              ).toFixed()} km/h`}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Container>
        </Box>
      )}
    </div>
  );
};

export default Weather;
