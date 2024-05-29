import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useState, useEffect } from "react";
import moment from 'moment-timezone';

const timeZoneMapping = {
  '-43200': 'Etc/GMT+12',
  '-39600': 'Etc/GMT+11',
  '-36000': 'Etc/GMT+10',
  '-32400': 'Etc/GMT+9',
  '-28800': 'Etc/GMT+8',
  '-25200': 'Etc/GMT+7',
  '-21600': 'Etc/GMT+6',
  '-18000': 'Etc/GMT+5',
  '-14400': 'Etc/GMT+4',
  '-10800': 'Etc/GMT+3',
  '-7200': 'Etc/GMT+2',
  '-3600': 'Etc/GMT+1',
  '0': 'Etc/GMT',
  '3600': 'Etc/GMT-1',
  '7200': 'Etc/GMT-2',
  '10800': 'Etc/GMT-3',
  '14400': 'Etc/GMT-4',
  '18000': 'Etc/GMT-5',
  '19800': 'Asia/Kolkata',
  '21600': 'Etc/GMT-6',
  '25200': 'Etc/GMT-7',
  '28800': 'Etc/GMT-8',
  '32400': 'Etc/GMT-9',
  '36000': 'Etc/GMT-10',
  '39600': 'Etc/GMT-11',
  '43200': 'Etc/GMT-12',
};

const DigitalClock = ({ timeZone }) => {
  const [time, setTime] = useState(new Date());
  const isSmallScreen = useMediaQuery("(max-width: 800px)"); // Corrected media query

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatDate = (date, timeZone) => {

    const formattedDate = moment(date).tz(timeZone).format('dddd, D MMMM, YYYY');
    return formattedDate;
  };

  const formatTime = (date, timeZone) => {
    return moment(date).tz(timeZone).format('h:mm:ss A');
  };

  const mappedTimeZone = timeZoneMapping[timeZone] || 'Etc/GMT';

  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          color: "white",
          fontSize: isSmallScreen ? "1rem !important" : "1.8rem !important", // Adjust font size based on screen size with !important
        }}
      >
        {formatTime(time, mappedTimeZone)}
      </Typography>
      <Typography
        variant="h6"
        component="h3"
        sx={{
          color: "white",
          fontSize: isSmallScreen ? "0.8rem !important" : "1.5rem !important", // Adjust font size based on screen size with !important
        }}
      >
        {formatDate(time, mappedTimeZone)}
      </Typography>
    </Box>
  );
};

export default DigitalClock;
