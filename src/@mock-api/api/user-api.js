import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../agroshub-mock-api.json';
import mock from '../mock';

let usersDB = mockApi.components.examples.users.value;


mock.onGet('/user/getallusers').reply((config) => {
    return [200, {
        success: true,
        message: "List of Users (Mock)",
        response: usersDB
    }]
})