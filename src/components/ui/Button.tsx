import { Button as MuiButton } from '@mui/material';
import React from 'react';

interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
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