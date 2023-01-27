import { ResourcePicker } from '@shopify/app-bridge-react';
import { Autocomplete, Avatar, Button, Card, ChoiceList, Icon, Stack, Tag, TextField } from "@shopify/polaris";
import { CirclePlusMinor, MobileCancelMajor } from '@shopify/polaris-icons';
import React, { useCallback, useContext, useState } from 'react';
import { PricingRulesObject } from '../../contexts/PricingRules';

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
                selected={optionProducts.value}
                onChange={optionProducts.onChange}
            />
        </Card>
    )
}

const ProductCollections = () => {
    const paginationInterval = 25;
    const deselectedOptions = Array.from(Array(100)).map((_, index) => ({
        value: `rustic ${index + 1}`,
        label: `Rustic ${index + 1}`,
    }));

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(deselectedOptions);
    const [isLoading, setIsLoading] = useState(false);
    const [willLoadMoreResults, setWillLoadMoreResults] = useState(true);
    const [visibleOptionIndex, setVisibleOptionIndex] =
        useState(paginationInterval);

    const handleLoadMoreResults = useCallback(() => {
        if (willLoadMoreResults) {
            setIsLoading(true);

            setTimeout(() => {
                const remainingOptionCount = options.length - visibleOptionIndex;
                const nextVisibleOptionIndex =
                    remainingOptionCount >= paginationInterval
                        ? visibleOptionIndex + paginationInterval
                        : visibleOptionIndex + remainingOptionCount;

                setIsLoading(false);
                setVisibleOptionIndex(nextVisibleOptionIndex);

                if (remainingOptionCount <= paginationInterval) {
                    setWillLoadMoreResults(false);
                }
            }, 1000);
        }
    }, [willLoadMoreResults, visibleOptionIndex, options.length]);

    const removeTag = useCallback(
        (tag) => () => {
            const options = [...selectedOptions];
            options.splice(options.indexOf(tag), 1);
            setSelectedOptions(options);
        },
        [selectedOptions],
    );

    const updateText = useCallback(
        (value) => {
            setInputValue(value);

            if (value === '') {
                setOptions(deselectedOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = deselectedOptions.filter((option) =>
                option.label.match(filterRegex),
            );

            let endIndex = resultOptions.length - 1;
            if (resultOptions.length === 0) {
                endIndex = 0;
            }
            setOptions(resultOptions);
            setInputValue;
        },
        [deselectedOptions],
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

    const hasSelectedOptions = selectedOptions.length > 0;

    const tagsMarkup = hasSelectedOptions
        ? selectedOptions.map((option) => {
            let tagLabel = '';
            tagLabel = option.replace('_', ' ');
            tagLabel = titleCase(tagLabel);
            return (
                <Tag key={`option${option}`} onRemove={removeTag(option)}>
                    {tagLabel}
                </Tag>
            );
        })
        : null;
    const optionList = options.slice(0, visibleOptionIndex);
    const selectedTagMarkup = hasSelectedOptions ? (
        <Stack spacing="extraTight">{tagsMarkup}</Stack>
    ) : null;

    return (
        <Stack vertical>
            <Autocomplete
                allowMultiple
                options={optionList}
                selected={selectedOptions}
                textField={textField}
                onSelect={setSelectedOptions}
                listTitle="Suggested Collections"
                loading={isLoading}
                onLoadMoreResults={handleLoadMoreResults}
                willLoadMoreResults={willLoadMoreResults}
            />
            {[1].map(col => <Stack alignment="center" distribution="fillEvenly">
                <Stack.Item>
                    <Stack alignment="center">
                        <Avatar name="Shop One" shape="square" />
                        <p>
                            Add variants if this product
                        </p>
                    </Stack>
                </Stack.Item>
                <Stack.Item>
                    <Stack distribution='trailing'>
                        <Button plain>
                            <Icon source={MobileCancelMajor} color="subdued" />
                        </Button>
                    </Stack>
                </Stack.Item>
            </Stack>)}
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

const ProductTags = () => {
    const paginationInterval = 25;
    const deselectedOptions = Array.from(Array(100)).map((_, index) => ({
        value: `rustic ${index + 1}`,
        label: `Rustic ${index + 1}`,
    }));

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(deselectedOptions);
    const [isLoading, setIsLoading] = useState(false);
    const [willLoadMoreResults, setWillLoadMoreResults] = useState(true);
    const [visibleOptionIndex, setVisibleOptionIndex] =
        useState(paginationInterval);

    const handleLoadMoreResults = useCallback(() => {
        if (willLoadMoreResults) {
            setIsLoading(true);

            setTimeout(() => {
                const remainingOptionCount = options.length - visibleOptionIndex;
                const nextVisibleOptionIndex =
                    remainingOptionCount >= paginationInterval
                        ? visibleOptionIndex + paginationInterval
                        : visibleOptionIndex + remainingOptionCount;

                setIsLoading(false);
                setVisibleOptionIndex(nextVisibleOptionIndex);

                if (remainingOptionCount <= paginationInterval) {
                    setWillLoadMoreResults(false);
                }
            }, 1000);
        }
    }, [willLoadMoreResults, visibleOptionIndex, options.length]);

    const removeTag = useCallback(
        (tag) => () => {
            const options = [...selectedOptions];
            options.splice(options.indexOf(tag), 1);
            setSelectedOptions(options);
        },
        [selectedOptions],
    );

    const updateText = useCallback(
        (value) => {
            setInputValue(value);

            if (value === '') {
                setOptions(deselectedOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = deselectedOptions.filter((option) =>
                option.label.match(filterRegex),
            );

            let endIndex = resultOptions.length - 1;
            if (resultOptions.length === 0) {
                endIndex = 0;
            }
            setOptions(resultOptions);
            setInputValue;
        },
        [deselectedOptions],
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

    const hasSelectedOptions = selectedOptions.length > 0;

    const tagsMarkup = hasSelectedOptions
        ? selectedOptions.map((option) => {
            let tagLabel = '';
            tagLabel = option.replace('_', ' ');
            tagLabel = titleCase(tagLabel);
            return (
                <Tag key={`option${option}`} onRemove={removeTag(option)}>
                    {tagLabel}
                </Tag>
            );
        })
        : null;
    const optionList = options.slice(0, visibleOptionIndex);
    const selectedTagMarkup = hasSelectedOptions ? (
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
                        console.log('actionBefore clicked!');
                    },
                }}
                allowMultiple
                options={optionList}
                selected={selectedOptions}
                textField={textField}
                onSelect={setSelectedOptions}
                listTitle="Suggested Tags"
                loading={isLoading}
                onLoadMoreResults={handleLoadMoreResults}
                willLoadMoreResults={willLoadMoreResults}
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