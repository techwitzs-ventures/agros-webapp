import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";

function AdditonalInfoTab(props) {

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
                                name="ean13"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="EAN"
                                        type="text"
                                        disabled
                                        error={!!errors.ean13}
                                        helperText={errors?.ean13?.message}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="weight"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Weight"
                                        type="number"
                                        disabled
                                        error={!!errors.weight}
                                        helperText={errors?.weight?.message}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="height"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Height"
                                        type="number"
                                        disabled
                                        error={!!errors.height}
                                        helperText={errors?.height?.message}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="width"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Width"
                                        type="number"
                                        disabled
                                        error={!!errors.width}
                                        helperText={errors?.width?.message}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="depth"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Depth"
                                        type="number"
                                        disabled
                                        error={!!errors.depth}
                                        helperText={errors?.depth?.message}
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