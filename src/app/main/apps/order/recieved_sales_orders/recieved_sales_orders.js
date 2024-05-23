import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import RecievedSalesOrdersHeader from './recieved_sales_orders_Headers';
import RecievedSalesOrdersTable from './recieved_sales_orders_Table';
import { useAuth } from '../../accounts/auth/AuthContext';
import ConfirmOnboardingPage from '../../confirmonboarding/ConfirmOnboardingPage';

function SalesOrders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { onboardingStatus } = useAuth();

  return (
    !onboardingStatus ? <ConfirmOnboardingPage /> :
      <FusePageCarded
        header={<RecievedSalesOrdersHeader />}
        content={<RecievedSalesOrdersTable />}
        scroll={isMobile ? 'normal' : 'content'}
      />
  );
}

export default withReducer('orderApp', reducer)(SalesOrders);
