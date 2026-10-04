import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    Accessory,
    Banner,
    Category,
    Collections,
    Plant,
    PotOption,
    SearchResult,
    SubCategory
} from "../types";
import { supabase } from "../config/supabaseClient";

// تابعی برای تبدیل فیلدهای snake_case به camelCase دیتابیس
const mapPlant = (item: any): Plant => ({
    ...item,
    discountPrice: item.discount_price,
    categoryId: item.category_id,
    subCategoryId: item.sub_category_id,
    collectionIds: item.collection_ids,
    inStock: item.in_stock,
    isFeatured: item.is_featured,
    careLevel: item.care_level,
    plantSize: item.plant_size,
    lightLevel: item.light_level,
    desc: item.description,
});

const mapAccessory = (item: any): Accessory => ({
    ...item,
    discountPrice: item.discount_price,
    categoryId: item.category_id,
    subCategoryId: item.sub_category_id,
    collectionIds: item.collection_ids,
    inStock: item.in_stock,
    isFeatured: item.is_featured,
    desc: item.description,
});

const mapBanner = (item: any): Banner => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    ctaText: item.cta_text,
    link: item.link,
    images: item.images,
});

export const PlantsApi = createApi({
    reducerPath: 'plantApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['PLANT', 'ACCESSORY', 'BANNER', 'CATEGORY', 'SUBCATEGORY', 'COLLECTION', 'POT'],
    endpoints: (build) => ({
        // --- PLANTS ---
        getAllPlants: build.query<Plant[], void>({
            async queryFn() {
                const { data, error } = await supabase.from('plants').select('*');
                if (error) return { error };
                return { data: (data || []).map(mapPlant) };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ slug }) => ({ type: 'PLANT' as const, id: slug })),
                        { type: 'PLANT', id: 'LIST' },
                    ]
                    : [{ type: 'PLANT', id: 'LIST' }],
        }),
        getPlantBySlug: build.query<Plant | null, string>({
            async queryFn(slug) {
                const { data, error } = await supabase.from('plants').select('*').eq('slug', slug).single();
                if (error && error.code !== 'PGRST116') return { error };
                return { data: data ? mapPlant(data) : null };
            },
            providesTags: (_, __, slug) => [{ type: 'PLANT', id: slug }],
        }),

        // --- BANNERS ---
        getBanner: build.query<Banner, void>({
            async queryFn() {
                const { data, error } = await supabase.from('banners').select('*').limit(1).single();
                if (error) return { error };
                return { data: mapBanner(data) };
            },
            providesTags: ['BANNER'],
        }),

        // --- ACCESSORIES ---
        getAllAccessories: build.query<Accessory[], void>({
            async queryFn() {
                const { data, error } = await supabase.from('accessories').select('*');
                if (error) return { error };
                return { data: (data || []).map(mapAccessory) };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ slug }) => ({ type: 'ACCESSORY' as const, id: slug })),
                        { type: 'ACCESSORY', id: 'LIST' },
                    ]
                    : [{ type: 'ACCESSORY', id: 'LIST' }],
        }),
        getAccessoryBySlug: build.query<Accessory | null, string>({
            async queryFn(slug) {
                const { data, error } = await supabase.from('accessories').select('*').eq('slug', slug).single();
                if (error && error.code !== 'PGRST116') return { error };
                return { data: data ? mapAccessory(data) : null };
            },
            providesTags: (_, __, slug) => [{ type: 'ACCESSORY', id: slug }],
        }),

        // --- CATEGORIES ---
        getCategories: build.query<Category[], void>({
            async queryFn() {
                const { data, error } = await supabase.from('categories').select('*');
                if (error) return { error };
                return { data: data as Category[] };
            },
            providesTags: ['CATEGORY'],
        }),
        getCategory: build.query<Category | null, string>({
            async queryFn(id) {
                const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
                if (error && error.code !== 'PGRST116') return { error };
                return { data: data as Category | null };
            },
            providesTags: (_, __, id) => [{ type: 'CATEGORY', id }],
        }),

        // --- SUB-CATEGORIES ---
        getAllSubCategories: build.query<SubCategory[], void>({
            async queryFn() {
                const { data, error } = await supabase.from('sub_categories').select('*');
                if (error) return { error };
                const formatted = (data || []).map(item => ({
                    ...item,
                    categoryId: item.category_id,
                }));
                return { data: formatted as SubCategory[] };
            },
            providesTags: ['SUBCATEGORY'],
        }),
        getSubCategory: build.query<SubCategory | null, string>({
            async queryFn(id) {
                const { data, error } = await supabase.from('sub_categories').select('*').eq('id', id).single();
                if (error && error.code !== 'PGRST116') return { error };
                return {
                    data: data ? { ...data, categoryId: data.category_id } as SubCategory : null
                };
            },
            providesTags: (_, __, id) => [{ type: 'SUBCATEGORY', id }],
        }),
        getSubCategoryByCategoryId: build.query<SubCategory[], string>({
            async queryFn(categoryId) {
                const { data, error } = await supabase.from('sub_categories').select('*').eq('category_id', categoryId);
                if (error) return { error };
                const formatted = (data || []).map(item => ({
                    ...item,
                    categoryId: item.category_id,
                }));
                return { data: formatted as SubCategory[] };
            },
            providesTags: ['SUBCATEGORY'],
        }),

        // --- COLLECTIONS ---
        getAllCollections: build.query<Collections[], void>({
            async queryFn() {
                const { data, error } = await supabase.from('collections').select('*');
                if (error) return { error };
                return { data: data as Collections[] };
            },
            providesTags: ['COLLECTION'],
        }),
        getCollectionById: build.query<Collections[], string[]>({
            async queryFn(collectionIds) {
                if (!collectionIds.length) return { data: [] };
                const { data, error } = await supabase.from('collections').select('*').in('id', collectionIds);
                if (error) return { error };
                return { data: data as Collections[] };
            },
            providesTags: ['COLLECTION'],
        }),
        getCollection: build.query<Collections | null, string>({
            async queryFn(id) {
                const { data, error } = await supabase.from('collections').select('*').eq('id', id).single();
                if (error && error.code !== 'PGRST116') return { error };
                return { data: data as Collections | null };
            },
            providesTags: (_, __, id) => [{ type: 'COLLECTION', id }],
        }),
        getCollectionBySlug: build.query<Collections | null, string>({
            async queryFn(slug) {
                const { data, error } = await supabase.from('collections').select('*').eq('slug', slug).single();
                if (error && error.code !== 'PGRST116') return { error };
                return { data: data as Collections | null };
            },
            providesTags: (_, __, slug) => [{ type: 'COLLECTION', id: slug }],
        }),

        // --- POTS ---
        getAllPots: build.query<PotOption[], void>({
            async queryFn() {
                const { data, error } = await supabase.from('pot_options').select('*');
                if (error) return { error };
                return { data: data as PotOption[] };
            },
            providesTags: ['POT'],
        }),

        // --- SEARCH ---
        getSearch: build.query<SearchResult, string>({
            async queryFn(search) {
                const query = search.trim();

                if (!query) {
                    return {
                        data: {
                            plants: [],
                            accessories: [],
                            categories: [],
                            subCategories: [],
                            collections: [],
                        },
                    };
                }

                const pattern = `%${query}%`;

                const [
                    plantsRes,
                    accessoriesRes,
                    categoriesRes,
                    subCategoriesRes,
                    collectionsRes,
                ] = await Promise.all([
                    supabase
                        .from('plants')
                        .select('*')
                        .or(`name.ilike.${pattern},slug.ilike.${pattern},description.ilike.${pattern},brand.ilike.${pattern},specifications.ilike.${pattern}`)
                        .limit(4),

                    supabase
                        .from('accessories')
                        .select('*')
                        .or(`name.ilike.${pattern},slug.ilike.${pattern},description.ilike.${pattern},brand.ilike.${pattern}`)
                        .limit(2),

                    supabase
                        .from('categories')
                        .select('*')
                        .or(`name.ilike.${pattern},slug.ilike.${pattern},description.ilike.${pattern}`)
                        .limit(3),

                    supabase
                        .from('sub_categories')
                        .select('*')
                        .ilike('name', pattern)
                        .limit(3),
                    supabase
                        .from('collections')
                        .select('*')
                        .or(`name.ilike.${pattern},slug.ilike.${pattern}`)
                        .limit(3),
                ]);

                return {
                    data: {
                        plants: (plantsRes.data || []).map(mapPlant),
                        accessories: (accessoriesRes.data || []).map(mapAccessory),
                        categories: (categoriesRes.data || []) as Category[],
                        subCategories: (subCategoriesRes.data || []).map(item => ({
                            ...item,
                            categoryId: item.category_id,
                        })) as SubCategory[],
                        collections: (collectionsRes.data || []) as Collections[],
                    },
                };
            },
        }),
    }),
});

export const {
    useGetAllPlantsQuery,
    useGetPlantBySlugQuery,
    useGetBannerQuery,
    useGetAllAccessoriesQuery,
    useGetAccessoryBySlugQuery,
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useGetAllSubCategoriesQuery,
    useGetSubCategoryQuery,
    useGetSubCategoryByCategoryIdQuery,
    useGetAllCollectionsQuery,
    useGetCollectionByIdQuery,
    useGetCollectionQuery,
    useGetCollectionBySlugQuery,
    useGetAllPotsQuery,
    useGetSearchQuery,
} = PlantsApi;