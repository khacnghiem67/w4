import { ContextualSaveBar } from '@shopify/app-bridge-react';
import { Form, FormLayout, Button } from "@shopify/polaris";
import React, { useContext } from 'react';
import { PricingRulesObject } from '../../contexts/PricingRules';
import ApplyProducts from './ApplyProducts';
import CustomPrices from './CustomPrices';
import GeneralInfo from './GeneralInfo';

function RulesForm() {
    const { submitting, reset, dirty, submit } = useContext(PricingRulesObject);

    return (
        <Form onSubmit={submit}>
            <ContextualSaveBar
                saveAction={{
                    label: "Save",
                    onAction: submit,
                    loading: submitting,
                    disabled: submitting,
                }}
                discardAction={{
                    label: "Discard",
                    onAction: reset,
                    loading: submitting,
                    disabled: submitting,
                }}
                visible={dirty}
                fullWidth
            />
            <FormLayout>
                {/* General information */}
                <GeneralInfo />
                {/* Apply products */}
                <ApplyProducts />
                {/* Custom prices */}
                <CustomPrices />

                <Button submit>Save</Button>
            </FormLayout>
        </Form>
    )
}

export default RulesForm