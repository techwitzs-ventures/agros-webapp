import _ from "@lodash";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import { selectOrganization } from "app/store/organizationSlice";

function InvoiceContentTable({ salesorderitemdetails, vendor }) {

  const organizations=useSelector(selectOrganization);
  
  const getOrganization = (selectedId) => {
    const selectedOrganization = organizations.find(organization => organization.organization_id === selectedId);
    return selectedOrganization;
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-x-4 mt-48">
        <div className="col-span-4 font-medium text-md" color="text.secondary">
          ITEM
        </div>
        <div className="col-span-2 font-medium text-md text-left" color="text.secondary">
          UNIT
        </div>
        <div className="col-span-2 font-medium text-md text-left" color="text.secondary">
          QTY
        </div>
        <div className="col-span-2 font-medium text-md text-left" color="text.secondary">
          RATE {`(${getOrganization(vendor.organization_id).currency_code})`}
        </div>
        <div
          className="col-span-2 font-medium text-md text-left"
          color="text.secondary"
        >
          AMOUNT {`(${getOrganization(vendor.organization_id).currency_code})`}
        </div>

        <div className="col-span-12 my-16 border-b" />

        {salesorderitemdetails.item_list.map((item) => {
          return (
            <div className="col-span-12 grid grid-cols-12" key={item.item_code}>
              <Typography className="col-span-4 text-lg font-medium">
                {item.item_name}
              </Typography>
              <Typography className="col-span-2 self-center text-left">{item.unit}</Typography>
              <Typography className="col-span-2 self-center text-left">{item.quantity}</Typography>
              <Typography className="col-span-2 self-center text-left">
                {item.rate}
              </Typography>
              <Typography className="col-span-2 self-center text-left">
                {item.amount}
              </Typography>

              <div className="col-span-12 my-16 border-b" />
            </div>
          )
        })}

        <div className="col-span-12 mt-64" />

        <Typography
          className="col-span-10 self-center font-medium tracking-tight"
          color="text.secondary"
        >
          SUBTOTAL
        </Typography>
        <Typography className="col-span-2 text-left text-lg">
          {salesorderitemdetails.total_amount} {`(${getOrganization(vendor.organization_id).currency_code})`}
        </Typography>

        <div className="col-span-12 my-12 border-b" />


        <Typography
          className="col-span-10 self-center text-2xl font-medium tracking-tight"
          color="text.secondary"
        >
          TOTAL
        </Typography>
        <div className="col-span-2 text-left text-2xl font-medium">
          {salesorderitemdetails.total_amount} {`(${getOrganization(vendor.organization_id).currency_code})`}
        </div>
      </div>
    </>
  );
}

export default withRouter(InvoiceContentTable);
