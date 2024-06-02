import { Box, Typography, useMediaQuery } from "@mui/material";

// Boxes containing weather info along with icons
const WeatherElementBox = ({ icon: IconComponent, label, value }) => {
  const isMobileSize = useMediaQuery("(max-width:700px)");

  const getIconColor = (label) => {
    switch (label) {
      case "Min Temp":
        return "skyblue";
      case "Max Temp":
        return "red";
      default:
        return "white";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        gap: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: "16px",
        boxShadow: 1,
        minHeight: isMobileSize ? "70px" : "90px", // Set a consistent minHeight
        minWidth: '0', // Ensures that the flex items don't overflow the container
      }}
    >
      <IconComponent sx={{ color: getIconColor(label), fontSize: isMobileSize ? "1.5rem" : "2.5rem" }} />
      <Typography variant={isMobileSize ? "body2" : "body1"} sx={{ color: "white" }}>
        {label}: {value}
      </Typography>
    </Box>
  );
};

export default WeatherElementBox;
