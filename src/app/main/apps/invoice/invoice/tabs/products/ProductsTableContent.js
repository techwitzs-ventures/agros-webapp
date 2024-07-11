import FuseScrollbars from "@fuse/core/FuseScrollbars"
import { Table, TableBody, TableCell, TableRow, TextField } from "@mui/material"
import { useFieldArray, useFormContext, Controller, useWatch } from 'react-hook-form'
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import SinglePurchaseOrderTableHead from "./ProductsTableHeadContent"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { getWishlistItems } from "src/app/main/apps/inventory/store/wishlistItemsSlice";
import { selectItemsForPurchaseOrders, setItemsForPurchaseOrders } from "./store/itemlistforPO_Slice";


const SinglePurchaseOrderTableContent = () => {

    const methods = useFormContext();
    const { control, formState, getValues, setValue } = methods;
    const { errors } = formState
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'item_list',
    });
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const itemList = useSelector(selectItemsForPurchaseOrders);
    const itemList_array = useWatch({ name: 'item_list' });

    useEffect(() => {
        if (user) {
            const queryparams = {
                tenant_id: user.tenant_id,
                active: true
            }
            dispatch(getWishlistItems(queryparams)).then((response) => {
                dispatch(setItemsForPurchaseOrders(response.payload))
            })
        }
    }, [dispatch])

    const handleItemChange = (selected_item_id, index) => {
        const selectedItem = itemList.find((item) => item.item_id === selected_item_id);
        updateItemDetails(selectedItem, index);
    }

    const updateItemDetails = (selectedItem, index) => {
        setValue(`item_list[${index}].items_wishlist_id`, selectedItem.items_wishlist_id);
        setValue(`item_list[${index}].item_id`, selectedItem.item_id);
        setValue(`item_list[${index}].item_name`, selectedItem.item_name);
        setValue(`item_list[${index}].item_code`, selectedItem.item_code);
        setValue(`item_list[${index}].unit`, selectedItem.unit);
        setValue(`item_list[${index}].rate`, selectedItem.selling_rate);
    }

    const calculateAmount = (quantity, rate) => {
        const amount = quantity * rate
        return amount.toString();
    };

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
                    <SinglePurchaseOrderTableHead />
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
                                                    onChange={(e) => handleItemChange(e.target.value, index)}
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
                                                disabled={getValues(`item_list[${index}].item_id`) !== '' ? false : true}
                                                autoFocus={getValues(`item_list[${index}].item_id`) !== '' ? false : true}
                                                onChange={(e) => {
                                                    const newQuantity = e.target.value;
                                                    const rate = getValues(`item_list[${index}].rate`);
                                                    const amount = calculateAmount(newQuantity, rate);
                                                    setValue(`item_list[${index}].amount`, amount);
                                                    field.onChange(e);
                                                }}
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
                                                label={`Rate`}
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
                                                label={`Amount`}
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

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                    <IconButton className="mt-4" aria-label="delete" onClick={() => {
                                        for (let i = index; i < fields.length; i++) {
                                            const currentItemValues = getValues(`item_list[${i + 1}]`);
                                            if (currentItemValues) {
                                                setValue(`item_list[${i}].items_wishlist_id`, currentItemValues.items_wishlist_id || '');
                                                setValue(`item_list[${i}].item_id`, currentItemValues.item_id || '');
                                                setValue(`item_list[${i}].item_name`, currentItemValues.item_name || '');
                                                setValue(`item_list[${i}].item_code`, currentItemValues.item_code || '');
                                                setValue(`item_list[${i}].unit`, currentItemValues.unit || '');
                                                setValue(`item_list[${i}].rate`, currentItemValues.rate || '');
                                                setValue(`item_list[${i}].quantity`, currentItemValues.quantity || '');
                                                setValue(`item_list[${i}].amount`, currentItemValues.amount || '');
                                            }
                                        }
                                        remove(index)
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
                <Stack direction="row" spacing={2} justifyContent={"space-between"} className="px-16 mb-8 mt-4">
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => append(
                                {
                                    items_wishlist_id: '',
                                    item_id: '',
                                    item_name: '',
                                    item_code: '',
                                    unit: '',
                                    rate: '',
                                    quantity: '',
                                    amount: '',
                                }
                            )}
                        >
                            Add
                        </Button>
                    </Stack>
                    <div style={{ fontWeight: "bold" }}>
                        Total Amount: {calculateTotalAmount().toFixed(2)}
                    </div>
                </Stack>
            </FuseScrollbars>
        </div>
    )
}
export default SinglePurchaseOrderTableContent