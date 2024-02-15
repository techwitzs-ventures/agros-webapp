import _ from '@lodash';
import mockApi from '../agroshub-mock-api.json';
import mock from '../mock';


let salesOrdersDB = mockApi.components.examples.sales_orders.value;
let organizationsDB = mockApi.components.examples.organizations.value;

mock.onGet('/salesorder/getallsalesorders').reply((config) => {
    return [200, {
        success: true,
        message: "All Sales Order List (Mock)",
        response: salesOrdersDB
    }]
})

mock.onGet('/salesorder/getsalesorderlistbyorganizationId').reply(({ params }) => {
    const { organization_id, active } = params;

    const salesordersfilteredbyorg = active ?
        salesOrdersDB.filter((order) => order.organization_id === organization_id && order.status === active) :
        salesOrdersDB.filter((order) => order.organization_id === organization_id)

    if (salesordersfilteredbyorg) {
        return [200, {
            success: true,
            message: "Sales Order List (Mock)",
            response: salesordersfilteredbyorg
        }];
    } else {
        return [404, {}];
    }
});

mock.onGet('/salesorder/getsinglesalesorderdetails').reply(({ params }) => {
    const { organization_id, sales_order_id } = params

    const organization_exist = _.find(organizationsDB, { organization_id });

    if (organization_exist) {
        const salesOrderMatched = _.find(salesOrdersDB, { sales_order_id });
        if (salesOrderMatched) {
            return [200, {
                success: true,
                message: "Sales Order details (Mock)",
                response: salesOrderMatched
            }]
        } else {
            return [404, {
                success: false,
                message: "Sales Order Not Found (Mock)",
                response: {}
            }]
        }
    } else {
        return [404, {
            success: false,
            message: "Organization Not found"
        }]
    }
})

mock.onGet('/salesorder/receivedsalesorder').reply(({ params }) => {
    const { organization_id } = params;

    const receivedsalesordersfilteredbyorg = salesOrdersDB.filter((order) => order.customer_id === organization_id)

    if (receivedsalesordersfilteredbyorg) {
        return [200, {
            success: true,
            message: "Received Sales Order List (Mock)",
            response: receivedsalesordersfilteredbyorg
        }];
    } else {
        return [404, {}];
    }
})

mock.onPost('/salesorder/create').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Sales Order Created Successfully! (Mock)",
        response: JSON.parse(data)
    }]
})

mock.onPut('/salesorder/update').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Sales Order Updated Successfully! (Mock)",
    }]
})

mock.onPut('/salesorder/changeprocessingstatus').reply(({ }) => {
    const { organization_id, sales_order_id, processing_status } = params
    return [200, {
        success: true,
        message: "Sales Order Processing Status Updated Successfully!",
    }]
})