import { notEmptyString, useField, useForm } from "@shopify/react-form";
import React, { useCallback, useState } from 'react';
import { useAppQuery } from '../hooks';

export const PricingRulesObject = React.createContext()


function PricingRules({ children }) {
    const [products, setProducts] = useState([])
    const [productPricingList, setProductPricingList] = useState([])
    const [currencyCode, setCurrencyCode] = useState('USD')

    const onSubmit = (body) => {
        const { name, amount, priority, optionProducts, optionPrices } = body;

        let productsRule = []

        switch (optionProducts.value[0]) {
            case '1': {
                productsRule = products.map(product => ({ ...product, priority: +priority, name }));
                break;
            }
            case "2": {
                optionProducts.values.forEach(({ id }) => {
                    const existProduct = products.find(pro => pro.id === id)
                    if (existProduct) productsRule.push({ ...existProduct, priority: +priority, name });
                })
                break;
            }
            case "3": {
                optionProducts.values.forEach((collId) => {
                    products.forEach((product) => {
                        if (product.collections.includes(collId)) {
                            productsRule.push({ ...product, priority: +priority, name });
                        }
                    })
                })
                break;
            }
            case "4": {
                optionProducts.values.forEach((tag) => {
                    products.forEach((product) => {
                        if (product.tags.includes(tag)) {
                            productsRule.push({ ...product, priority: +priority, name });
                        }
                    })
                })
                break;
            }
        }

        switch (optionPrices[0]) {
            case '1': {
                productsRule = productsRule.map(product => ({ ...product, discountPrice: +amount }))
                break;
            }
            case '2': {
                productsRule = productsRule.map(product => {
                    const discountPrice = Math.round(+product.price - (+amount))
                    return { ...product, discountPrice: discountPrice > 0 ? discountPrice : 0 }
                })
                break;
            }
            case '3': {
                productsRule = productsRule.map(product => {
                    const discountPrice = Math.round(+product.price - (+product.price * (+amount)) / 100)
                    return { ...product, discountPrice: discountPrice > 0 ? discountPrice : 0 }
                })
                break;
            }
        }

        setProductPricingList([...productPricingList, { id: name, productsRule }])

        return { status: "success" };
    }
    // useAppQuery({
    //     url: '/api/collections', reactQueryOptions: {
    //         onSuccess: (data) => {
    //             console.log('success');
    //             setCollections(data.collections.edges.map(edge => edge.node));
    //         },
    //     },
    // });
    console.log(productPricingList);
    useAppQuery({
        url: '/api/products', reactQueryOptions: {
            onSuccess: (data) => {
                console.log('success');
                setProducts(data.products.edges.map(edge => {
                    const price = edge.node.variants.edges?.[0].node.price || 0
                    const collections = edge.node.collections.nodes.map(({ id }) => id)
                    const image = edge.node.images.edges?.[0]?.node
                    delete edge.node.variants
                    delete edge.node.images
                    return { ...edge.node, collections, price, image }
                }));
            },
        },
    });
    // useAppQuery({
    //     url: '/api/currency_code', reactQueryOptions: {
    //         onSuccess: (data) => {
    //             setCurrencyCode(data.shop.currencyCode);
    //         },
    //     },
    // });



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
                validates: [notEmptyString("Name is required"), (name) => {
                    if (productPricingList.some(({ id }) => {
                        return id === name
                    })) return 'This rule name already exist'
                }]
            }, [productPricingList]),
            priority: useField({
                value: '0',
                validates: [notEmptyString("Priority is required"), (priority) => {
                    if (isNaN(+priority) || !Number.isInteger(+priority) || +priority < 0 || +priority > 99) return 'Priority must be a integer between 0 and 99'
                }],
            }),
            status: useField("1"),
            // apply products
            optionProducts: useField({
                value: { value: ['1'], values: [] },
                validates: (option) => {
                    if (option.value[0] === '1') return
                    if (option.values.length <= 0) return 'Please select option'
                }
            }),
            // custom prices
            amount: useField({
                value: '0',
                validates: [notEmptyString("Amount is required"), (priority) => {
                    if (isNaN(+priority) || +priority < 0) return 'Amount must be a number greater or equal 0'
                }],
            }),
            optionPrices: useField(["1"]),

        },
        makeCleanAfterSubmit: true,
        onSubmit,
    });

    // console.log(optionProducts);
    return (
        <PricingRulesObject.Provider value={{
            products,
            productPricingList,
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