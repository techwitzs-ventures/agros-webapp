import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import UsersHeader from './usersHeader';
import UsersTable from './usersTable';

function Users() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

    return (
        <FusePageCarded
            header={<UsersHeader />}
            content={<UsersTable />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default withReducer('usersApp', reducer)(Users);
