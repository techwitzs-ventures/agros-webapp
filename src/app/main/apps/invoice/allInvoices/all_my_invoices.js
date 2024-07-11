import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import AllInvoicesHeader from "./all_my_invoices_Header";
import AllInvoicesTable from "./all_my_invoices_Table";

function AllInvoices() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<AllInvoicesHeader />}
      content={<AllInvoicesTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("invoiceApp", reducer)(AllInvoices);
