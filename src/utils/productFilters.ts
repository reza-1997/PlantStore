import type { Accessory, FilterGroup, FilterState, Plant } from "../types";

// Filter configuration options
export const filtering: FilterGroup[] = [
    {
        name: { fa: "سایز گیاه", en: "Plant Size" },
        key: "plantSize",
        options: [
            { name: { fa: "خیلی کوچک (XS)", en: "Extra Small (XS)" }, value: "xs" },
            { name: { fa: "کوچک", en: "Small" }, value: "small" },
            { name: { fa: "متوسط", en: "Medium" }, value: "medium" },
            { name: { fa: "بزرگ", en: "Large" }, value: "large" },
            { name: { fa: "خیلی بزرگ (XL)", en: "Extra Large (XL)" }, value: "xl" },
        ],
    },
    {
        name: { fa: "سایز گلدان", en: "Pot Size" },
        key: "potSize",
        options: [
            { name: { fa: "۱۶ و زیر ۱۶", en: "16 and under" }, value: "small" },
            { name: { fa: "۱۶ تا ۲۲", en: "16 to 22" }, value: "medium" },
            { name: { fa: "بالای ۲۲", en: "Above 22" }, value: "large" },
        ],
    },
    {
        name: { fa: "حساسیت به نور", en: "Light Requirements" },
        key: "light",
        options: [
            { name: { fa: "مقاوم به نور کم", en: "Low Light Tolerance" }, value: "low-light" },
            { name: { fa: "نیاز به نور متوسط", en: "Bright Indirect Light" }, value: "bright-indirect" },
            { name: { fa: "نیاز نوری زیاد", en: "Full Sun" }, value: "full-sun" },
        ],
    },
    {
        name: { fa: "سطح نگهداری", en: "Care Level" },
        key: "careLevel",
        options: [
            { name: { fa: "حساس / دشوار", en: "Hard / Sensitive" }, value: "hard" },
            { name: { fa: "متوسط", en: "Medium" }, value: "medium" },
            { name: { fa: "آسان / غیرحساس", en: "Easy" }, value: "easy" },
        ],
    },
    {
        name: { fa: "مناسب حیوانات خانگی", en: "Pet Friendly" },
        key: "petFriendly",
        options: [
            { name: { fa: "خیر", en: "No" }, value: "no" },
            { name: { fa: "بله", en: "Yes" }, value: "yes" },
        ],
    },
    {
        name: { fa: "قیمت", en: "Price Range" },
        key: "price",
        options: [
            { name: { fa: "بالای ۱ میلیون تومان", en: "Above 1,000,000 Tomans" }, value: "high" },
            { name: { fa: "بین ۵۰۰ هزار تا ۱ میلیون تومان", en: "500,000 to 1,000,000 Tomans" }, value: "medium" },
            { name: { fa: "زیر ۵۰۰ هزار تومان", en: "Under 500,000 Tomans" }, value: "low" },
        ],
    },
];

export const initialFilterState: FilterState = {
    careLevel: [],
    plantSize: [],
    potSize: [],
    light: [],
    petFriendly: [],
    price: [],
};

// Type guard
export const isPlant = (item: Plant | Accessory): item is Plant => "careLevel" in item;

// Filter operations
export const applyCategoryFilters = (
    items: (Plant | Accessory)[],
    subCategoryId?: string,
    categoryId?: string,
    collectionId?: string
) => {
    let result = items;
    if (subCategoryId) {
        result = result.filter((p) => p.subCategoryId === subCategoryId);
    }
    if (categoryId) {
        result = result.filter((p) => p.categoryId === categoryId);
    }
    if (collectionId) {
        result = result.filter((p) => p.collectionIds?.includes(collectionId));
    }
    return result;
};

export const applyAttributeFilters = (items: (Plant | Accessory)[], filter: FilterState) => {
    return items.filter((product) => {
        if (filter.careLevel.length > 0) {
            if (!isPlant(product) || !filter.careLevel.includes(product.careLevel)) return false;
        }

        if (filter.light.length > 0) {
            if (!isPlant(product) || !filter.light.includes(product.lightLevel)) return false;
        }

        if (filter.plantSize.length > 0) {
            if (!isPlant(product) || !filter.plantSize.includes(product.plantSize)) return false;
        }

        if (filter.petFriendly.length > 0) {
            if (!isPlant(product)) return false;
            const hasYes = filter.petFriendly.includes("yes");
            const hasNo = filter.petFriendly.includes("no");
            const isPetFriendly = product.collectionIds?.includes("col3");
            if (hasYes && !hasNo && !isPetFriendly) return false;
            if (hasNo && !hasYes && isPetFriendly) return false;
        }

        if (filter.potSize.length > 0) {
            if (!isPlant(product) || !product.specifications?.potSize) return false;
            const size = product.specifications.potSize;
            const small = filter.potSize.includes("small");
            const medium = filter.potSize.includes("medium");
            const large = filter.potSize.includes("large");

            const matchSmall = small && size <= 16;
            const matchMedium = medium && size > 16 && size <= 22;
            const matchLarge = large && size > 22;

            if (!matchSmall && !matchMedium && !matchLarge) return false;
        }

        if (filter.price.length > 0) {
            const high = filter.price.includes("high");
            const medium = filter.price.includes("medium");
            const low = filter.price.includes("low");

            const matchLow = low && product.price < 500000;
            const matchMedium = medium && product.price >= 500000 && product.price < 1000000;
            const matchHigh = high && product.price >= 1000000;

            if (!matchLow && !matchMedium && !matchHigh) return false;
        }

        return true;
    });
};

export const applySorting = (items: (Plant | Accessory)[], sortBy: string) => {
    const sorted = [...items];
    switch (sortBy) {
        case "popular":
            return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        case "inexpensive":
            return sorted.sort((a, b) => a.price - b.price);
        case "expensive":
            return sorted.sort((a, b) => b.price - a.price);
        case "inStock":
            return sorted.filter((product) => product.inStock);
        default:
            return sorted;
    }
};