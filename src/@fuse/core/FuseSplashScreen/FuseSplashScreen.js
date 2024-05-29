import { memo } from 'react';
import Box from '@mui/material/Box';
import config from '../../../app/configs/navigation-i18n/en'

function FuseSplashScreen() {
  return (
    <div id="fuse-splash-screen">
      <div className="logo text-7xl font-bold">
        {/* <img width="128" src="assets/images/logo/logo.svg" alt="logo" /> */}
        {config.APPLICATION_NAME}
      </div>
      <Box
        id="spinner"
        sx={{
          '& > div': {
            backgroundColor: 'palette.secondary.main',
          },
        }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </Box>
    </div>
  );
}

export default memo(FuseSplashScreen);
