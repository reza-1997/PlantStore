import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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

export const PlantsApi = createApi({
    reducerPath: 'plantApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000' }),
    tagTypes: ['PLANT', 'ACCESSORY', 'BANNER', 'CATEGORY', 'SUBCATEGORY', 'COLLECTION', 'POT'],
    endpoints: (build) => ({
        // --- PLANTS ---
        getAllPlants: build.query<Plant[], void>({
            query: () => "/plants",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ slug }) => ({ type: 'PLANT' as const, id: slug })),
                        { type: 'PLANT', id: 'LIST' },
                    ]
                    : [{ type: 'PLANT', id: 'LIST' }],
        }),
        getPlantBySlug: build.query<Plant | null, string>({
            query: (slug) => `/plants?slug=${slug}`,
            transformResponse: (response: Plant[]) => response[0] ?? null,
            providesTags: (_, __, slug) => [{ type: 'PLANT', id: slug }],
        }),

        // --- BANNERS ---
        getBanner: build.query<Banner, void>({
            query: () => `/banners`,
            providesTags: ['BANNER'],
        }),

        // --- ACCESSORIES ---
        getAllAccessories: build.query<Accessory[], void>({
            query: () => "/accessories",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ slug }) => ({ type: 'ACCESSORY' as const, id: slug })),
                        { type: 'ACCESSORY', id: 'LIST' },
                    ]
                    : [{ type: 'ACCESSORY', id: 'LIST' }],
        }),
        getAccessoryBySlug: build.query<Accessory | null, string>({
            query: (slug) => `/accessories?slug=${slug}`,
            transformResponse: (response: Accessory[]) => response[0] ?? null,
            providesTags: (_, __, slug) => [{ type: 'ACCESSORY', id: slug }],
        }),

        // --- CATEGORIES ---
        getCategories: build.query<Category[], void>({
            query: () => "/categories",
            providesTags: ['CATEGORY'],
        }),
        getCategory: build.query<Category | null, string>({
            query: (id) => `/categories?id=${id}`,
            transformResponse: (response: Category[]) => response[0] ?? null,
            providesTags: (_, __, id) => [{ type: 'CATEGORY', id }],
        }),

        // --- SUB-CATEGORIES ---
        getAllSubCategories: build.query<SubCategory[], void>({
            query: () => "/subCategories",
            providesTags: ['SUBCATEGORY'],
        }),
        getSubCategory: build.query<SubCategory | null, string>({
            query: (id) => `/subCategories?id=${id}`,
            transformResponse: (response: SubCategory[]) => response[0] ?? null,
            providesTags: (_, __, id) => [{ type: 'SUBCATEGORY', id }],
        }),
        getSubCategoryByCategoryId: build.query<SubCategory[], string>({
            query: (categoryId) => `/subCategories?categoryId=${categoryId}`,
            providesTags: ['SUBCATEGORY'],
        }),

        // --- COLLECTIONS ---
        getAllCollections: build.query<Collections[], void>({
            query: () => "/collections",
            providesTags: ['COLLECTION'],
        }),
        getCollectionById: build.query<Collections[], string[]>({
            query: (collectionIds) => {
                const params = collectionIds
                    .map((id) => `id=${encodeURIComponent(id)}`)
                    .join("&");
                return `/collections?${params}`;
            },
            providesTags: ['COLLECTION'],
        }),
        getCollection: build.query<Collections | null, string>({
            query: (id) => `/collections?id=${id}`,
            transformResponse: (response: Collections[]) => response[0] ?? null,
            providesTags: (_, __, id) => [{ type: 'COLLECTION', id }],
        }),
        getCollectionBySlug: build.query<Collections | null, string>({
            query: (slug) => `/collections?slug=${slug}`,
            transformResponse: (response: Collections[]) => response[0] ?? null,
            providesTags: (_, __, slug) => [{ type: 'COLLECTION', id: slug }],
        }),
        // --- POTS ---
        getAllPots: build.query<PotOption[], void>({
            query: () => "/potOptions",
            providesTags: ['POT'],
        }),

        // --- SEARCH ---
        getSearch: build.query<SearchResult, string>({
            async queryFn(search, _queryApi, _extraOptions, fetchWithBQ) {
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

                const [
                    plantsResult,
                    accessoriesResult,
                    categoriesResult,
                    subCategoriesResult,
                    collectionsResult,
                ] = await Promise.all([
                    fetchWithBQ(`/plants?q=${encodeURIComponent(query)}`),
                    fetchWithBQ(`/accessories?q=${encodeURIComponent(query)}`),
                    fetchWithBQ(`/categories?q=${encodeURIComponent(query)}`),
                    fetchWithBQ(`/subCategories?q=${encodeURIComponent(query)}`),
                    fetchWithBQ(`/collections?q=${encodeURIComponent(query)}`),
                ]);

                const firstError =
                    plantsResult.error ||
                    accessoriesResult.error ||
                    categoriesResult.error ||
                    subCategoriesResult.error ||
                    collectionsResult.error;

                if (firstError) {
                    return { error: firstError };
                }

                return {
                    data: {
                        plants: (plantsResult.data as Plant[] || []).slice(0, 4),
                        accessories: (accessoriesResult.data as Accessory[] || []).slice(0, 2),
                        categories: (categoriesResult.data as Category[] || []).slice(0, 3),
                        subCategories: (subCategoriesResult.data as SubCategory[] || []).slice(0, 3),
                        collections: (collectionsResult.data as Collections[] || []).slice(0, 3),
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