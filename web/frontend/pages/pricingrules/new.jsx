import { Button, Card, DataTable, Layout, Page, Stack } from "@shopify/polaris";
import React from 'react';
import Form from '../../components/pricingRules/Form';

import PricingRulesContext from '../../contexts/PricingRules';


function NewPricingRule() {

    return (
        <Page fullWidth title='New Pricing Rule'>
            <Layout>
                <Layout.Section>
                    <PricingRulesContext>
                        <Form />
                    </PricingRulesContext>
                </Layout.Section>
                <Layout.Section oneHalf>
                    <Card sectioned>
                        <Stack vertical>
                            <Button outline fullWidth>Show product pricing details</Button>
                            {/* <DataTableExample /> */}
                        </Stack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}

export default NewPricingRule



function DataTableExample() {
    const rows = [
        ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
        ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
        [
            'Navy Merino Wool Blazer with khaki chinos and yellow belt',
            '$445.00',
            124518,
            32,
            '$14,240.00',
        ],
    ];

    return (
        <DataTable
            columnContentTypes={[
                'text',
                'numeric',
                'numeric',
                'numeric',
                'numeric',
            ]}
            headings={[
                'Product',
                'Price',
                'SKU Number',
                'Net quantity',
                'Net sales',
            ]}
            rows={rows}
            totals={['', '', '', 255, '$155,830.00']}
        />
    );
}