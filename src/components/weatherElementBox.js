import { Box, Typography } from "@mui/material";

// Boxes containing weather info along with icons
const WeatherElementBox = ({ icon: IconComponent, label, value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        gap: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: "4px",
        boxShadow: 1,
      }}
    >
      <IconComponent sx={{ color: "white", fontSize: "3rem" }} />
      <Typography variant="body1" sx={{ color: "white" }}>
        {label}: {value}
      </Typography>
    </Box>
  );

export default WeatherElementBox;