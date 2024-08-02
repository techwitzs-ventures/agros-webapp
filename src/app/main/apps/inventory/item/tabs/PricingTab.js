import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";

function PricingTab(props) {

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
                                name="wholesalePrice"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label='Wholesale Price'
                                        type="number"
                                        disabled
                                        error={!!errors.wholesalePrice}
                                        helperText={errors?.wholesalePrice?.message}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />

                            <Controller
                                name="retailPrice"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label='Retail Price'
                                        type="number"
                                        disabled
                                        error={!!errors.retailPrice}
                                        helperText={errors?.retailPrice?.message}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />

                            <Controller
                                name="taxRate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label='Tax Rate'
                                        type="number"
                                        disabled
                                        error={!!errors.taxRate}
                                        helperText={errors?.taxRate?.message}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />

                            <Controller
                                name="taxId"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Tax Id"
                                        type="number"
                                        disabled
                                        error={!!errors.taxId}
                                        helperText={errors?.taxId?.message}
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

export default PricingTab;