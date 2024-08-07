import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import PurchaseOrdersHeader from './purchase_orders_Header';
import PurchaseOrdersTable from './purchase_orders_Table';
import { useAuth } from '../../accounts/auth/AuthContext';
import ConfirmOnboardingPage from '../../confirmonboarding/ConfirmOnboardingPage';

function PurchaseOrders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { onboardingStatus } = useAuth();
  return (
    !onboardingStatus ? <ConfirmOnboardingPage /> :
      <FusePageCarded
        header={<PurchaseOrdersHeader />}
        content={<PurchaseOrdersTable />}
        scroll={isMobile ? 'normal' : 'content'}
      />
  );
}

export default withReducer('orderApp', reducer)(PurchaseOrders);
