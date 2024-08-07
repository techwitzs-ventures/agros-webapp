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
          <Typography className="text-2xl font-semibold leading-tight">Address Details</Typography>
        </div>

        <CardContent className="px-32 py-24">
          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">Address 1</Typography>
            <Typography>{user.data.address1 !== "" ? user.data.address1 : " - "}</Typography>
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">Address 2</Typography>
            <Typography>{user.data.address2 !== "" ? user.data.address2 : " - "}</Typography>
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">City</Typography>
            <Typography>{user.data.city !== "" ? user.data.city : " - "}</Typography>
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">State</Typography>
            <Typography>{user.data.state !== "" ? user.data.state : " - "}</Typography>
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">Country</Typography>
            <Typography>{user.data.country !== "" ? user.data.country : " - "}</Typography>
          </div>

          <div className="mb-24">
            <Typography className="font-semibold mb-4 text-15">Zip Code/Postal Code</Typography>
            <Typography>{user.data.zipCode !== "" ? user.data.zipCode : " - "}</Typography>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CheckAndFinish