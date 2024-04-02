import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import RetailersWishlistItemsHeader from './retailersWishlistItemsHeader';
import RetailersWishlistItemsTable from './retailersWishlistItemsTable';

function RetailersWishlistItems() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<RetailersWishlistItemsHeader />}
      content={<RetailersWishlistItemsTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('inventoryApp', reducer)(RetailersWishlistItems);
