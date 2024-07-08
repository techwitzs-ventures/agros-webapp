import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import VendorsHeader from './vendorsHeader';
import VendorsTable from './vendorsTable';

function Vendors() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

    return (
        <FusePageCarded
            header={<VendorsHeader />}
            content={<VendorsTable />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default withReducer('vendorsApp', reducer)(Vendors);
