import FuseSvgIcon from '@fuse/core/FuseSvgIcon'
import { Card, CardContent, Typography } from '@mui/material'
import { selectUser } from 'app/store/userSlice'
import { motion } from 'framer-motion'
import React from 'react'
import { useSelector } from 'react-redux'

const CheckAndFinish = (props) => {

  const user = useSelector(selectUser)
  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full">
      <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
        <Card component={motion.div} variants={item} className="w-full mb-32">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">
              General Information
            </Typography>
          </div>

          <CardContent className="px-32 py-24">
            <div className="mb-24">
              <div className='flex items-center mb-4'>
                <Typography className="font-semibold text-15">Mobile Number</Typography>
                <FuseSvgIcon className="ms-8" sx={{ color: "#004b1c" }} size={20}>
                  heroicons-solid:badge-check
                </FuseSvgIcon>
              </div>
              <Typography>{user.data.mobilenumber}</Typography>
            </div>

            <div className="mb-24">
              <div className='flex items-center mb-4'>
                <Typography className="font-semibold text-15">Email</Typography>
                <FuseSvgIcon className="ms-8" sx={{ color: "#004b1c" }} size={20}>
                  heroicons-solid:badge-check
                </FuseSvgIcon>
              </div>
              <Typography>{user.data.email}</Typography>
            </div>
          </CardContent>
        </Card>

        <Card component={motion.div} variants={item} className="w-full mb-32">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">Professional Details</Typography>
          </div>

          <CardContent className="px-32 py-24">
            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Your Website</Typography>
              <Typography>{props.stripeAccountDetails.business_profile.url}</Typography>
            </div>

            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Other information provided</Typography>
              <Typography>{}</Typography>
            </div>
          </CardContent>
        </Card>

        <Card component={motion.div} variants={item} className="w-full mb-32">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">Public Details</Typography>
          </div>

          <CardContent className="px-32 py-24">
            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Customer support information</Typography>
              <Typography>{props.stripeAccountDetails.business_profile.support_phone}</Typography>
            </div>

            <div className="mb-24">
              <Typography className="font-semibold mb-4 text-15">Descriptor shown on customer statements</Typography>
              <Typography>{props.stripeAccountDetails.business_profile.url.toUpperCase()}</Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default CheckAndFinish