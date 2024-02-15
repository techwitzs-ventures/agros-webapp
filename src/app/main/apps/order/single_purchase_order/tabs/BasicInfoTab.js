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
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { getVendorList } from "../../store/vendor_Slice"
import { selectVendorList } from "../../store/vendor_Slice";
import FuseLoading from "@fuse/core/FuseLoading";
import SinglePurchaseOrderTableContent from "../single_purchase_order_Table_Content";
import { useParams } from "react-router-dom";
import withReducer from "app/store/withReducer";
import reducer from "./store";

function BasicInfoTab(props) {

  const routeParams = useParams();
  const { purchaseorderId } = routeParams

  const methods = useFormContext();
  const { control, formState, setValue } = methods;
  const { errors } = formState;

  const dispatch = useDispatch()
  const vendors = useSelector(selectVendorList)
  const user = useSelector(selectUser);

  const [vendorDetails, setVendorDetails] = useState("")
  const [vendorListFieldDisabled, setVendorListFieldDisabled] = useState(false)

  useEffect(() => {
    if (user) {
      if (purchaseorderId === 'new') {
        setValue('delivery_address', user.data.address1)
        setVendorListFieldDisabled(false)
      } else {
        setVendorListFieldDisabled(true)
      }
      dispatch(getVendorList(user.organization_id))
    }
  }, [dispatch])

  const getVendorOrganization = (selectedVendorId) => {
    const selectedVendor = vendors.find(vendor => vendor.organization_id === selectedVendorId);
    setVendorDetails(selectedVendor)
    return selectedVendor ? selectedVendor.organization_name : '';
  };

  return (
    <>
      {vendors.length > 0 ? <div>
        <form
          name="registerForm"
          noValidate
          className="flex flex-col"
        >
          <Card component={motion.div} className="flex mb-16 max-w-3xl">
            <CardContent className="flex flex-col flex-1 px-32 py-24">

              <Controller
                name="vendor_id"
                control={control}
                render={({ field }) => (
                  <FormControl className="mb-24" required>
                    <InputLabel>Vendor Name</InputLabel>
                    <Select
                      {...field}
                      label="Vendor Name"
                      error={!!errors.vendor_id}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        getVendorOrganization(e.target.value)
                      }}
                      value={field.value}
                      /*when multiple plateform sellers or sellers are available then , the application 
                      will allow to select multiple vendors for creating the purchase order.*/
                      disabled              
                      // disabled={vendorListFieldDisabled}
                    >
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor.organization_code} value={vendor.organization_id}>
                          {`${vendor.organization_name} ( ${vendor.organization_code} )`}
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
                name="exp_delivery_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="mb-24"
                    label="Expected Delivery Date"
                    sx={{ width: "250px" }}
                    variant="outlined"
                    error={errors.exp_delivery_date}
                    helperText={errors.exp_delivery_date?.message}
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
              <SinglePurchaseOrderTableContent vendorDetails={vendorDetails} />
            </Card>
          </div>

        </form>
      </div > :
        <FuseLoading />
      }
    </>
  );
}

export default withReducer('poDetailsApp', reducer)(BasicInfoTab);