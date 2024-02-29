import _ from '@lodash';
import clsx from 'clsx';

export const orderStatuses = [
    {
        id: 1,
        value: "submitted",
        label: "Submitted",
        color: 'bg-blue text-white',
    },
    {
        id: 2,
        value: "vendor_accepted",
        label: "Vendor Accepted",
        color: 'bg-green text-white',
    },
    {
        id: 3,
        value: "vendor_rejected",
        label: "Vendor Rejected",
        color: 'bg-red text-white',
    },
    {
        id: 4,
        value: "sales_order_created",
        label: "SO Created",
        color: 'bg-purple-300 text-white',
    },
    {
        id: 5,
        value: "invoice_generated",
        label: "INV Generated",
        color: 'bg-green-800 text-white',
    },
    {
        id: 6,
        value: "draft",
        label: "Draft",
        color: 'bg-purple-700 text-white',
    },
];

function POOrdersStatus(props) {
    return (
        <div
            className={clsx(
                'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
                _.find(orderStatuses, { value: props.value }).color
            )}
        >
            {_.find(orderStatuses, { value: props.value }).label}
        </div>
    );
}

export default POOrdersStatus;
