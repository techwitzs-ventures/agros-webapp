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
        value: "buyer_accepted",
        label: "Buyer Accepted",
        color: 'bg-green text-white',
    },
    {
        id: 3,
        value: "buyer_rejected",
        label: "Buyer Rejected",
        color: 'bg-red text-white',
    },
    {
        id: 4,
        value: "invoice_generated",
        label: "INV Generated",
        color: 'bg-green-800 text-white',
    },
    {
        id: 5,
        value: "draft",
        label: "Draft",
        color: 'bg-purple-700 text-white',
    },
];

function SOOrdersStatus(props) {
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

export default SOOrdersStatus;
