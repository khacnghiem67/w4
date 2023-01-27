import { notEmptyString, useField, useForm } from "@shopify/react-form";
import React, { useCallback, useState } from 'react';
import { useEffect } from "react";
import { useAppQuery } from '../hooks'

export const PricingRulesObject = React.createContext()

function PricingRules({ children }) {
    const [collections, setCollections] = useState([])
    const [tags, setTags] = useState([])

    const onSubmit = useCallback(
        // (body) => {
        //     (async () => {
        //         const parsedBody = body;
        //         parsedBody.destination = parsedBody.destination[0];
        //         const QRCodeId = QRCode?.id;
        //         /* construct the appropriate URL to send the API request to based on whether the QR code is new or being updated */
        //         const url = QRCodeId ? `/api/qrcodes/${QRCodeId}` : "/api/qrcodes";
        //         /* a condition to select the appropriate HTTP method: PATCH to update a QR code or POST to create a new QR code */
        //         const method = QRCodeId ? "PATCH" : "POST";
        //         /* use (authenticated) fetch from App Bridge to send the request to the API and, if successful, clear the form to reset the ContextualSaveBar and parse the response JSON */
        //         const response = await fetch(url, {
        //             method,
        //             body: JSON.stringify(parsedBody),
        //             headers: { "Content-Type": "application/json" },
        //         });
        //         if (response.ok) {
        //             makeClean();
        //             const QRCode = await response.json();
        //             /* if this is a new QR code, then save the QR code and navigate to the edit page; this behavior is the standard when saving resources in the Shopify admin */
        //             if (!QRCodeId) {
        //                 navigate(`/qrcodes/${QRCode.id}`);
        //                 /* if this is a QR code update, update the QR code state in this component */
        //             } else {
        //                 setQRCode(QRCode);
        //             }
        //         }
        //     })();
        //     return { status: "success" };
        // },
        // [QRCode, setQRCode]
        (body) => {
            return { status: 'fail', errors: [{ message: 'bad form data' }] };
        }, []
    );

    const { data } = useAppQuery({
        url: '/api/collections', reactQueryOptions: {
            onSuccess: () => {
                console.log('success');
            },
        },
    });

    const {
        fields: {
            name,
            priority,
            status,
            optionProducts,
            amount,
            optionPrices,
        },
        dirty,
        reset,
        submitting,
        submit,
        makeClean,
    } = useForm({
        fields: {
            // general infos
            name: useField({
                value: '',
                validates: [notEmptyString("Name is required")]
            }),
            priority: useField({
                value: '0',
                validates: [notEmptyString("Priority is required"), (priority) => {
                    if (isNaN(+priority) || !Number.isInteger(+priority) || +priority < 0 || +priority > 99) return 'Priority must be a integer between 0 and 99'
                }],
            }),
            status: useField("1"),
            // apply products
            optionProducts: useField(['1']),
            // custom prices
            amount: useField({
                value: '0',
                validates: [notEmptyString("Amount is required"), (priority) => {
                    if (isNaN(+priority) || !Number.isInteger(+priority) || +priority < 0) return 'Amount must be a integer greater or equal 0'
                }],
            }),
            optionPrices: useField(["1"]),

        },
        onSubmit,
    });

    return (
        <PricingRulesObject.Provider value={{
            name,
            priority,
            status,
            optionProducts,
            amount,
            optionPrices,
            dirty,
            reset,
            submitting,
            submit,
            makeClean,
        }}>{children}</PricingRulesObject.Provider>
    )
}

export default PricingRules