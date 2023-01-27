import {
    Card, ChoiceList, Stack, TextField
} from "@shopify/polaris";
import React, { useContext } from 'react';
import { PricingRulesObject } from '../../contexts/PricingRules';


const CHOICES = [
    { label: "Apply a price to selected products", value: "1" },
    { label: "Decrease a fixed amount of the original prices of selected products", value: "2" },
    {
        label: "Decrease the original prices of selected products by a percentage (%)", value: "3"
    },
]
function CustomPrices() {
    const { amount, optionPrices } = useContext(PricingRulesObject);

    return (
        <Card
            sectioned
            title="Custom Prices"
        >
            <Stack vertical>
                <ChoiceList
                    title="Options"
                    titleHidden
                    choices={CHOICES}
                    selected={optionPrices.value}
                    onChange={optionPrices.onChange}
                />
                <TextField
                    {...amount}
                    type='number'
                    label="Amount"
                />
            </Stack>
        </Card>
    )
}

export default CustomPrices