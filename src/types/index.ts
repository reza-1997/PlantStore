import type { store } from "../store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export interface LocalizedString {
    fa: string;
    en: string;
    [key: string]: string;
}

export interface Plant {
    id: string;
    name: LocalizedString;
    slug: string;
    price: number;
    discountPrice: number | null;
    categoryId: string;
    subCategoryId: string;
    collectionIds: string[];
    brand: string;
    images: string[];
    rating: number;
    inStock: boolean;
    stock: number;
    sold: number;
    isFeatured: boolean;
    careLevel: string;
    plantSize: string;
    lightLevel: string;
    tags: string[];
    specifications: {
        light: LocalizedString;
        watering: LocalizedString;
        height: LocalizedString;
        potSize: number;
    };
    desc: LocalizedString;
}

export interface Banner {
    id: string;
    title: Record<string, string[]>;
    subtitle: LocalizedString;
    ctaText: LocalizedString;
    link: string;
    images: string[];
}

export interface Accessory {
    id: string;
    name: LocalizedString;
    slug: string;
    price: number;
    discountPrice: number | null;
    categoryId: string;
    subCategoryId: string;
    collectionIds: string[];
    brand: string;
    images: string[];
    rating: number;
    inStock: boolean;
    stock: number;
    sold: number;
    tags: string[];
    specifications: {
        material: LocalizedString;
        weight: LocalizedString;
    };
    desc: LocalizedString;
}

export interface Category {
    id: string;
    name: LocalizedString;
    slug: string;
    desc: LocalizedString;
    image: string;
}

export interface SubCategory {
    id: string;
    categoryId: string;
    name: LocalizedString;
}

export interface Collections {
    id: string;
    name: LocalizedString;
    image: string;
    slug: string;
}

export interface PotOptionColor {
    name: LocalizedString;
    value: string;
    price: number;
}

export interface PotOption {
    name: LocalizedString;
    value: string;
    colors: PotOptionColor[];
}

export interface FilterOption {
    name: LocalizedString;
    value: string;
}

export interface FilterGroup {
    name: LocalizedString;
    key: keyof FilterState;
    options: FilterOption[];
}
export type FilterState = {
    careLevel: string[];
    plantSize: string[];
    potSize: string[];
    light: string[];
    petFriendly: string[];
    price: string[];
};
export type SearchResult = {
    plants: Plant[];
    accessories: Accessory[];
    categories: Category[];
    subCategories: SubCategory[];
    collections: Collections[];
};