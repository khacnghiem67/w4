import { Button, Card, DataTable, Layout, Page, Stack } from "@shopify/polaris";
import React, { useContext } from 'react';
import Form from '../../components/pricingRules/Form';

import PricingRulesContext, { PricingRulesObject } from '../../contexts/PricingRules';


function NewPricingRule() {

    return (
        <PricingRulesContext>
            <Page fullWidth title='New Pricing Rule'>
                <Layout>
                    <Layout.Section>
                        <Form />
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <Card sectioned>
                            <Stack vertical>
                                <Button outline fullWidth>Show product pricing details</Button>
                                <DataTableExample />
                            </Stack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </PricingRulesContext>
    )
}

export default NewPricingRule



function DataTableExample() {
    const { productPricingList } = useContext(PricingRulesObject)
    // const rows = [
    //     ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
    //     ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
    //     [
    //         'Navy Merino Wool Blazer with khaki chinos and yellow belt',
    //         '$445.00',
    //         124518,
    //         32,
    //         '$14,240.00',
    //     ],
    // ];
    const rows = productPricingList.reduce((result, { id, productsRule }) => [...result, ...productsRule], []).map(({ name, title, price, discountPrice }) => {
        return [
            name,
            title, price, discountPrice
        ];
    }
    )

    return (
        <DataTable
            columnContentTypes={[
                'text',
                'text',
                'numeric',
                'numeric',
            ]}
            headings={[
                'Rule',
                'Product',
                'Price',
                'Discount price',
            ]}
            rows={rows}
        // totals={['', '', 255, 255]}
        />
    );
}