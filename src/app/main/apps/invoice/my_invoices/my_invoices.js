import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import MyInvoicesHeader from "./my_invoices_Header";
import MyInvoicesTable from "./my_invoices_Table";

function MyInvoices() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<MyInvoicesHeader />}
      content={<MyInvoicesTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("invoiceApp", reducer)(MyInvoices);
