import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../agroshub-mock-api.json';
import mock from '../mock';


let organizationsDB = mockApi.components.examples.organizations.value;


mock.onGet('/organization/all').reply((config) => {
    return [200, {
        success: true,
        message: "List of Organizations (Mock)",
        response: organizationsDB
    }]
})

mock.onGet('/organization/getorganization').reply(({ params }) => {
    const { organization_id } = params
    return [200, {
        success: true,
        message: "Organization Details (Mock)",
        response: _.find(organizationsDB, { organization_id })
    }]
})