import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";

function BasicInfoTab(props) {

  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

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
                name='productInfo[0].name'
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    required
                    disabled
                    label="Name"
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="SKU"
                    type="text"
                    disabled
                    error={!!errors.sku}
                    helperText={errors?.sku?.message}
                    variant="outlined"
                    fullWidth
                    required
                  />
                )}
              />

              <Controller
                name='productInfo[0].description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Description"
                    type="text"
                    disabled
                    multiline
                    error={!!errors.description}
                    helperText={errors?.description?.message}
                    rows={10}
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

export default BasicInfoTab;