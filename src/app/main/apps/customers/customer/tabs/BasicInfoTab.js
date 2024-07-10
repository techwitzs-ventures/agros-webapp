import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import { FormControl, MenuItem, Select } from "@mui/material";
import { InputLabel } from "@mui/material";


const Country = [
    { name: "singapore", countrycode: 'sg', mobcode: '+65', label: 'Singapore' },
    { name: "india", countrycode: 'in', mobcode: '+91', label: 'India' }
]

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
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Email"
                                        type="email"
                                        error={!!errors.email}
                                        helperText={errors?.email?.message}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />

                            <div className='flex justify-center items-center'>
                                <Controller
                                    name="countrycode"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl className="mb-24" sx={{ width: '100px', paddingRight: "5px" }} required>
                                            <InputLabel>Country</InputLabel>
                                            <Select
                                                {...field}
                                                label="Country code"
                                                error={!!errors.countrycode}
                                                variant='outlined'
                                            >
                                                {Country.map((country) => {
                                                    return (
                                                        <MenuItem key={country.countrycode} value={country.mobcode}>
                                                            {country.mobcode}
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="mobilenumber"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            className="mb-24"
                                            label="Mobile No"
                                            type="text"
                                            error={!!errors.mobilenumber}
                                            helperText={errors?.mobilenumber?.message}
                                            variant="outlined"
                                            required
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>

                            {<Controller
                                name="firstname"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mt-8 mb-16"
                                        required
                                        label="First Name"
                                        id="firstname"
                                        error={!!errors.firstname}
                                        helperText={errors?.firstname?.message}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />}

                            {<Controller
                                name="lastname"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mt-8 mb-16"
                                        required
                                        label="Last Name"
                                        id="lastname"
                                        error={!!errors.lastname}
                                        helperText={errors?.lastname?.message}
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

export default BasicInfoTab;