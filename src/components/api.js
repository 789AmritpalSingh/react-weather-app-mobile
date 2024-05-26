import { v4 as uuidv4 } from "uuid";

// Below is the api key for the openweathermap api for fetching the weather data according to the location
const API_KEY = '2e10c98182ed4cd10e0b48369322f4f8';

export const fetchCoordsByCity = async (location) => {
    // Fetching Coordinates of city i.e. longitude and latitude and using them later to get the weather of the city.
    const geoLocationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${API_KEY}`;
    const response = await fetch(geoLocationUrl);
    return await response.json();
};

export const fetchWeatherDataByCoords = async (lat, lon) => {
    // Fetching the current weather data by longitude and latitude of the location
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(weatherUrl);
    return await response.json();
};

export const fetchLocations = async (input) => {
    return new Promise((resolve, reject) => {
        // Check if the input length is greater than 1 and if the Google Maps Places library is available
        if (input.length > 1 && window.google.maps.places) {
            const autocompleteService = new window.google.maps.places.AutocompleteService();
            // Use the AutocompleteService to get place predictions based on the input
            autocompleteService.getPlacePredictions(
                { input, types: ["(cities)"], componentRestrictions: { country: [] } },
                (predictions, status) => {
                    // Check if the status is OK and predictions are available
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        // Format the predictions into a structured array of options
                        const formattedOptions = predictions.map((prediction, index) => ({
                            key: `${uuidv4()}-${index}-${prediction.place_id}`, // Unique key for each option
                            label: prediction.description, // The label to display in the dropdown
                            place_id: prediction.place_id, // The place ID for further details if needed
                        }));
                        resolve(formattedOptions); // Resolve the promise with the formatted options
                    } else {
                        resolve([]); // Resolve with an empty array if no predictions are found
                    }
                }
            );
        } else {
            resolve([]); // Resolve with an empty array if the input is too short or Places library is unavailable
        }
    });
};