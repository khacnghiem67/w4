import { ResourcePicker } from '@shopify/app-bridge-react';
import { Autocomplete, Avatar, Button, Card, ChoiceList, Icon, Stack, Tag, TextField } from "@shopify/polaris";
import { CirclePlusMinor, MobileCancelMajor } from '@shopify/polaris-icons';
import React, { useCallback, useContext, useState, useMemo } from 'react';
import { PricingRulesObject } from '../../contexts/PricingRules';
import { useAppQuery } from '../../hooks';

function ApplyProducts() {
    const [showResourcePickerProducts, setShowResourcePickerProducts] = useState(false);
    const { optionProducts } = useContext(PricingRulesObject);

    const toggleResourcePickerProducts = useCallback(
        () => setShowResourcePickerProducts(!showResourcePickerProducts),
        [showResourcePickerProducts]
    );


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
                                        <ResourcePicker
                                            resourceType="Product"
                                            showVariants={false}
                                            onCancel={toggleResourcePickerProducts}
                                            // onSelection={handleProductsChange}
                                            open
                                        />
                                    }
                                    <TextField
                                        label="Search products"
                                        labelHidden
                                        onFocus={toggleResourcePickerProducts}
                                        placeholder="Search products"
                                        autoComplete="off"
                                    />
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
                onChange={(value) => optionProducts.onChange({ value, values: [] })}
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

    const updateText = useCallback(
        (value) => {
            setInputValue(value);

            if (value === '') {
                setCollections(initCollections);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            setCollections(initCollections.filter(collection => collection.title.match(filterRegex)))
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

    return (
        <Stack vertical>
            <Autocomplete
                allowMultiple
                options={collections.map(collection => ({ value: collection.id, label: collection.title }))}
                selected={optionProducts.value.values}
                textField={textField}
                loading={isLoading}
                onSelect={(value) => {
                    console.log(value)
                    optionProducts.onChange({ ...optionProducts.value, values: value })
                }}
                listTitle="Suggested Collections"
            />
            {optionProducts.value.values.map(id => {
                const collection = collections.find(col => col.id === id)

                return <Stack alignment="center" distribution="fillEvenly" key={id}>
                    <Stack.Item>
                        <Stack alignment="center">
                            <Avatar name="Shop One" shape="square" source={collection?.image?.url} />
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
                console.log(data);
                setIsLoading(false)
                setTags(data.shop.productTags.edges.map(edge => edge.node));
                setInitTags(data.shop.productTags.edges.map(edge => edge.node))
            },
        },
    });

    // const removeTag = useCallback(
    //     (tag) => () => {
    //         const options = [...selectedOptions];
    //         options.splice(options.indexOf(tag), 1);
    //         setSelectedOptions(options);
    //     },
    //     [selectedOptions],
    // );

    // const updateText = useCallback(
    //     (value) => {
    //         setInputValue(value);

    //         if (value === '') {
    //             setOptions(deselectedOptions);
    //             return;
    //         }

    //         const filterRegex = new RegExp(value, 'i');
    //         const resultOptions = deselectedOptions.filter((option) =>
    //             option.label.match(filterRegex),
    //         );

    //         let endIndex = resultOptions.length - 1;
    //         if (resultOptions.length === 0) {
    //             endIndex = 0;
    //         }
    //         setOptions(resultOptions);
    //         setInputValue;
    //     },
    //     [deselectedOptions],
    // );

    // const textField = (
    //     <Autocomplete.TextField
    //         onChange={updateText}
    //         label="Tags"
    //         labelHidden
    //         value={inputValue}
    //         placeholder="Vintage, cotton, summer"
    //     />
    // );

    // const hasSelectedTags = optionProducts.value.values.length > 0;

    // const tagsMarkup = hasSelectedTags
    //     ? optionProducts.value.values.map((tag) => {
    //         let tagLabel = '';
    //         tagLabel = tag.replace('_', ' ');
    //         tagLabel = titleCase(tagLabel);
    //         return (
    //             <Tag key={`option${tag}`} onRemove={removeTag(tag)}>
    //                 {tagLabel}
    //             </Tag>
    //         );
    //     })
    //     : null;

    // const selectedTagMarkup = hasSelectedTags ? (
    //     <Stack spacing="extraTight">{tagsMarkup}</Stack>
    // ) : null;

    return (
        <Stack vertical>
            {/* <Autocomplete
                actionBefore={{
                    accessibilityLabel: 'Destructive action label',
                    content: 'Add',
                    icon: CirclePlusMinor,
                    onAction: () => {
                        console.log('actionBefore clicked!');
                    },
                }}
                allowMultiple
                options={tagsCopy.map(tag => ({ value: tag, label: tag }))}
                selected={selectedTags}
                textField={textField}
                onSelect={setSelectedTags}
                loading={isLoading}
                listTitle="Suggested Tags"
            />
            {selectedTagMarkup} */}
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