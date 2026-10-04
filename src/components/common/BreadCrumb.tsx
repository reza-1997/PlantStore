import { Breadcrumbs, Link, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import type { Category, Collections, LocalizedString, SubCategory } from "../../types";

interface BreadCrumbProps {
    categoryId?: string,
    category?: Category | null,
    subCategoryId?: string,
    subCategory?: SubCategory | null,
    collectionId?: string,
    collection?: Collections | null,
    productName?: LocalizedString


}
const BreadCrumb = ({
    categoryId,
    category,
    subCategoryId,
    subCategory,
    collection,
    collectionId,
    productName,
}: BreadCrumbProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { lang = "fa" } = useParams<{ lang: "fa" | "en" }>();
    const { pathname } = useLocation();


    const linkStyle = {
        color: theme.palette.text.primary,
        ":hover": {
            color: theme.palette.secondary.main,
        },
    };

    return (
        <Breadcrumbs aria-label="breadcrumb">

            {/* All Products */}
            <Link
                component={RouterLink}
                to={`/${lang}/products`}
                underline="hover"
                sx={linkStyle}
                style={{ display: pathname === `/${lang}/products` ? 'none' : 'block' }}

            >
                {t("filter.allProducts")}
            </Link>

            {/* Category */}
            {categoryId && category && (
                <Link
                    component={RouterLink}
                    to={`/${lang}/products/category/${category.id}`}
                    underline="hover"
                    sx={linkStyle}
                >
                    {category.name[lang]}
                </Link>
            )}

            {/* SubCategory */}
            {categoryId &&
                category &&
                subCategoryId &&
                subCategory && (
                    <Link
                        component={RouterLink}
                        to={`/${lang}/products/category/${category.id}/subCategory/${subCategory.id}`}
                        underline="hover"
                        sx={linkStyle}
                    >
                        {subCategory.name[lang]}
                    </Link>
                )}

            {/* Collection */}
            {collectionId && collection && (
                <Link
                    component={RouterLink}
                    to={`/${lang}/products/collection/${collection.id}`}
                    underline="hover"
                    sx={linkStyle}
                >
                    {collection.name[lang]}
                </Link>
            )}

            {/* Product */}
            {productName && (
                <Typography color="text.primary">
                    {productName[lang]}
                </Typography>
            )}

        </Breadcrumbs>
    );
};

export default BreadCrumb