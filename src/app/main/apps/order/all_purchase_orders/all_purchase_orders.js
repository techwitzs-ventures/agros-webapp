import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import AllPurchaseOrdersHeader from './all_purchase_orders_Header';
import AllPurchaseOrdersTable from './all_purchase_orders_Table';

function AllPurchaseOrders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<AllPurchaseOrdersHeader />}
      content={<AllPurchaseOrdersTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('orderApp', reducer)(AllPurchaseOrders);
