import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import InvoiceHeader from "./invoice_Header";
import InvoiceContentHeader from "./invoice_content_Header";

function Invoice() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <>
      <FusePageCarded
        header={<InvoiceHeader />}
        content={<InvoiceContentHeader />}
        scroll={isMobile ? 'normal' : 'content'}
      />
    </>
  );
}

export default withReducer("invoiceApp", reducer)(Invoice);
