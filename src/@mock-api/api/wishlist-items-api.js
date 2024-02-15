import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../agroshub-mock-api.json';
import mock from '../mock';


let wishlistItemsDB = mockApi.components.examples.inventory_wishlistItems.value;

mock.onGet('/itemswishlist/getitemsbyorgid').reply(({ params }) => {
    const { organization_id, active } = params;

    const wishitemsfilteredbyorg = active ?
    wishlistItemsDB.filter((item) => item.organization_id === organization_id && item.status === active) :
    wishlistItemsDB.filter((item) => item.organization_id === organization_id)

    if (wishitemsfilteredbyorg) {
        return [200, {
            success: true,
            message: "List Of Items Wishlist (Mock)",
            response: wishitemsfilteredbyorg
        }];
    } else {
        return [404, {}];
    }
});

mock.onPost('/itemswishlist/additem').reply(({ data, params }) => {
    return [200, {
        success: true,
        message: "Wishlist Item Added Successfully (Mock)",
        response: JSON.parse(data)
    }]
})