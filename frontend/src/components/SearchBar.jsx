// SearchBar.jsx
// A simple reusable search input that can be used on any page.
// Just pass in the value, a function to update it, and a placeholder text.

import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ value, onChange, placeholder }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder || 'Search...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        )
      }}
    />
  );
}

export default SearchBar;
