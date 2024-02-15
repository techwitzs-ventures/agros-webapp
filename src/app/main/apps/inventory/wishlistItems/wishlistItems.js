import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import WishlistItemsHeader from './wishlistItemsHeader';
import WishlistItemsTable from './wishlistItemsTable';

function WishlistItems() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<WishlistItemsHeader />}
      content={<WishlistItemsTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('inventoryApp', reducer)(WishlistItems);
