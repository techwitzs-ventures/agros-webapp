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

export default function BasicPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const user = useSelector(selectUser);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" color='secondary' onClick={handleClick}>
        Complete Onboarding
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div sx={{ p: 8 }} style={{ width: "300px", maxWidth: "300px" }}>
          <div className={clsx('w-full')} style={{ width: '60%', display: 'flex', justifyContent: 'center', marginLeft: "20%" }}>
            <div>
              <Chip
                className="font-semibold text-12"
                style={{ marginTop: "20px" }}
                label={user.data.mobilenumber}
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light'
                      ? darken("#2196f3", 0.4)
                      : lighten("#2196f3", 0.8),
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? lighten("#2196f3", 0.8)
                      : darken("#2196f3", 0.1),
                }}
                size="small"
              />
              <Chip
                className="font-semibold text-12"
                label={user.data.email}
                style={{ marginTop: "10px", marginBottom: "20px" }}
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light'
                      ? darken("#2196f3", 0.4)
                      : lighten("#2196f3", 0.8),
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? lighten("#2196f3", 0.8)
                      : darken("#2196f3", 0.1),
                }}
                size="small"
              />
            </div>
            <div style={{ marginLeft: "20px" }}>
              <span style={{ display: "flex", marginTop: "20px" }}>
                <FuseSvgIcon className="text-green-600" size={20}>
                  heroicons-solid:badge-check
                </FuseSvgIcon>
                <span style={{ marginLeft: "2px", color: "green" }}>Verified</span>
              </span>
              <span style={{ display: "flex", marginTop: "10px", marginBottom: "20px" }}>
                <FuseSvgIcon className="text-green-600" size={20}>
                  heroicons-solid:badge-check
                </FuseSvgIcon>
                <span style={{ marginLeft: "2px", color: "green" }}>Verified</span>
              </span>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}