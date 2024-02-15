import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import ItemsCategoriesHeader from './itemsCategoriesHeader';
import ItemsCategoriesTable from './itemsCategoriesTable';

function ItemsCategories() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<ItemsCategoriesHeader />}
      content={<ItemsCategoriesTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('inventoryApp', reducer)(ItemsCategories);
