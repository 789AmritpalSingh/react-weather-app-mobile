import React from "react";
import {Grid, Box, Button, Modal, IconButton } from "@mui/material";
import WeatherElementBox from "./weatherElementBox";
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto"; // For Feels like temperature
import ThermostatIcon from "@mui/icons-material/Thermostat"; // For Min Temperature
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WindPowerIcon from "@mui/icons-material/WindPower";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Brightness7, Compress, Loop, WbTwilight } from "@mui/icons-material";
import { convertDegreesToCompass, formatTime } from "./unitConverter";
import CloseIcon from "@mui/icons-material/Close";

// WeatherDetails component to display detailed weather information
const WeatherDetails = ({
  parsedWeatherData,
  showMoreDetails,
  setShowMoreDetails,
  isMobile,
}) => (
  <>
    <Grid container spacing={2} sx={{ mt: isMobile ? 0 : 0 }}>
      <Grid item xs={6} sm={3} md={3}>
        <WeatherElementBox
          icon={ThermostatAutoIcon}
          label="Feels like"
          value={`${parsedWeatherData.main.feels_like}°C`}
        />
      </Grid>
      <Grid item xs={6} sm={3} md={3}>
        <WeatherElementBox
          icon={ThermostatIcon}
          label="Min Temp"
          value={`${parsedWeatherData.main.temp_min}°C`}
        />
      </Grid>
      <Grid item xs={6} sm={3} md={3}>
        <WeatherElementBox
          icon={ThermostatIcon}
          label="Max Temp"
          value={`${parsedWeatherData.main.temp_max}°C`}
        />
      </Grid>
      <Grid item xs={6} sm={3} md={3}>
        <WeatherElementBox
          icon={WaterDropIcon}
          label="Humidity"
          value={`${parsedWeatherData.main.humidity}%`}
        />
      </Grid>
    </Grid>
    <Box>
      <Button
        onClick={() => setShowMoreDetails(true)}
        variant="contained"
        color="primary"
        sx={{
          mt: 3,
          padding: "5px 12px",
          fontSize: "1.25rem",
          minWidth: "150px",
        }}
      >
        {showMoreDetails ? "Less Details" : "More Details"}
      </Button>
      <Modal
        open={showMoreDetails}
        onClose={() => setShowMoreDetails(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: isMobile ? 10 : 0,
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(50, 50, 50, 0.8)",
            padding: 4,
            borderRadius: 2,
            width: isMobile ? "60%" : "50%",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setShowMoreDetails(false)}
            sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <WeatherElementBox
                icon={Loop}
                label="Wind Direction"
                value={`${convertDegreesToCompass(parsedWeatherData.wind.deg)}`}
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
                value={`${formatTime(parsedWeatherData.sys.sunrise)}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <WeatherElementBox
                icon={WbTwilight}
                label="Sunset"
                value={`${formatTime(parsedWeatherData.sys.sunset)}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <WeatherElementBox
                icon={Compress}
                label="Pressure"
                value={`${parsedWeatherData.main.pressure} hpa`}
                isMobile
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <WeatherElementBox
                icon={WindPowerIcon}
                label="Wind Speed"
                value={`${(parsedWeatherData.wind.speed * 3.6).toFixed()} km/h`}
                isMobile
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  </>
);

export default WeatherDetails;
