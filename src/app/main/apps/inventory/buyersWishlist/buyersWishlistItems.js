import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import BuyersWishlistItemsHeader from './buyersWishlistItemsHeader';
import BuyersWishlistItemsTable from './buyersWishlistItemsTable';

function BuyersWishlistItems() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<BuyersWishlistItemsHeader />}
      content={<BuyersWishlistItemsTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('inventoryApp', reducer)(BuyersWishlistItems);
