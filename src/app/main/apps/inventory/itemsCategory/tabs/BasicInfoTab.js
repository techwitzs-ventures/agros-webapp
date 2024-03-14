import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

function BasicInfoTab(props) {
  const methods = useFormContext();
  const { control, formState, getValues } = methods;
  const { errors } = formState;
  const val = getValues();

  return (
    <div>
      {val.items_cat_code !== undefined && <Controller
        name="items_cat_code"
        defaultValue={val.items_cat_code}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            disabled
            label="Items Category Code"
            id="items_cat_code"
            variant="outlined"
            fullWidth
          />
        )}
      />}
      <Controller
        name="items_cat_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.items_cat_name}
            required
            helperText={errors?.items_cat_name?.message}
            label="Name"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default BasicInfoTab;
