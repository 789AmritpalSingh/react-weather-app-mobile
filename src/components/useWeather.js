import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "@mui/material";
import { fetchCoordsByCity, fetchLocations, fetchWeatherDataByCoords } from "./api";
import { useJsApiLoader } from "@react-google-maps/api";
import backgroundWeatherImages from "./backgroundWeatherImages";

const libraries = ["places"];

// Component containing all the functionalities
const useWeather = () => {
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
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    const isMobile = useMediaQuery("(max-width:800px)"); //  for mobile screens
    const weatherIconGIF = process.env.PUBLIC_URL + "/images/WeatherIcons.gif"; // Importing the forecase image for the intial page loading
    const backgroundImage = process.env.PUBLIC_URL + "/images/background.jpg";
  
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
  

  return {
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
  };
};

export default useWeather;
