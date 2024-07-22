import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import InvoiceHeader from "./invoiceUIHeader";
import InvoiceContentHeader from "./invoiceUIContentHeader";

function InvoiceUI() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <>
      <FusePageCarded
        content={<InvoiceContentHeader />}
        scroll={isMobile ? 'normal' : 'content'}
      />
    </>
  );
}

export default withReducer("invoiceApp", reducer)(InvoiceUI);
