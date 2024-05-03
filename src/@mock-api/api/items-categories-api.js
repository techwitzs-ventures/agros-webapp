import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../agroshub-mock-api.json';
import mock from '../mock';


let itemsCategoryDB = mockApi.components.examples.inventory_itemscategories.value;


mock.onGet('/itemscategory/getallitemscategory').reply((config) => {
    return [200, {
        success: true,
        message: "All Items Category List (Mock)",
        response: itemsCategoryDB
    }]
});

mock.onGet('/itemscategory/getitemscategorylist').reply(({ params }) => {
    const { organization_id, active } = params;

    const itemscategoriesfilteredbyorg = active ?
        itemsCategoryDB.filter((itemcategory) => itemcategory.organization_id === organization_id && itemcategory.status === active) :
        itemsCategoryDB.filter((itemcategory) => itemcategory.organization_id === organization_id)

    if (itemscategoriesfilteredbyorg) {
        return [200, {
            success: true,
            message: "Item Category List (Mock)",
            response: itemscategoriesfilteredbyorg
        }];
    } else {
        return [404, {}];
    }
});

mock.onGet('/itemscategory/getitemscategory').reply(({ params }) => {
    const { items_cat_id } = params
    const itemCategoryMatched = _.find(itemsCategoryDB, { items_cat_id });
    if (itemCategoryMatched) {
        return [200, {
            success: true,
            message: "Items Category Details (Mock)",
            response: itemCategoryMatched
        }]
    } else {
        return [404, {
            success: false,
            message: "Items Category Not Found (Mock)",
            response: {}
        }]
    }

})

mock.onPost('/itemscategory/addcategory').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Items Category Added Successfully (Mock)",
        response: JSON.parse(data)
    }]
})

mock.onPut('/itemscategory/updatecategory').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Items Category Updated Successfully (Mock)",
        response: JSON.parse(data)
    }]
})

mock.onPut('/itemscategory/updatestatus').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Status Updated Successfully (Mock)",
        response: JSON.parse(data)
    }]
})