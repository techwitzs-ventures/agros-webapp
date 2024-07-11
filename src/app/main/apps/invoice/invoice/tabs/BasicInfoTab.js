import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText
} from "@mui/material";
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCustomers } from "../../../customers/store/customersSlice";

function BasicInfoTab(props) {

  const [Customers, setCustomers] = useState([])
  const [customerDetails, setcustomerDetails] = useState({
    email: '',
    mobilenumber: ''
  })
  const dispatch = useDispatch();

  const methods = useFormContext();
  const { control, formState, setValue } = methods;
  const { errors } = formState;

  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getCustomers({ tenant_id: user.tenant_id })).then((res) => {
      setCustomers(res.payload);
    })
  }, [dispatch])

  const getCustomerDetails = (customerId) => {
    const customer = Customers.find((customer) => customer.customer_id === customerId)
    setValue('stripe_customer_id', customer.stripe_customer_id);
    setcustomerDetails((prev) => ({ ...prev, email: customer.email, mobilenumber: customer.mobilenumber }))
  }

  return (
    <>
      <div>
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

            <div>Email</div>
            {customerDetails.email !== '' && <div>{customerDetails.email}</div>}
            <div>Mobile No.</div>
            {customerDetails.mobilenumber !== '' && <div>{customerDetails.mobilenumber}</div>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default BasicInfoTab;