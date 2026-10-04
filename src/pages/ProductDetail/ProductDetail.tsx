import { useOutletContext, useParams } from "react-router-dom";
import {
  useGetAccessoryBySlugQuery,
  useGetAllAccessoriesQuery,
  useGetAllPlantsQuery,
  useGetAllPotsQuery,
  useGetCollectionByIdQuery,
  useGetPlantBySlugQuery,
} from "../../api/PlantApi";
import { Box, Divider, Grid, Typography, useTheme } from "@mui/material";
import ErrorPage from "../../components/common/ErrorPage";
import { useEffect, useMemo, useState } from "react";
import ScrollAnimate from "../../components/common/ScrollAnimate";
import ProductGallery from "./ProductGallery";
import ProductHeader from "./ProductHeader";
import ProductPrice from "./ProductPrice";
import PotSelector from "./PotSelector";
import { ProductQuantity } from "./ProductQuantity";
import { ProductSpecsAccordion } from "./ProductSpecsAccordion";
import ProductsSuggested from "./ProductsSuggested";
import ProductsRelated from "./ProductsRelated";
import { useTranslation } from "react-i18next";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { showNotification } from "../../api/uiSlice";
import { selectTotalQtyByProductId } from "../../api/CartSlice";
import { isPlant } from "../../utils/productFilters";
import { addRecentlyViewed } from "../../api/recentlyViewedSlice";
import RecentlyViewedProducts from "../../components/common/RecentlyViewedProducts";



const ProductDetail = () => {

  const theme = useTheme();
  const { slug, lang = "fa" } = useParams<{
    slug: string;
    lang: "fa" | "en";
  }>();
  const { t } = useTranslation()


  // API Queries
  const { data: plant, isLoading: plantLoading, isError: plantError } = useGetPlantBySlugQuery(slug!, { skip: !slug });
  const { data: accessory, isLoading: accessoryLoading, isError: accessoryError } = useGetAccessoryBySlugQuery(slug!, { skip: !slug });
  const { data: plants } = useGetAllPlantsQuery();
  const { data: accessories } = useGetAllAccessoriesQuery();


  const isLoading = plantLoading || accessoryLoading;
  const isError = plantError && accessoryError;

  const currentProduct = plant ?? accessory;

  const collectionIds = currentProduct?.collectionIds ?? [];
  const { data: collections } = useGetCollectionByIdQuery(collectionIds, { skip: collectionIds.length === 0 });

  const { data: potOptions } = useGetAllPotsQuery();

  // State
  const [selectedPotType, setSelectedPotType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);


  // Pot calculations 
  const currentPot = potOptions?.find((pot) => pot.value === selectedPotType);
  const selectedPotColor = currentPot?.colors.find((color) => color?.value === selectedColor);
  const potPrice = selectedPotColor?.price ?? 0;


  // Reset pot on product change
  useEffect(() => {
    setSelectedPotType('');
    setSelectedColor('');
  }, [slug]);

  // Recent visit record
  useEffect(() => {
    if (currentProduct) {
      dispatch(addRecentlyViewed(currentProduct))
    }
  }, [currentProduct])

  // Price Calculation
  const unitPricePaid = useMemo(() => {
    if (!currentProduct) return 0;
    return (currentProduct.discountPrice ?? currentProduct.price) + potPrice;
  }, [currentProduct, potPrice]);

  // Price without discount Calculation
  const unitPrice = useMemo(() => {
    if (!currentProduct) return 0;
    return (currentProduct.price) + potPrice;
  }, [currentProduct, potPrice]);

  // Discount Calculation
  const discountPercentage = useMemo(() => {
    if (!currentProduct || !currentProduct.discountPrice || !currentProduct.price) return 0;
    return Math.round(((currentProduct.price - currentProduct.discountPrice) / currentProduct.price) * 100);
  }, [currentProduct]);

  // Cart & Stock Calculation 
  const maxStock = currentProduct?.stock ?? 0;

  const qtyInCart = useAppSelector((state) =>
    currentProduct ? selectTotalQtyByProductId(currentProduct.id)(state) : 0
  );
  const remainingStock = Math.max(0, maxStock - qtyInCart);
  const noExistent = remainingStock === 0 || qty > remainingStock;
  const handleDecreaseQty = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncreaseQty = () => {
    setQty((prev) => (prev < remainingStock ? prev + 1 : prev));
  };

  useEffect(() => {
    if (remainingStock > 0 && qty > remainingStock) {
      setQty(remainingStock);
    }
  }, [remainingStock]);

  // handle cart drawer
  type LayoutContext = {
    toggleDrawer: (open: boolean) => void;
  };

  const { toggleDrawer } = useOutletContext<LayoutContext>();

  // Snackbar Handlers & Effect
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (qtyInCart >= maxStock && maxStock > 0) {
      dispatch(
        showNotification({
          message: t("productDetail.MaxStockAlert"),
          type: 'warning'
        })
      );
    }
  }, [maxStock, qtyInCart, dispatch, t]);


  // Reset Qty on product/option change
  useEffect(() => {
    setQty(1);
  }, [selectedColor, selectedPotType, slug]);

  // Related products logic with fallback support
  const relatedProducts = useMemo(() => {
    if (!currentProduct) return [];

    const allProducts = [...(plants ?? []), ...(accessories ?? [])];

    const availableProducts = allProducts.filter(
      (product) => product.id !== currentProduct.id && product.inStock);

    const scoredProducts = availableProducts
      .map((product) => ({
        product,
        score: product.tags?.filter((tag) => currentProduct.tags?.includes(tag)).length ?? 0,
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);

    const MIN_REQUIRED_PRODUCTS = 8;
    if (scoredProducts.length >= MIN_REQUIRED_PRODUCTS) {
      return scoredProducts;
    }

    const scoredIds = new Set(scoredProducts.map((p) => p.id));
    const fallbackProducts = availableProducts.filter((p) => !scoredIds.has(p.id));

    return [...scoredProducts, ...fallbackProducts].slice(0, MIN_REQUIRED_PRODUCTS);
  }, [plants, accessories, currentProduct]);


  // Suggested accessories
  const suggestedAccessories = useMemo(() => {
    if (!accessories || !currentProduct) return [];

    return accessories
      .filter((product) => product.id !== currentProduct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [currentProduct, accessories]);

  // Loading & Error Guards
  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || !currentProduct) return <ErrorPage />;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        py: { xs: 4, md: 8 },
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
      }}
    >


      {/* Product Content */}
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: { xs: "95%", sm: "95%", md: "95%", lg: "93%", xl: "84%" },
        }}
      >

        {/* Gallery Column */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <ProductGallery discountPercentage={discountPercentage} product={currentProduct} />
        </Grid>

        {/* Description & Options Column */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
            }}
          >
            {/* Header */}
            <ProductHeader
              product={currentProduct}
              collections={collections || []}
            />

            {/* Description */}
            <ScrollAnimate>
              <Box>
                <Typography>{currentProduct.desc[lang]}</Typography>
              </Box>
              <Divider sx={{ width: "100%", border: "1 solid", my: 3 }} />
            </ScrollAnimate>

            {/* Price */}
            <ProductPrice product={currentProduct} unitPrice={unitPricePaid} />

            {/* Pot Selector */}
            {isPlant(currentProduct) && (
              <PotSelector
                potOptions={potOptions}
                selectedPotType={selectedPotType}
                setSelectedPotType={setSelectedPotType}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedPotColor={selectedPotColor}
                currentPot={currentPot}
              />
            )}

            {/* Quantity Controls & Add to Cart */}
            <ProductQuantity
              product={currentProduct}
              qty={qty}
              onIncrease={handleIncreaseQty}
              onDecrease={handleDecreaseQty}
              finalPricePaid={unitPricePaid}
              finalPrice={unitPrice}
              noExistent={noExistent}
              remainingStock={remainingStock}
              potOption={
                currentPot && selectedPotColor
                  ? {
                    value: currentPot.value,
                    colors: {
                      name: selectedPotColor.name,
                      value: selectedPotColor.value,
                      price: selectedPotColor.price
                    },
                    name: currentPot.name
                  }
                  : null
              }
              toggleDrawer={toggleDrawer}

            />

            <ScrollAnimate>
              <Divider sx={{ width: "100%", border: "1 solid", my: 1 }} />
            </ScrollAnimate>

            {/* Product Specs */}
            <ProductSpecsAccordion product={currentProduct} />

            {/* Suggested Products */}
            {suggestedAccessories.length > 0 && (
              <>
                <ScrollAnimate>
                  <Typography sx={{ mt: 5 }} variant="h4">
                    {t("productDetail.SuggestedProductsLabel")}
                  </Typography>
                </ScrollAnimate>

                <Box sx={{ width: "100%", mt: 3 }}>
                  {suggestedAccessories.map((item) => (
                    <ProductsSuggested key={item.id} product={item} toggleDrawer={toggleDrawer} />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      <Divider
        sx={{
          width: { xs: "95%", sm: "95%", md: "85%", lg: "80%", xl: "80%" },
          border: 1,
          mt: 3,
          mb: 2,
          opacity: 0.5,
        }}
      />

      {/* Related products */}
      <ProductsRelated products={relatedProducts} />

      {/* Recently viewed */}
      <RecentlyViewedProducts />



    </Box>
  );
};

export default ProductDetail;