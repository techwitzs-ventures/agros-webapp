import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { authRoles } from "../accounts/auth";

const BuyersInventory = lazy(() => import("./inventoryItems/inventoryItems"));

const BuyersInventoryConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: "apps/buyersinventory/buyersinventoryitems",
            element: <BuyersInventory />,
            auth: authRoles.buyer
        },
    ]
}
export default BuyersInventoryConfig;