import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, RadioGroup, Radio, FormHelperText } from "@mui/material";
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { Units } from "app/configs/unitConfig";
import { selectAllItemsCategories } from "app/store/allItemsCategoriesSlice";

function BasicInfoTab(props) {

  const methods = useFormContext();

  const { control, formState, getValues, watch, setValue } = methods;
  const { errors } = formState;

  const val = getValues();
  const products = useSelector(selectAllItemsCategories);
  const user = useSelector(selectUser);

  const getSelectedCategoryName = (categoryid) => {

    const selectedcategoryname = products.find((category) => category.items_cat_id === categoryid);

    setValue('items_cat_name', selectedcategoryname.items_cat_name);

  }

  const form = watch();
  console.log(form)
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

              {val.item_code !== undefined && <Controller
                name="item_code"
                defaultValue={val.item_code}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    required
                    disabled
                    label="Item Code"
                    id="item_code"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />}

              <Controller
                name="product_type"
                control={control}
                render={({ field }) => (
                  <FormControl className="mb-24" required>
                    <span>Product Type</span>
                    <RadioGroup {...field} row aria-label="product_type" name="product_type">
                      <FormControlLabel
                        value="goods"
                        control={<Radio />}
                        label="Goods"
                      />
                      <FormControlLabel
                        value="service"
                        control={<Radio />}
                        label="Service"
                      />
                    </RadioGroup>
                    <FormHelperText>{errors?.product_type?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="item_type"
                control={control}
                render={({ field }) => (
                  <FormControl className="mb-24" required>
                    <span>Item Type</span>
                    <RadioGroup {...field} row aria-label="item_type" name="item_type">
                      <FormControlLabel
                        value="inventory"
                        control={<Radio />}
                        label="Inventory"
                      />
                      <FormControlLabel
                        value="sales"
                        control={<Radio />}
                        label="Sales"
                      />
                      <FormControlLabel
                        value="purchase"
                        control={<Radio />}
                        label="Purchase"
                      />
                    </RadioGroup>
                    <FormHelperText>{errors?.item_type?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="items_cat_id"
                control={control}
                render={({ field }) => (
                  <FormControl className="mb-24" required>
                    <InputLabel>Items Category</InputLabel>
                    <Select
                      {...field}
                      label="Items Category"
                      error={!!errors.items_cat_id}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        getSelectedCategoryName(e.target.value)
                      }}
                      value={field.value}
                    >
                      {products.map((itemcategory) => (
                        <MenuItem key={itemcategory.id} value={itemcategory.items_cat_id}>
                          {itemcategory.items_cat_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="item_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Name"
                    type="text"
                    error={!!errors.item_name}
                    helperText={errors?.item_name?.message}
                    variant="outlined"
                    fullWidth
                    required
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Description"
                    type="text"
                    multiline
                    error={!!errors.description}
                    helperText={errors?.description?.message}
                    rows={5}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <FormControl className="mb-24" required>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      {...field}
                      label="Unit"
                      error={!!errors.unit}
                    >
                      {Units.map((units) => (
                        <MenuItem key={units.id} value={units.value}>
                          {units.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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