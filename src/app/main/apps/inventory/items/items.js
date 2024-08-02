import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import ItemsHeader from './itemsHeader';
import ItemsTable from './itemsTable';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { getItems } from '../store/itemsSlice';
import ItemsSidebarContent from './itemsSidebarContent';
import { styled } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  }
}));

function Items() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.itemId));
  }, [routeParams]);

  return (
    <Root
      header={<ItemsHeader pageLayout={pageLayout} />}
      content={<ItemsTable />}
      ref={pageLayout}
      rightSidebarContent={<ItemsSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('inventoryApp', reducer)(Items);
