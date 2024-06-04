import React from "react";
import { Snackbar, Alert } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const SnackbarAlerts = ({ open, message, onClose, isMobile }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }} // Positioning the snackbar to top center
  >
    <Alert
      onClose={onClose}
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
            style={{ color: "white", fontSize: isMobile ? "2rem" : "1.5rem" }}
          />
        ),
      }}
    >
      {message}
    </Alert>
  </Snackbar>
);

export default SnackbarAlerts;
