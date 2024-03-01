import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import PurchaseOrdersHeader from './purchase_orders_Header';
import PurchaseOrdersTable from './purchase_orders_Table';

function PurchaseOrders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<PurchaseOrdersHeader />}
      content={<PurchaseOrdersTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('orderApp', reducer)(PurchaseOrders);
