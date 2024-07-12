import _ from '@lodash';
import clsx from 'clsx';

export const invoiceStatuses = [
    {
        id: 1,
        value: "submitted",
        label: "Unpaid",
        color: 'bg-purple-700 text-white',
    },
    {
        id: 2,
        value: "paid",
        label: "Paid",
        color: 'bg-green text-white',
    }
];

function InvoiceStatus(props) {
    return (
        <div
            className={clsx(
                'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
                _.find(invoiceStatuses, { value: props.value }).color
            )}
        >
            {_.find(invoiceStatuses, { value: props.value }).label}
        </div>
    );
}

export default InvoiceStatus;
