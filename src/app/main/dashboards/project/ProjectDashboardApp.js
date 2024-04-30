import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ProjectDashboardAppHeader from './ProjectDashboardAppHeader';
import reducer from './store';
import {
  setInvoiceCount,
  setProductCount,
  setPurchaseOrderCount,
  setSalesOrderCount
} from './store/informationSlice';
import HomeTab from './tabs/home/HomeTab';
import TeamTab from './tabs/team/TeamTab';
import BudgetTab from './tabs/budget/BudgetTab';
import { selectUser } from 'app/store/userSlice';
import { getWishlistItems } from '../../apps/inventory/store/wishlistItemsSlice';
import { getPurchaseOrders } from '../../apps/order/store/purchase_orders_Slice';
import { getRecievedSalesOrders } from '../../apps/order/store/recieved_sales_orders_Slice';
import { getInvoiceList } from '../../apps/invoice/store/received_invoices_Slice';
import FuseLoading from '@fuse/core/FuseLoading';
import { getAllPurchaseOrders } from 'app/store/allPurchaseOrdersSlice';
import { getAllSalesOrders } from 'app/store/allSalesOrdersSlice';
import { getAllInvoice } from 'app/store/allInvoicesSlice';
import { getRecievedPurchaseOrders } from '../../apps/order/store/recieved_purchase_orders_Slice';
import { getSalesOrders } from '../../apps/order/store/sales_orders_Slice';
import { getMyInvoiceList } from '../../apps/invoice/store/my_invoices_Slice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

function ProjectDashboardApp(props) {

  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [tabValue, setTabValue] = useState(0);

  const [loading, setloading] = useState(true)

  useEffect(() => {
    if (user.role === "plateformadmin") {
      dispatch(getAllPurchaseOrders()).then((res) => {
        dispatch(setPurchaseOrderCount(res.payload));
      });
      dispatch(getAllSalesOrders()).then((res) => {
        dispatch(setSalesOrderCount(res.payload));
      });
      dispatch(getAllInvoice()).then((res) => {
        dispatch(setInvoiceCount(res.payload))
        setloading(false)
      })
    }
    else if (user.role === "retailer") {
      dispatch(getWishlistItems({ tenant_id: user.tenant_id, active: false })).then((res) => {
        dispatch(setProductCount(res.payload))
      });
      dispatch(getPurchaseOrders({ tenant_id: user.tenant_id, active: false })).then((res) => {
        dispatch(setPurchaseOrderCount(res.payload));
      });
      dispatch(getRecievedSalesOrders({ org_id: user.tenant_id })).then((res) => {
        dispatch(setSalesOrderCount(res.payload));
      });
      dispatch(getInvoiceList({ org_id: user.tenant_id })).then((res) => {
        dispatch(setInvoiceCount(res.payload))
        setloading(false)
      })
    }
    else if (user.role === "seller") {
      dispatch(getWishlistItems({ tenant_id: user.tenant_id, active: false })).then((res) => {
        dispatch(setProductCount(res.payload))
      });
      dispatch(getRecievedPurchaseOrders({ org_id: user.tenant_id })).then((res) => {
        dispatch(setPurchaseOrderCount(res.payload));
      });
      dispatch(getSalesOrders({ tenant_id: user.tenant_id, active: false })).then((res) => {
        dispatch(setSalesOrderCount(res.payload));
      });
      dispatch(getMyInvoiceList({ org_id: user.tenant_id })).then((res) => {
        dispatch(setInvoiceCount(res.payload))
        setloading(false)
      })
    }
  }, [dispatch]);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <Root
      // header={<ProjectDashboardAppHeader />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            className="w-full px-24 -mx-4 min-h-40"
            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
            TabIndicatorProps={{
              children: (
                <Box
                  sx={{ bgcolor: 'text.disabled' }}
                  className="w-full h-full rounded-full opacity-20"
                />
              ),
            }}
          >
            {/* <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Home"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Budget"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Team"
            /> */}
          </Tabs>
          {tabValue === 0 && <HomeTab />}
          {/* {tabValue === 1 && <BudgetTab />}
          {tabValue === 2 && <TeamTab />} */}
        </div>
      }
    />
  );
}

export default withReducer('projectDashboardApp', reducer)(ProjectDashboardApp);
