import React from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// SearchBar component for searching locations
const SearchBar = ({
  options,
  handleInputChange,
  handleOptionsChange,
  handleKeyDown,
  handleSubmit,
  isMobile,
}) => (
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
            borderRadius: "20px", // Increase the border radius
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
);

export default SearchBar;
