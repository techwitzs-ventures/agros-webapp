import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../agroshub-mock-api.json';
import mock from '../mock';


let itemsDB = mockApi.components.examples.inventory_items.value;
let maxdata = mockApi.components.schemas.max_data.example

mock.onGet('/item/getallitems').reply((config) => {
    return [200, {
        success: true,
        message: "All Items List (Mock)",
        response: itemsDB
    }]
})


mock.onGet('/item/getitems').reply(({ params }) => {
    const { organization_id, active } = params;

    const itemsfilteredbyorg = active ?
        itemsDB.filter((item) => item.organization_id === organization_id && item.status === active) :
        itemsDB.filter((item) => item.organization_id === organization_id)

    if (itemsfilteredbyorg) {
        return [200, {
            success: true,
            message: "Item List (Mock)",
            response: itemsfilteredbyorg
        }];
    } else {
        return [404, {}];
    }
});

mock.onGet('/item/getitem').reply(({ params }) => {
    const { item_id } = params
    const itemMatched = _.find(itemsDB, { item_id });
    if (itemMatched) {
        return [200, {
            success: true,
            message: "Item Details (Mock)",
            response: itemMatched
        }]
    } else {
        return [404, {
            success: false,
            message: "Items Not Found (Mock)",
            response: {}
        }]
    }

})

mock.onPost('/item/additem').reply(({ data, params }) => {
    const { organization_id, items_cat_id } = params
    const newdata = JSON.parse(data)

    const find = _.find(itemsDB, {
        organization_id,
        item_name: newdata.item_name
    })
    if (find) {
        return [200, {
            success: true,
            message: "Item already added (Mock)",
            response: find
        }]
    } else {
        const newItem = {
            id: maxdata.item_max_value + 1,
            organization_id,
            items_cat_id,
            item_id: FuseUtils.generateGUID(),
            item_code: `item_code${maxdata.item_max_value + 1}`,
            createdAt: new Date().toISOString(),
            status: true,
            ...newdata
        }
        itemsDB.push(newItem);
        mockApi.components.schemas.max_data.example.item_max_value = maxdata.item_max_value + 1
        return [200, {
            success: true,
            message: "Item Added Successfully (Mock)",
            response: newItem
        }]
    }
})

mock.onPut('/item/updateitem').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Item Updated Successfully (Mock)",
        response: JSON.parse(data)
    }]
})

mock.onPut('/item/updatestatus').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Status Updated Successfully (Mock)",
        response: JSON.parse(data)
    }]
})