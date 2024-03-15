import FuseScrollbars from "@fuse/core/FuseScrollbars"
import { Table, TableBody, TableCell, TableRow, TextField } from "@mui/material"
import { useFieldArray, useFormContext, Controller, useWatch } from 'react-hook-form'
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Stack from "@mui/material/Stack";
import SingleSalesOrderTableHead from "./view_single_sales_order_Table_Head"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { getAllItems, selectAllItems } from "app/store/allItemsSlice";

const SingleSalesOrderTableContent = () => {


    const methods = useFormContext();
    const { control, formState, setValue } = methods;
    const { errors } = formState
    const { fields } = useFieldArray({
        control,
        name: 'item_list',
    });
    
    const dispatch = useDispatch();
    const user = useSelector(selectUser)

    const itemList = useSelector(selectAllItems);
    const itemList_array = useWatch({ name: 'item_list' });

    useEffect(() => {
        if (user) {
            dispatch(getAllItems());
        }
    }, [dispatch])

    const calculateTotalAmount = () => {
        let totalAmount = 0;
        itemList_array.forEach((item) => {
            totalAmount += parseFloat(item.amount) || 0;
        });
        return totalAmount;
    };

    useEffect(() => {
        setValue('total_amount', calculateTotalAmount());
    }, [itemList_array, setValue]);


    return (
        <div className="w-full flex flex-col min-h-full">
            <FuseScrollbars className="grow overflow-x-auto">
                <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                    <SingleSalesOrderTableHead />
                    <TableBody>
                        {fields.map((item, index) => (
                            <TableRow key={index}>

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                    <Controller
                                        name={`item_list[${index}].item_id`}
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl className="mt-4" required>
                                                <InputLabel>Select Item</InputLabel>
                                                <Select
                                                    {...field}
                                                    label="Select Item"
                                                    error={errors?.item_list?.[index]?.item_id ? true : false}
                                                    className="w-full"
                                                    style={{ width: "200px" }}
                                                    size="small"
                                                    disabled
                                                >
                                                    {
                                                        itemList.length !== 0
                                                            ?
                                                            itemList.map((item) => (
                                                                <MenuItem key={item.id} value={item.item_id}>
                                                                    {item.item_name}
                                                                </MenuItem>
                                                            ))
                                                            :
                                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                <span>No items</span>
                                                            </div>
                                                    }
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </TableCell>

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                    <Controller
                                        name={`item_list[${index}].unit`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Unit"
                                                className="mt-4"
                                                type="text"
                                                error={errors?.item_list?.[index]?.unit ? true : false}
                                                helperText={errors?.item_list?.[index]?.unit?.message}
                                                size="small"
                                                disabled
                                                variant="outlined"
                                                required
                                            />
                                        )}
                                    />
                                </TableCell>

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                    <Controller
                                        name={`item_list[${index}].quantity`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Quantity"
                                                className="mt-4"
                                                type="text"
                                                error={errors?.item_list?.[index]?.quantity ? true : false}
                                                helperText={errors?.item_list?.[index]?.quantity?.message}
                                                variant="outlined"
                                                size="small"
                                                required
                                                disabled
                                            />
                                        )}
                                    />
                                </TableCell>

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                    <Controller
                                        name={`item_list[${index}].rate`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label={`Rate (${user.tenant_data.currency_code})`}
                                                className="mt-4"
                                                type="text"
                                                error={errors?.item_list?.[index]?.rate ? true : false}
                                                helperText={errors?.item_list?.[index]?.rate?.message}
                                                size="small"
                                                disabled
                                                variant="outlined"
                                                required
                                            />
                                        )}
                                    />
                                </TableCell>

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                    <Controller
                                        name={`item_list[${index}].amount`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label={`Amount (${user.tenant_data.currency_code})`}
                                                className="mt-4"
                                                type="text"
                                                error={errors?.item_list?.[index]?.amount ? true : false}
                                                helperText={errors?.item_list?.[index]?.amount?.message}
                                                size="small"
                                                disabled
                                                variant="outlined"
                                                required
                                            />
                                        )}
                                    />
                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
                <Stack direction="row" spacing={2} justifyContent={"space-between"} className="px-16 mb-8 mt-4">
                    <div style={{ fontWeight: "bold" }}>
                        Total Amount: {calculateTotalAmount().toFixed(2)} {`(${user.tenant_data.currency_code})`}
                    </div>
                </Stack>
            </FuseScrollbars>
        </div>
    )
}
export default SingleSalesOrderTableContent
