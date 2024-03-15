import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useFormContext, Controller } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import { parseISO } from 'date-fns'
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { useDispatch } from "react-redux";
import { getVendorList } from "../../store/vendor_Slice"
import { selectVendorList } from "../../store/vendor_Slice";
import FuseLoading from "@fuse/core/FuseLoading";
import SingleSalesOrderTableContent from "../single_sales_order_Table_Content";
import { useParams } from "react-router-dom";
import withReducer from "app/store/withReducer";
import reducer from "./store";

function BasicInfoTab(props) {

  const routeParams = useParams();
  const { salesorderId } = routeParams

  const methods = useFormContext();
  const { control, formState, setValue } = methods;
  const { errors } = formState;

  const dispatch = useDispatch()
  const customers = useSelector(selectVendorList)
  const user = useSelector(selectUser);

  const [customerListFieldDisabled, setCustomerListFieldDisabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      if (salesorderId === 'new') {
        setValue('delivery_address', user.data.address1)
        setCustomerListFieldDisabled(false)
      } else {
        setCustomerListFieldDisabled(true)
      }
      dispatch(getVendorList(user.tenant_id)).then(() => setLoading(false))
    }
  }, [dispatch])

  if (loading) {
    return (
      <FuseLoading />
    )
  }

  return (
    <>
      <div>
        <form
          name="registerForm"
          noValidate
          className="flex flex-col"
        >
          <Card component={motion.div} className="flex mb-16 max-w-3xl">
            <CardContent className="flex flex-col flex-1 px-32 py-24">

              <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <FormControl className="mb-24" required>
                    <InputLabel>Customer Name</InputLabel>
                    <Select
                      {...field}
                      label="Customer Name"
                      error={!!errors.customer_id}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      value={field.value}
                      disabled={customerListFieldDisabled}
                    >
                      {customers.map((customer) => (
                        <MenuItem key={customer.tenant_code} value={customer.tenant_id}>
                          {`${customer.tenant_name} ( ${customer.tenant_code} )`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="delivery_address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    id="outlined-multiline-static"
                    multiline
                    label="Delivery Address"
                    type="text"
                    rows={4}
                    error={!!errors.delivery_address}
                    helperText={errors?.delivery_address?.message}
                    variant="outlined"
                    required
                  />
                )}
              />

              <Controller
                name="exp_shipment_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="mb-24"
                    label="Expected Shipment Date"
                    sx={{ width: "250px" }}
                    variant="outlined"
                    error={errors.exp_shipment_date}
                    helperText={errors.exp_shipment_date?.message}
                    value={field.value ? parseISO(field.value) : null}
                    onChange={(date) => field.onChange(date.toISOString())}
                    required
                  />
                )}
              />
            </CardContent>
          </Card >

          <div>
            <Card component={motion.div} className="flex flex-col mb-24">
              <Typography className="text-15 md:text-15 font-extrabold tracking-tight ms-16 p-4">
                Item Table
              </Typography>
              <SingleSalesOrderTableContent />
            </Card>
          </div>

        </form>
      </div >
    </>
  );
}

export default withReducer('soDetailsApp', reducer)(BasicInfoTab);
