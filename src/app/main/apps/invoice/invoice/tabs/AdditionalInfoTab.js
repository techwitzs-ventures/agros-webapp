import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";

function AdditonalInfoTab(props) {

    const methods = useFormContext();
    const { control, formState, watch } = methods;
    const { errors } = formState;

    const invoice_id = watch('invoice_id')


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

                            <Controller
                                name="currency"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Currency"
                                        type="text"
                                        disabled={invoice_id !== undefined ? true : false}
                                        error={!!errors.currency}
                                        helperText={errors?.currency?.message}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />

                            <Controller
                                name="total_amount"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Total Amount"
                                        type="number"
                                        disabled
                                        error={!!errors.total_amount}
                                        helperText={errors?.total_amount?.message}
                                        variant="outlined"
                                        fullWidth
                                        required
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