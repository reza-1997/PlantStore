import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState, useMemo, useCallback, type ChangeEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  useGetAllAccessoriesQuery,
  useGetAllPlantsQuery,
  useGetCategoryQuery,
  useGetCollectionQuery,
  useGetSubCategoryQuery,
} from "../api/PlantApi";
import ScrollAnimate from "../components/common/ScrollAnimate";
import ProductCard from "../components/common/ProductCard";
import FilterDrawer from "../components/layout/drawer/FilterDrawer";
import ProductsSkeleton from "./ProductsSkeleton";

import ErrorPage from "../components/common/ErrorPage";
import type { FilterState } from "../types";





// Import extracted helpers and static data
import {
  filtering,
  initialFilterState,
  applyCategoryFilters,
  applyAttributeFilters,
  applySorting,
} from "../utils/productFilters";
import BreadCrumb from "../components/common/BreadCrumb";
import { getImageUrl } from "../utils/imageUrl";


const Products = () => {
  const theme = useTheme();

  const { t } = useTranslation();

  // Route parameters
  const { lang = "fa", subCategoryId, categoryId, collectionId } = useParams<{
    lang: "fa" | "en";
    subCategoryId?: string;
    categoryId?: string;
    collectionId?: string;
  }>();

  // Data fetching
  const { data: plants, isLoading: plantsLoading, isError: plantsError } = useGetAllPlantsQuery();
  const { data: accessories, isLoading: accLoading, isError: accError } = useGetAllAccessoriesQuery();

  const { data: category } = useGetCategoryQuery(categoryId ?? "", { skip: !categoryId });
  const { data: subCategory } = useGetSubCategoryQuery(subCategoryId ?? "", { skip: !subCategoryId });
  const { data: collection } = useGetCollectionQuery(collectionId ?? "", { skip: !collectionId });

  // UI state
  const [expanded, setExpanded] = useState<string[]>([]);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [filter, setFilter] = useState<FilterState>(initialFilterState);
  const [showScrollTop, setShowScrollTop] = useState(false);


  // Handlers
  const handleExpansion = (id: string) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleDrawer = (open: boolean) => () => setOpenFilterDrawer(open);

  const handleChangeSorting = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleChangeFiltering = useCallback((event: ChangeEvent<HTMLInputElement>, categoryKey: keyof FilterState) => {
    const { value, checked } = event.target;
    setFilter((prev) => ({
      ...prev,
      [categoryKey]: checked ? [...prev[categoryKey], value] : prev[categoryKey].filter((item) => item !== value),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilter(initialFilterState);
    setExpanded([]);
  }, []);

  // Scroll To Top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Filter pipeline memoization using utility functions
  const filteredProducts = useMemo(() => {
    if (!plants && !accessories) return [];

    const rawProducts = [...(plants || []), ...(accessories || [])];
    const categoryFiltered = applyCategoryFilters(rawProducts, subCategoryId, categoryId, collectionId);
    const attributeFiltered = applyAttributeFilters(categoryFiltered, filter);

    return applySorting(attributeFiltered, sortBy);
  }, [plants, accessories, subCategoryId, categoryId, collectionId, filter, sortBy]);

  // handle filteringChip
  const selectedFilters = useMemo(() => {
    return filtering.flatMap((category) =>
      filter[category.key].flatMap((value) => {
        const option = category.options.find(
          (option) => option.value === value
        );

        if (!option) return [];

        return [
          {
            categoryKey: category.key,
            categoryName: category.name[lang],
            value,
            label: option.name[lang],
          },
        ];
      })
    );
  }, [filter, lang]);

  // Page title generator
  const getPageTitle = () => {

    if (categoryId && category && subCategoryId && subCategory) {
      return (
        <>
          {subCategory.name[lang]}
        </>

      );
    }

    if (categoryId && category) {
      return (
        <>
          {category.name[lang]}
        </>
      );
    }

    if (collectionId && collection) {
      return (
        <>
          {collection.name[lang]}:
        </>
      );
    }

    return t("common.allProducts");
  };

  if (plantsLoading || accLoading) return <ProductsSkeleton />
  if (plantsError || accError) return <ErrorPage />;

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 4, md: 8 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          left: -100,
          backgroundImage: `url(${getImageUrl("background5.png")})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          opacity: theme.palette.mode === "dark" ? 0.1 : 0.5,
          zIndex: -2,
          pointerEvents: "none",
        },

        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >

      {/* Scroll To Top */}
      < Box
        sx={{
          position: "fixed",
          bottom: { xs: 20, md: 30 },
          right: { xs: 20, md: 35 },
          zIndex: 1000,

          opacity: showScrollTop ? 1 : 0,
          visibility: showScrollTop ? "visible" : "hidden",
          transform: showScrollTop ? "translateY(0)" : "translateY(15px)",

          transition: "all 0.3s ease",
        }}
      >
        <Button
          onClick={handleScrollToTop}
          sx={{
            minWidth: 0,
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,

            boxShadow: 3,

            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Button>
      </Box >

      {/* breadcrumb */}
      <Box
        sx={{
          width: { xs: "95%", sm: "95%", md: "95%", lg: "93%", xl: "84%" },
          mb: 4,
        }}
      >
        <BreadCrumb
          category={category}
          categoryId={categoryId}
          subCategory={subCategory}
          subCategoryId={subCategoryId}
          collection={collection}
          collectionId={collectionId}
        />
      </Box>

      {/* Header section */}
      < Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "center", md: "space-between" },
          width: { xs: "95%", sm: "95%", md: "95%", lg: "93%", xl: "84%" },
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{
          fontWeight: 900,
          color: theme.palette.text.primary,
        }}>
          {getPageTitle()}
        </Typography>

        {/* Mobile filter button */}
        <Box sx={{ width: "100%", display: { xs: "flex", md: "none" } }}>
          <Button fullWidth size="large" variant="outlined" sx={{ fontWeight: 800, my: 2, fontSize: 18 }} onClick={toggleDrawer(true)}>
            {t("filter.label")}
          </Button>
        </Box>

        {/* Desktop sorting dropdown */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel>{t("sort.label")}</InputLabel>
            <Select value={sortBy} onChange={handleChangeSorting} autoWidth label={t("sort.label")}>
              <MenuItem value="popular">{t("sort.popular")}</MenuItem>
              <MenuItem value="inStock">{t("sort.inStock")}</MenuItem>
              <MenuItem value="inexpensive">{t("sort.inexpensive")}</MenuItem>
              <MenuItem value="expensive">{t("sort.expensive")}</MenuItem>
              <MenuItem disabled value="newest">{t("sort.newest")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box >

      {/* Main product grid layout */}
      < Box sx={{ width: { xs: "93%", sm: "95%", md: "95%", lg: "93%", xl: "84%" } }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>

          {/* Desktop sidebar filters */}
          <Grid
            size={{ md: 3, lg: 2, xl: 2 }}
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiPaper-root": { backgroundColor: "unset", backgroundImage: "none", boxShadow: "none" },
              zIndex: 2,

            }}
          >
            {filtering.map((item) => (
              <Accordion expanded={expanded.includes(item.key)} onChange={() => handleExpansion(item.key)} key={item.key}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ m: 1, fontWeight: 900 }} component="span">
                    {item.name[lang]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails >
                  {item.options.map((option, index) => (
                    <FormGroup key={index}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={option.value}
                            checked={filter[item.key].includes(option.value)}
                            onChange={(e) => handleChangeFiltering(e, item.key)}
                          />
                        }
                        label={option.name[lang]}

                      />
                    </FormGroup>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
            <Button variant="outlined" onClick={resetFilters} sx={{ mt: 2, p: 1 }} fullWidth>
              {t("filter.resetFilter")}
            </Button>
          </Grid>

          {/* Products column */}
          <Grid size={{ xs: 12, md: 9, lg: 10, xl: 10 }}>

            {/* Selected filters chips */}
            {selectedFilters.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 3,
                  ".MuiChip-root": {
                    backgroundColor: theme.palette.background.paper,
                    border: '1px solid gray'
                  }
                }}
              >
                {selectedFilters.map((item) => (
                  <Chip
                    key={`${item.categoryKey}-${item.value}`}
                    label={`${item.categoryName}: ${item.label}`}
                    onDelete={() => {
                      setFilter((prev) => ({
                        ...prev,
                        [item.categoryKey]: prev[item.categoryKey].filter(
                          (value) => value !== item.value
                        ),
                      }));
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Product cards list */}
            <Grid container spacing={3} sx={{ width: "100%", justifyContent: "flex-start" }}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                    <ScrollAnimate>
                      <ProductCard item={product} />
                    </ScrollAnimate>
                  </Grid>
                ))
              ) : (
                <ScrollAnimate>
                  <Box sx={{ width: "100%", textAlign: "center", py: 8, display: "flex", justifyContent: "center" }}>
                    <Typography variant="h6" color="text.secondary">
                      {t("filter.notFound")}
                    </Typography>
                  </Box>
                </ScrollAnimate>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box >

      {/* Mobile filter drawer */}
      < FilterDrawer
        openDrawer={openFilterDrawer}
        toggleDrawer={toggleDrawer}
        handleChangeSorting={handleChangeSorting}
        sortBy={sortBy}
        filter={filter}
        deleteFilter={resetFilters}
        handleChangeFiltering={handleChangeFiltering}
      />
    </Box >
  );
};

export default Products;