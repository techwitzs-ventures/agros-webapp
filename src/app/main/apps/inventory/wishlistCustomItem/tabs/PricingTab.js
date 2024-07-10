import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import { FormControl, FormControlLabel, FormHelperText, Checkbox } from "@mui/material";
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';

function PricingTab(props) {

    const methods = useFormContext();

    const { control, formState, watch } = methods;
    const { errors } = formState;

    const user = useSelector(selectUser);

    const is_taxable = watch('is_taxable');

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
                                name="purchase_rate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label={`Purchase rate ( ${user.tenant_data.currency_code} )`}
                                        type="number"
                                        error={!!errors.purchase_rate}
                                        helperText={errors?.purchase_rate?.message}
                                        variant="outlined"
                                        required
                                    />
                                )}
                            />

                            <Controller
                                name="selling_rate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label={`Selling rate ( ${user.tenant_data.currency_code} )`}
                                        type="number"
                                        error={!!errors.selling_rate}
                                        helperText={errors?.selling_rate?.message}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />

                            <Controller
                                name="is_taxable"
                                control={control}
                                render={({ field }) => (
                                    <FormControl
                                        className="mb-24"
                                        error={!!errors.is_taxable}>
                                        <FormControlLabel
                                            label="Enable Tax"
                                            control={
                                                <Checkbox size="small" {...field} />
                                            }
                                        />
                                        <FormHelperText>{errors?.is_taxable?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />

                            {is_taxable && <Controller
                                name="tax_id"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Tax Id"
                                        type="text"
                                        error={!!errors.tax_id}
                                        helperText={errors?.tax_id?.message}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />}

                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default PricingTab;