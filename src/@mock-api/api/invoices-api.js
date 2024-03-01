import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../agroshub-mock-api.json';
import mock from '../mock';


let invoicesDB = mockApi.components.examples.invoices.value;
let organizationsDB = mockApi.components.examples.organizations.value;
let salesOrdersDB = mockApi.components.examples.sales_orders.value;
let usersDB = mockApi.components.examples.users.value;

mock.onGet('/invoice/getallinvoices').reply((config) => {
    return [200, {
        success: true,
        message: "All Invoice List (Mock)",
        response: invoicesDB
    }]
})

mock.onGet('/invoice/getinvoicelistbycustomerid').reply(({ params }) => {
    const { organization_id } = params;

    const invoicefilteredbycustomerorg = invoicesDB.filter((invoice) => invoice.customer_id === organization_id)

    if (invoicefilteredbycustomerorg) {
        return [200, {
            success: true,
            message: "Invoice List By Customer Id (Mock)",
            response: invoicefilteredbycustomerorg
        }];
    } else {
        return [404, []];
    }
});

mock.onGet('/invoice/getinvoicelistbyorganizationId').reply(({ params }) => {
    const { organization_id } = params
    const invoicefilteredbyorg = invoicesDB.filter((invoice) => invoice.organization_id === organization_id)

    if (invoicefilteredbyorg) {
        return [200, {
            success: true,
            message: "Invoice List (Mock)",
            response: invoicefilteredbyorg
        }];
    } else {
        return [404, []];
    }
})

mock.onGet('/invoice/getsingleinvoicedetails').reply(({ params }) => {
    const { organization_id, invoice_id } = params

    const organization_exist = _.find(organizationsDB, { organization_id });
    if (organization_exist) {

        const invoice_data = _.find(invoicesDB, { invoice_id });
        if (invoice_data) {

            const sales_order_data = _.find(salesOrdersDB, { sales_order_id: invoice_data.sales_order_id })
            if (sales_order_data) {

                const customer_data = _.find(usersDB, { organization_id: invoice_data.customer_id })

                return [200, {
                    success: true,
                    message: "Invoice Retrieved Successfully (Mock)",
                    response: {
                        invoice_data: invoice_data,
                        sales_order_data: sales_order_data,
                        customer_data: [customer_data]
                    }
                }]
                
            } else {
                return [404, {
                    success: false,
                    message: "No Sales Order Found with this sales order id (Mock)",
                    response: {}
                }]
            }
        } else {
            return [404, {
                success: false,
                message: "Invoice not found with this invoice id (Mock)",
                response: {}
            }]
        }
    } else {
        return [404, {
            success: false,
            message: "Organization not found with provided this organization id (Mock)",
            response: {}
        }]
    }
})

mock.onPost('/invoice/create').reply(({ data, params }) => {
    const { organization_id } = params;
    return [200, {
        success: true,
        message: "Invoice Created Successfully! (Mock)",
        response: JSON.parse(data)
    }]
})