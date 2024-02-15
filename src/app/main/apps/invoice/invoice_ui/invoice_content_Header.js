import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserByOrganizationId, selectUser } from "app/store/userSlice";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material";
import { getInvoice, selectInvoice } from "../store/invoice_Slice";
import FuseLoading from "@fuse/core/FuseLoading";
import InvoiceContentTable from "./invoice_content_Table";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import { selectOrganization } from "app/store/organizationSlice";

function InvoiceContentHeader(props) {

  const dispatch = useDispatch();
  const organizations=useSelector(selectOrganization)

  const [loading, setLoading] = useState(true)
  const [vendor,setVendor]=useState("");
  const routeparams = useParams();
  
  const { invoiceId, organizationId } = routeparams
  const invoice = useSelector(selectInvoice)

  useEffect(() => {
    if (invoiceId !== undefined && organizationId !== undefined) {
      dispatch(getInvoice({ org_id: organizationId, invoice_id: invoiceId })).then((response) => (
        dispatch(getUserByOrganizationId(response.payload.invoice_data.organization_id)).then((response)=>{
          setVendor(response.payload)
          setLoading(false)
        })))
    }
  }, [dispatch, routeparams])

  const getOrganization = (selectedId) => {
    const selectedOrganization = organizations.find(organization => organization.organization_id === selectedId);
    return selectedOrganization;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    )
  }
  return (

    <div className="inline-block p-24 sm:p-40 text-left print:p-0 w-full overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 3, y: 0 }}
        transition={{ bounceDamping: 0 }}
      >
        <Card className="w-xl p-64 mx-auto rounded-2xl shadow print:w-auto print:rounded-none print:shadow-none print:bg-transparent">
          <CardContent className="">

            <div className="flex items-start justify-between">
              <div className="grid grid-cols-2 gap-x-16 gap-y-1">
                <Typography
                  className="text-4xl tracking-tight"
                  color="text.secondary"
                >
                  INVOICE
                </Typography>
                <Typography className="text-4xl">{invoice.invoice_data.invoice_code}</Typography>
                <Typography
                  className="font-medium tracking-tight"
                  color="text.secondary"
                >
                  INVOICE DATE
                </Typography>
                <Typography className="font-medium">{
                  new Date(invoice.invoice_data.createdAt).toLocaleDateString("en-In", {
                    timeZone: "Asia/Kolkata",
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }</Typography>
                <Typography
                  className="font-medium tracking-tight"
                  color="text.secondary"
                >
                  DUE DATE
                </Typography>
                <Typography className="font-medium">{invoice.invoice_data.due_date}</Typography>
                <Typography
                  className="font-medium tracking-tight"
                  color="text.secondary"
                >
                  TOTAL DUE
                </Typography>
                <Typography className="font-medium">{invoice.invoice_data.total_due} {`(${getOrganization(vendor.organization_id).currency_code})`}</Typography>
              </div>

              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.dark,
                  color: (theme) => theme.palette.getContrastText(theme.palette.primary.dark),
                }}
                className="grid grid-cols-1 gap-x-32 -mr-64 py-24 px-32 rounded-l-2xl"
              >
                <Box
                  className="pl-40 text-md"
                  sx={{
                    borderColor: (theme) =>
                      alpha(theme.palette.getContrastText(theme.palette.primary.dark), 0.25),
                  }}
                >
                  <Typography className="font-medium">{`${vendor.firstname} ${vendor.lastname}`}</Typography>
                  <Typography>{vendor.address1}</Typography>
                  <Typography>{vendor.address2}</Typography>
                  <Typography>{vendor.mobilenumber}</Typography>
                  <Typography>{vendor.email}</Typography>
                </Box>
              </Box>
            </div>
            <div className="text-md">
              <Typography className="text-xl font-medium">{`${invoice.customer_data[0].firstname} ${invoice.customer_data[0].lastname}`}</Typography>
              <Typography>{invoice.sales_order_data.delivery_address}</Typography>
              <Typography>{invoice.customer_data[0].email}</Typography>
              <Typography>{invoice.customer_data[0].mobilenumber}</Typography>
            </div>
            <InvoiceContentTable salesorderitemdetails={invoice.sales_order_data} vendor={vendor}/>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default InvoiceContentHeader;
