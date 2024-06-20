import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import MyInvoicesHeader from "./my_invoices_Header";
import MyInvoicesTable from "./my_invoices_Table";
import { useAuth } from "../../accounts/auth/AuthContext";
import ConfirmOnboardingPage from "../../confirmonboarding/ConfirmOnboardingPage";

function MyInvoices() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { onboardingStatus } = useAuth();

  return (
    !onboardingStatus ? <ConfirmOnboardingPage /> :
      <FusePageCarded
        header={<MyInvoicesHeader />}
        content={<MyInvoicesTable />}
        scroll={isMobile ? "normal" : "content"}
      />
  );
}

export default withReducer("invoiceApp", reducer)(MyInvoices);
