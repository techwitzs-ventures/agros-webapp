import { useEffect, useState } from 'react'
import { loadConnectAndInitialize } from '@stripe/connect-js';
import axios from 'axios';

export const useStripeConnect = (account_id) => {
    const [stripeConnectInstance, setStripeConnectInstance] = useState();

    useEffect(() => {
        if (account_id) {

            const fetchClientSecret = async () => {
                try {
                    const response = await axios.post('/tenant/account_session', {
                        account_id,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.status !== 200) {
                        const { error } = response.data;
                        throw new Error(`An error occurred: ${error}`);
                    }

                    const { client_secret: clientSecret } = response.data.response;
                    return clientSecret;

                } catch (error) {

                    console.error(error);
                    throw error;
                }
            };

            setStripeConnectInstance(
                loadConnectAndInitialize({
                    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
                    fetchClientSecret,
                    appearance: {
                        overlays: "dialog",
                        variables: {
                            colorPrimary: "#635BFF",
                        },
                    },
                })
            );
        }
    }, [account_id]);

    return stripeConnectInstance;
}

export default useStripeConnect