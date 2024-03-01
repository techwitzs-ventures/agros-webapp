import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../agroshub-mock-api.json';
import mock from '../mock';


let purchaseOrdersDB = mockApi.components.examples.purchase_orders.value;
let organizationsDB = mockApi.components.examples.organizations.value

mock.onGet('/purchaseorder/getallpurchaseorders').reply((config) => {
    return [200, {
        success: true,
        message: "All Purchase Order List (Mock)",
        response: purchaseOrdersDB
    }]
})

mock.onGet('/purchaseorder/getpurchaseorderlistbyorganizationId').reply(({ params }) => {
    const { organization_id, active } = params;

    const purchaseordersfilteredbyorg = active ?
        purchaseOrdersDB.filter((order) => order.organization_id === organization_id && order.status === active) :
        purchaseOrdersDB.filter((order) => order.organization_id === organization_id)

    if (purchaseordersfilteredbyorg) {
        return [200, {
            success: true,
            message: "Purchase Order List (Mock)",
            response: purchaseordersfilteredbyorg
        }];
    } else {
        return [404, {}];
    }
});

mock.onGet('/purchaseorder/getsinglepurchaseorderdetails').reply(({ params }) => {
    const { organization_id, purchase_order_id } = params

    const organization_exist = _.find(organizationsDB, { organization_id });
    if (organization_exist) {
        const purchaseOrderMatched = _.find(purchaseOrdersDB, { purchase_order_id });
        if (purchaseOrderMatched) {
            return [200, {
                success: true,
                message: "Purchase Order details (Mock)",
                response: purchaseOrderMatched
            }]
        } else {
            return [404, {
                success: false,
                message: "Purchase Order Not Found (Mock)",
                response: {}
            }]
        }
    } else {
        return [404, {
            success: false,
            message: "Organization Not Found"
        }]
    }
})

mock.onGet('/purchaseorder/receivedpurchaseorder').reply(({ params }) => {
    const { organization_id } = params;

    const receivedpurchaseordersfilteredbyorg = purchaseOrdersDB.filter((order) => order.vendor_id === organization_id)

    if (receivedpurchaseordersfilteredbyorg) {
        return [200, {
            success: true,
            message: "Received Purchase Order List (Mock)",
            response: receivedpurchaseordersfilteredbyorg
        }];
    } else {
        return [404, {}];
    }
})

mock.onGet('/purchaseorder/getvendorlist').reply(({ params }) => {
    const { organization_id } = params;
    const vendorlist = organizationsDB.filter((organization) => organization.organization_id !== organization_id)
    return [200, {
        success: true,
        message: "Vendor or Organization List (Mock)",
        response: vendorlist
    }]
})

mock.onPost('/purchaseorder/create').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Purchase Order Created Successfully! (Mock)",
        response: JSON.parse(data)
    }]
})

mock.onPut('/purchaseorder/update').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Purchase Order Updated Successfully! (Mock)",
    }]
})

mock.onPut('/purchaseorder/changeprocessingstatus').reply(({ params }) => {
    const { organization_id, purchase_order_id, processing_status } = params
    return [200, {
        success: true,
        message: "Purchase Order Processing Status Updated Successfully!",
    }]
})