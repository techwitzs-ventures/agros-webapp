import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function BasicPopover() {

  return (
    <div>
      <Link style={{ textDecoration: "none" }} to="/completeonboarding">
        <Button variant="contained" color='secondary'>
          Complete Onboarding
        </Button>
      </Link>
    </div>
  );
}