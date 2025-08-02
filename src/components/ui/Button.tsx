import { Button as MuiButton } from '@mui/material';
import React from 'react';

const Button = ({ children, ...props }) => {
  return (
    <MuiButton 
      variant="contained" 
      className="rounded-lg"
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;