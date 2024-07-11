import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import InvoicesHeader from "./invoicesHeader";
import InvoicesTable from "./invoicesTable";
import { useAuth } from "../../accounts/auth/AuthContext";
import ConfirmOnboardingPage from "../../confirmonboarding/ConfirmOnboardingPage";

function Invoices() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { onboardingStatus } = useAuth();

  return (
    !onboardingStatus ? <ConfirmOnboardingPage /> :
      <FusePageCarded
        header={<InvoicesHeader />}
        content={<InvoicesTable />}
        scroll={isMobile ? "normal" : "content"}
      />
  );
}

export default withReducer("invoiceApp", reducer)(Invoices);
