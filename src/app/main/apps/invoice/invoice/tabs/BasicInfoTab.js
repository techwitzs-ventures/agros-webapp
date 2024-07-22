import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCustomers } from "../../../customers/store/customersSlice";
import FuseLoading from "@fuse/core/FuseLoading";

function BasicInfoTab(props) {

  const [Customers, setCustomers] = useState([])
  const [customerDetails, setcustomerDetails] = useState({ email: '', mobilenumber: '' })
  const [loading, setloading] = useState(true)

  const dispatch = useDispatch();

  const methods = useFormContext();
  const { control, formState, setValue, watch } = methods;
  const { errors } = formState;

  const invoice_id = watch('invoice_id');
  const customer_id = watch('customer_id');

  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getCustomers({ tenant_id: user.tenant_id })).then((res) => {
      setCustomers(res.payload);
      setloading(false)
    })
  }, [dispatch])

  const getCustomerDetails = (customerId) => {
    const customer = Customers.find((customer) => customer.customer_id === customerId)
    setValue('stripe_customer_id', customer.stripe_customer_id);
    setcustomerDetails((prev) => ({ ...prev, email: customer.email, mobilenumber: customer.mobilenumber }))
  }

  if (loading) {
    return (
      <FuseLoading />
    )
  }

  return (
    <>
      <div className="w-full">
        <Card component={motion.div} className="flex mb-32">
          <CardContent className="flex flex-col flex-1 px-32 py-24">
            <form
              name="registerForm"
              noValidate
              className="flex flex-col"
            >

              {<Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <FormControl className="mb-24" required>
                    <InputLabel>Customer</InputLabel>
                    <Select
                      {...field}
                      label="Customer"
                      error={!!errors.customer_id}
                      required
                      disabled={invoice_id !== undefined ? true : false}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        getCustomerDetails(e.target.value)
                      }}
                      value={field.value}
                    >
                      {Customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.customer_id}>
                          {customer.firstname} {customer.lastname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />}

            </form>

            <motion.div
              className="flex flex-col sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                Email
              </Typography>
              {customerDetails.email !== '' ?
                <Typography variant="caption" className="font-medium my-2">
                  {customerDetails.email}
                </Typography> :
                <span className='my-12 flex items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0'>
                  <span style={{ borderBottom: "1px solid black" }} className='w-12'></span>
                </span>
              }
            </motion.div>

            <motion.div
              className="flex flex-col sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                Mobile No.
              </Typography>
              {customerDetails.mobilenumber !== '' ?
                <Typography variant="caption" className="font-medium my-2">
                  {customerDetails.mobilenumber.slice(0, 3)} {customerDetails.mobilenumber.slice(3)}
                </Typography> :
                <span className='my-12 flex items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0'>
                  <span style={{ borderBottom: "1px solid black" }} className='w-12'></span>
                </span>
              }
            </motion.div>

          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default BasicInfoTab;