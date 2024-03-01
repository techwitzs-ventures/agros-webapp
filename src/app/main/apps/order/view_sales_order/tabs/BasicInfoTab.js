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
import { useDispatch } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import SingleSalesOrderTableContent from "../view_single_sales_order_Table_Content";
import { getAllOrganization, selectOrganization } from "app/store/organizationSlice";
import { selectUser } from "app/store/userSlice";

function BasicInfoTab(props) {

  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const customers = useSelector(selectOrganization)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(getAllOrganization()).then(() => setLoading(false))
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
                name={user.role === "buyer" ? "vendor_id" : "customer_id"}
                control={control}
                render={({ field }) => (
                  <FormControl className="mb-24" required>
                    <InputLabel>{user.role === "buyer" ? "Vendor Name" : "Customer Name"}</InputLabel>
                    <Select
                      {...field}
                      label="Customer Name"
                      error={!!errors.customer_id}
                      disabled
                    >
                      {customers.map((customer) => (
                        <MenuItem key={customer.organization_code} value={customer.organization_id}>
                          {`${customer.organization_name} ( ${customer.organization_code} )`}
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
                    disabled
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
                    disabled
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

export default BasicInfoTab;
