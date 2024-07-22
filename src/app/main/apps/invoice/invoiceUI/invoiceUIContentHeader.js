import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { selectUser } from "app/store/userSlice";
import { getInvoice, selectInvoice } from "../store/invoiceSlice";
import FuseLoading from "@fuse/core/FuseLoading";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import config from "src/appConfig";
import { getCustomer } from "../../customers/store/customerSlice";

function InvoiceContentHeader(props) {

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState({});
  const routeparams = useParams();

  const { invoiceId } = routeparams
  const invoice = useSelector(selectInvoice)

  useEffect(() => {
    if (invoiceId !== undefined) {
      dispatch(getInvoice({ invoice_id: invoiceId })).then((res) => {
        dispatch(getCustomer({ customer_id: invoice.customer_id })).then((res) => {
          setCustomer(res.payload)
          setLoading(false)
        })
      })
    }
  }, [dispatch, routeparams])


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
        animate={{ opacity: 1, y: 0 }}
        transition={{ bounceDamping: 0 }}
      >
        <Card className="w-xl p-64 mx-auto rounded-2xl shadow print:w-auto print:rounded-none print:shadow-none print:bg-transparent" style={{ backgroundColor: "#f1f5f9" }}>
          <CardContent className="">
            <div className="flex items-start">
              <div className="grid grid-rows-2 place-items-start gap-y-48">
                <div className="grid auto-cols-max grid-flow-col gap-x-32">
                  {/* <div className="place-self-center w-96">
                    <img className="w-96" src="assets/images/logo/logo.svg" alt="lozgo" />
                  </div> */}
                  <Typography
                    className="place-self-center w-96 text-center text-1xl font-semibold"
                    color="text.secondary"
                    style={{ color: "#004b1c" }}
                  >
                    {config.application_name}
                  </Typography>
                  <div className="pl-40 border-l text-md">
                    <Typography className="font-medium">{user.tenant_data.tenant_name}</Typography>
                    <Typography>{user.data.address1}, {user.data.zipCode}</Typography>
                    <Typography>{user.data.city}, {user.data.state}, {user.data.country}</Typography>
                    <Typography>{user.data.mobilenumber.slice(0, 3)} {user.data.mobilenumber.slice(3)}</Typography>
                    <Typography>{user.data.email}</Typography>
                  </div>
                </div>
                <div className="grid auto-cols-max grid-flow-col gap-x-32">
                  <Typography
                    className="place-self-center w-96 text-center text-2xl"
                    color="text.secondary"
                  >
                    Bill To
                  </Typography>
                  <div className="pl-40 border-l text-md">
                    {/* <Typography className="font-medium">Brian Hughes</Typography>
                    <Typography>9301 Wood Street</Typography>
                    <Typography>Philadelphia, PA 19111</Typography> */}
                    <Typography>{customer.countrycode} {customer.mobilenumber}</Typography>
                    <Typography>{customer.email}</Typography>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-16 gap-y-4 ml-auto">
                <Typography
                  className="justify-self-end text-4xl tracking-tight"
                  color="text.secondary"
                >
                  INVOICE
                </Typography>
                <Typography className="text-4xl">#{invoice.invoice_code}</Typography>
                <Typography
                  className="justify-self-end font-medium tracking-tight"
                  color="text.secondary"
                >
                  INVOICE DATE
                </Typography>
                <Typography className="font-medium">
                  {new Date(invoice.createdAt).toLocaleDateString("en-In", {
                    timeZone: "Asia/Kolkata",
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
                {/* <Typography
                  className="justify-self-end font-medium tracking-tight"
                  color="text.secondary"
                >
                  DUE DATE
                </Typography>
                <Typography className="font-medium">Aug 19, 2022</Typography> */}
                {/* <Typography
                  className="justify-self-end font-medium tracking-tight"
                  color="text.secondary"
                >
                  TOTAL DUE
                </Typography>
                <Typography className="font-medium">$49,000.00</Typography> */}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-x-4 mt-16">
              <Typography className="col-span-8 font-medium text-md" color="text.secondary">
                PRODUCT
              </Typography>
              <Typography className="font-medium text-md text-right" color="text.secondary">
                RATE
              </Typography>
              <Typography className="font-medium text-md text-right" color="text.secondary">
                QTY
              </Typography>
              <Typography
                className="col-span-2 font-medium text-md text-right"
                color="text.secondary"
              >
                TOTAL
              </Typography>

              {invoice.item_list.map((item) => (
                <React.Fragment key={item.item_id}>
                  <div className="col-span-12 my-16 border-b" />

                  <div className="col-span-8">
                    <Typography className="text-lg font-medium">{item.item_name}</Typography>
                    {/* <Typography className="mt-8 text-md" color="text.secondary">
Prototyping of the application's general workflow and the detailed design of its
72 screens as a working prototype.
</Typography> */}
                  </div>
                  <Typography className="self-center text-right">{item.rate}</Typography>
                  <Typography className="self-center text-right">{item.quantity}</Typography>
                  <Typography className="col-span-2 self-center text-right">{item.amount}</Typography>
                </React.Fragment>
              ))}

              <div className="col-span-12 mt-64" />

              <Typography
                className="col-span-10 self-center font-medium tracking-tight"
                color="text.secondary"
              >
                SUBTOTAL
              </Typography>
              <Typography className="col-span-2 text-right text-lg">{invoice.total_amount}</Typography>

              {/* <div className="col-span-12 my-12 border-b" />

              <Typography
                className="col-span-10 self-center font-medium tracking-tight"
                color="text.secondary"
              >
                TAX
              </Typography>
              <Typography className="col-span-2 text-right text-lg">$2,365.75</Typography> */}

              {/* <div className="col-span-12 my-12 border-b" />

              <Typography
                className="col-span-10 self-center font-medium tracking-tight"
                color="text.secondary"
              >
                DISCOUNT
              </Typography>
              <Typography className="col-span-2 text-right text-lg">$180.75</Typography> */}

              <div className="col-span-12 my-12 border-b" />

              <Typography
                className="col-span-10 self-center text-2xl font-medium tracking-tight"
                color="text.secondary"
              >
                TOTAL
              </Typography>
              <Typography className="col-span-2 text-right text-2xl font-medium">
                {invoice.total_amount}
              </Typography>
            </div>

            <div className="mt-64">
              <Typography className="font-medium">
                Please pay within 15 days. Thank you for your business.
              </Typography>
              <div className="flex items-start mt-16">
                <img className="flex-0 w-40 mt-8" style={{ backgroundColor: "#004b1c" }} src="assets/images/logo/logo.svg" alt="logo" />
                {/* <Typography className="ml-24 text-sm" color="text.secondary">
                  In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut ac congue
                  dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras aliquet facilisis
                  pellentesque. Nunc hendrerit quam at leo commodo, a suscipit tellus dapibus. Etiam
                  at felis volutpat est mollis lacinia. Mauris placerat sem sit amet velit mollis,
                  in porttitor ex finibus. Proin eu nibh id libero tincidunt lacinia et eget.
                </Typography> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default InvoiceContentHeader;
