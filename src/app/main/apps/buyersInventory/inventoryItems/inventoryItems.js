import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import BuyersInventoryHeader from './inventoryItemsHeader';
import BuyersInventoryTable from './inventoryItemsTable';

function BuyersInventory() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  
    return (
      <FusePageCarded
        header={<BuyersInventoryHeader />}
        content={<BuyersInventoryTable />}
        scroll={isMobile ? 'normal' : 'content'}
      />
    );
  }
  
  export default withReducer('buyersInventoryApp', reducer)(BuyersInventory);