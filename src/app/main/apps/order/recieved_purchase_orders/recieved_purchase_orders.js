import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import RecievedPurchaseOrdersHeader from './recieved_purchase_orders_Headers';
import RecievedPurchaseOrdersTable from './recieved_purchase_orders_Table';

function SalesOrders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<RecievedPurchaseOrdersHeader />}
      content={<RecievedPurchaseOrdersTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('orderApp', reducer)(SalesOrders);
