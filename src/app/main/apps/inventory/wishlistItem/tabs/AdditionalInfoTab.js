import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";

function AdditonalInfoTab(props) {

  const methods = useFormContext();
  const rootParams = useParams();
  const user = useSelector(selectUser);

  const { control, formState } = methods;
  const { errors } = formState;

  const { param1, param2 } = rootParams;

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

              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="SKU"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.sku}
                    helperText={errors?.sku?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="upc"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="UPC"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.upc}
                    helperText={errors?.upc?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="ean"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="EAN"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.ean}
                    helperText={errors?.ean?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="isbn"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="ISBN"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.isbn}
                    helperText={errors?.isbn?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="asinno"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="ASIN"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.asinno}
                    helperText={errors?.asinno?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="part_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Part Number"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.part_number}
                    helperText={errors?.part_number?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="hsn_or_sac"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="HSN or SAC"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.hsn_or_sac}
                    helperText={errors?.hsn_or_sac?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="sat_item_key_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="SAT Item Key Code"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.sat_item_key_code}
                    helperText={errors?.sat_item_key_code?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="unitkey_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Unit Key Code"
                    type="text"
                    disabled={param1 === "view" || user.role === "retailer" ? true : false}
                    error={!!errors.unitkey_code}
                    helperText={errors?.unitkey_code?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default AdditonalInfoTab;