import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/home/Home";
import Products from "../pages/Products";
import Login from "../pages/Login";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import { LanguageWrapper } from "../components/common/LanguageWrapper";
import Cart from "../pages/Cart";
import SearchResults from "../pages/SearchResults";
import Register from "../pages/Register";
import AccountOverview from "../pages/Account/AccountOverview";
import ProtectedRoute from "../components/common/ProtectedRoute";
import WishlistPage from "../pages/Account/WishlistPage";
import AccountLayout from "../pages/Account/AccountLayout";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/fa" replace />,
    },
    {
        path: "/:lang",
        element: <LanguageWrapper />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "products",
                        element: <Products />,
                    },
                    {
                        path: "products/category/:categoryId/subCategory/:subCategoryId",
                        element: <Products />
                    },
                    // {
                    //     path: "products/subCategory/:subCategoryId",
                    //     element: <Products />
                    // },
                    {
                        path: "products/category/:categoryId",
                        element: <Products />
                    },
                    {
                        path: "products/collection/:collectionId",
                        element: <Products />
                    },
                    {
                        path: "product/:slug",
                        element: <ProductDetail />,
                    },
                    {
                        path: "login",
                        element: <Login />,
                    },
                    {
                        path: "cart",
                        element: <Cart />,
                    },
                    {
                        path: "search",
                        element: <SearchResults />
                    },
                    {
                        path: "register",
                        element: <Register />
                    },
                    {
                        element: <ProtectedRoute />,
                        children: [
                            {
                                path: 'account',
                                element: <AccountLayout />,
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate to="overview" replace />,
                                    },
                                    {
                                        path: "overview",
                                        element: <AccountOverview />,
                                    },
                                    {
                                        path: "wishlist",
                                        element: <WishlistPage />,
                                    },
                                ]
                            }
                        ],
                    },

                ],
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/fa" replace />,
    },
]);