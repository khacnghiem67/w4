import {
    Card, Select, Stack, TextField
} from "@shopify/polaris";
import React, { useContext } from 'react';
import { PricingRulesObject } from '../../contexts/PricingRules';

const STATUS_OPTIONS = [{ label: 'Enable', value: "1" }, { label: 'Disable', value: "0" }]

function GeneralInfo() {
    const { name, priority, status } = useContext(PricingRulesObject);
    return (
        <Card sectioned title="General Information">
            <Stack vertical>
                <TextField
                    {...name}
                    label="Name"
                />
                <TextField
                    {...priority}
                    type='number'
                    label="Priority"
                    helpText="Please enter an integer from 0 to 99. 0 is the highest priority."
                />
                <Select
                    label="Status"
                    options={STATUS_OPTIONS}
                    onChange={status.onChange}
                    value={status.value}
                />
            </Stack>
        </Card>
    )
}

export default GeneralInfo