import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip } from '@mui/material';
import { darken, lighten } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
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