import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import CustomersHeader from './customersHeader';
import CustomersTable from './customersTable';

function Customers() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

    return (
        <FusePageCarded
            header={<CustomersHeader />}
            content={<CustomersTable />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default withReducer('customersApp', reducer)(Customers);
