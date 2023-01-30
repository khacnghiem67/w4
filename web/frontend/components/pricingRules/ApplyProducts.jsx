import { ResourcePicker, unstable_Picker as Picker } from '@shopify/app-bridge-react';
import { Autocomplete, Avatar, Button, Thumbnail, Card, ChoiceList, Icon, ResourceList, Stack, Tag, TextField } from "@shopify/polaris";
import { CirclePlusMinor, MobileCancelMajor } from '@shopify/polaris-icons';
import React, { useCallback, useContext, useState, useMemo, useEffect } from 'react';
import { PricingRulesObject } from '../../contexts/PricingRules';
import { useAppQuery } from '../../hooks';

function ApplyProducts() {
    const [showResourcePickerProducts, setShowResourcePickerProducts] = useState(false);
    const { optionProducts, products } = useContext(PricingRulesObject);
    const [initProducts, setInitProducts] = useState([])
    const toggleResourcePickerProducts = useCallback(
        () => setShowResourcePickerProducts(!showResourcePickerProducts),
        [showResourcePickerProducts]
    );

    useEffect(() => { setInitProducts(products) }, [products])

    return (
        <Card sectioned title="Apply to Products">
            <ChoiceList
                title="Options"
                titleHidden
                error={optionProducts.error}
                choices={[
                    { label: "All products", value: "1" },
                    {
                        label: "Specific products", value: "2", renderChildren: (isSelected) =>
                            isSelected && (
                                <>
                                    {showResourcePickerProducts &&
                                        <Picker
                                            open
                                            items={initProducts.map(({ id, title, image }) => ({ id, name: title, media: { kind: 'Thumbnail', source: image?.url || '', } }))}
                                            selectedItems={optionProducts.value.values}
                                            title="Select specific product"
                                            searchQueryPlaceholder="Search product"
                                            primaryActionLabel="Select"
                                            secondaryActionLabel="Cancel"
                                            emptySearchLabel={
                                                {
                                                    title: 'No resources',
                                                    description: 'There are no resources to display',
                                                    withIllustration: true,
                                                }
                                            }
                                            onCancel={toggleResourcePickerProducts}
                                            onSelect={(value) => {
                                                optionProducts.onChange({ ...optionProducts.value, values: value.selectedItems })
                                                toggleResourcePickerProducts()
                                            }}
                                            onSearch={(search) => setInitProducts(products.filter(product => product.title.includes(search.searchQuery)))}
                                        />
                                    }
                                    <Stack vertical>
                                        <Stack.Item>
                                            <TextField
                                                label="Search products"
                                                labelHidden
                                                onFocus={toggleResourcePickerProducts}
                                                placeholder="Search products"
                                                autoComplete="off"
                                            />
                                        </Stack.Item>

                                        <Stack.Item>
                                            <Stack vertical>
                                                {optionProducts.value.values.map(({ id }) => {
                                                    const product = products.find(product => product.id === id)
                                                    return <Stack key={product?.id} alignment="center" distribution="fillEvenly">
                                                        <Stack.Item>
                                                            <Stack alignment="center">
                                                                <Thumbnail source={product?.image.url || ''} />
                                                                <p>
                                                                    {product?.title}
                                                                </p>
                                                            </Stack>
                                                        </Stack.Item>
                                                        <Stack.Item>
                                                            <Stack distribution='trailing'>
                                                                <Button plain onClick={() => optionProducts.onChange({ ...optionProducts.value, values: optionProducts.value.values.filter(option => option.id !== id) })}>
                                                                    <Icon source={MobileCancelMajor} color="subdued" />
                                                                </Button>
                                                            </Stack>
                                                        </Stack.Item>
                                                    </Stack>
                                                })}
                                            </Stack>
                                        </Stack.Item>
                                    </Stack>
                                </>
                            ),
                    },
                    {
                        label: "Product collections", value: "3", renderChildren: (isSelected) =>
                            isSelected && (
                                <ProductCollections />
                            ),
                    },
                    {
                        label: "Product tags", value: "4", renderChildren: (isSelected) =>
                            isSelected && (
                                <ProductTags />
                            ),
                    },
                ]}
                selected={optionProducts.value.value}
                onChange={(value) => {
                    optionProducts.onChange({ value, values: [] })
                }}
            />
        </Card>
    )
}

const ProductCollections = () => {
    const { optionProducts } = useContext(PricingRulesObject);
    const [collections, setCollections] = useState([]);
    const [initCollections, setInitCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');

    useAppQuery({
        url: '/api/collections', reactQueryOptions: {
            onSuccess: (data) => {
                console.log('success');
                setIsLoading(false)
                setCollections(data.collections.edges.map(edge => edge.node));
                setInitCollections(data.collections.edges.map(edge => edge.node))
            },
        },
    });


    const updateText =
        (value) => {
            setInputValue(value);

            if (value === '') {
                setCollections(initCollections);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            setCollections(initCollections.filter(collection => collection.title.match(filterRegex)))
        }

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label="Tags"
            labelHidden
            value={inputValue}
            placeholder="Vintage, cotton, summer"
        />
    );

    return (
        <Stack vertical>
            <Autocomplete
                allowMultiple
                options={collections.map(collection => ({ value: collection.id, label: collection.title }))}
                selected={optionProducts.value.values}
                textField={textField}
                loading={isLoading}
                onSelect={(value) => {
                    optionProducts.onChange({ ...optionProducts.value, values: value })
                }}
                listTitle="Suggested Collections"
            />
            {optionProducts.value.values.map(id => {
                const collection = collections.find(col => col.id === id)
                return <Stack alignment="center" distribution="fillEvenly" key={id}>
                    <Stack.Item>
                        <Stack alignment="center">
                            <Thumbnail source={collection?.image?.url || ''} />
                            <p>
                                {collection?.title}
                            </p>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <Stack distribution='trailing'>
                            <Button plain onClick={() => optionProducts.onChange({ ...optionProducts.value, values: optionProducts.value.values.filter(optionId => optionId !== id) })}>
                                <Icon source={MobileCancelMajor} color="subdued" />
                            </Button>
                        </Stack>
                    </Stack.Item>
                </Stack>
            })}
        </Stack>
    );
}


const ProductTags = () => {
    const { optionProducts } = useContext(PricingRulesObject);
    const [tags, setTags] = useState([]);
    const [initTags, setInitTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [inputValue, setInputValue] = useState('');

    useAppQuery({
        url: '/api/tags', reactQueryOptions: {
            onSuccess: (data) => {
                console.log('success');
                setIsLoading(false)
                setTags(data.shop.productTags.edges.reduce((result, edge) => [...result, edge.node], []));
                setInitTags(data.shop.productTags.edges.reduce((result, edge) => [...result, edge.node], []))
            },
        },
    });

    const removeTag = useCallback(
        (tag) => () => {
            optionProducts.onChange({ ...optionProducts.value, values: optionProducts.value.values.filter(t => t !== tag) })
        }, [optionProducts])


    const updateText = useCallback(
        (value) => {
            setInputValue(value);
        },
        [],
    );

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label="Tags"
            labelHidden
            value={inputValue}
            placeholder="Vintage, cotton, summer"
        />
    );

    const hasSelectedTags = optionProducts.value.values.length > 0;

    const tagsMarkup = hasSelectedTags
        ? optionProducts.value.values.map((tag) => {
            let tagLabel = '';
            tagLabel = tag.replace('_', ' ');
            tagLabel = titleCase(tagLabel);
            return (
                <Tag key={tag} onRemove={removeTag(tag)}>
                    {tagLabel}
                </Tag>
            );
        })
        : null;

    const selectedTagMarkup = hasSelectedTags ? (
        <Stack spacing="extraTight">{tagsMarkup}</Stack>
    ) : null;

    return (
        <Stack vertical>
            <Autocomplete
                actionBefore={{
                    accessibilityLabel: 'Destructive action label',
                    content: 'Add',
                    icon: CirclePlusMinor,
                    onAction: () => {
                        if (inputValue.trim().length === 0) return
                        if (optionProducts.value.values.some(tag => tag === inputValue.trim())) return

                        optionProducts.onChange({ ...optionProducts.value, values: [...optionProducts.value.values, inputValue.trim()] })
                        setInputValue('')
                    },
                }}
                allowMultiple
                options={tags.map(tag => ({ value: tag, label: tag }))}
                selected={optionProducts.value.values}
                textField={textField}
                onSelect={(value) => optionProducts.onChange({ ...optionProducts.value, values: value })}
                loading={isLoading}
                listTitle="Suggested Tags"
            />
            {selectedTagMarkup}
        </Stack>
    );

    function titleCase(string) {
        return string
            .toLowerCase()
            .split(' ')
            .map((word) => {
                return word.replace(word[0], word[0].toUpperCase());
            })
            .join(' ');
    }
}

export default ApplyProducts