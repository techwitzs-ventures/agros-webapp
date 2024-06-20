import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import withRouter from '@fuse/core/withRouter';

function ConfirmOnboarding(props) {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

    return (
        <FusePageCarded
            content={

                <Box
                    className="h-full"
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '& > :not(style)': {
                            m: 1,
                            width: 700,
                            height: 400,
                        },
                    }}
                >
                    <Paper elevation={3} className='flex flex-col justify-center items-center'>
                        <Box className='flex flex-col lg:justify-center md:justify-center sm:justify-start items-center'>
                            <Typography
                                component={motion.span}
                                initial={{ x: -20 }}
                                animate={{ x: 0, transition: { delay: 0.2 } }}
                                delay={300}
                                className="text-24 md:text-32 font-extrabold tracking-tight"
                            >
                                Onboarding is not completed!
                            </Typography>
                            <Typography
                                component={motion.span}
                                initial={{ x: -20 }}
                                animate={{ x: 0, transition: { delay: 0.2 } }}
                                delay={300}
                                className="text-20 md:text-20 font-semibold tracking-tight"
                            >
                                Please confirm to complete Onboarding process
                            </Typography>
                            <Box className="w-full sm:mt-1 md:mt-2 mt-4" display={'flex'}>
                                <Button variant='contained' size='medium' color='secondary' onClick={()=>props.navigate("/completeonboarding")}>
                                    Confirm
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>


            }
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default withRouter(ConfirmOnboarding)
