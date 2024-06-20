import React, { useEffect, useState } from "react";
import { useStripeConnect } from "../../../stripe/useStripeConnect";
import {
    ConnectAccountOnboarding,
    ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";

export default function BusinessVerification(props) {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const stripeConnectInstance = useStripeConnect(user.tenant_data.account_id);

    return (
        <>
            {stripeConnectInstance && (
                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                    <ConnectAccountOnboarding
                        onExit={() => {
                            props.setStripeAccountConfirmationStatus(true)
                            dispatch(showMessage({ message: "Stripe Onboarding Completed!", variant: "success" }))
                        }}
                    />
                </ConnectComponentsProvider>
            )}
        </>
    );
}